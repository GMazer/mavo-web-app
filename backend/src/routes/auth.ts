
import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import * as bcrypt from 'bcryptjs';
import * as OTPAuth from 'otpauth';
import { Bindings } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// 1. SETUP FIRST ADMIN (Only works if no admins exist)
// Returns: QR Code URL and Secret to scan
app.post('/setup', async (c) => {
    try {
        const { username, password } = await c.req.json();
        if (!username || !password) return c.json({ error: "Missing fields" }, 400);

        // Check if DB is ready
        try {
            const countRes = await c.env.DB.prepare("SELECT COUNT(*) as count FROM Admins").first() as { count: number };
            if (countRes.count > 0) {
                return c.json({ error: "Admin already exists. Please login." }, 403);
            }
        } catch (dbError: any) {
            // If table doesn't exist, this might throw
            return c.json({ error: "Database Error: Could not check Admins table. Did you run 'npm run db:update:prod'?", details: dbError.message }, 500);
        }

        // Generate TOTP Secret
        const secret = new OTPAuth.Secret({ size: 20 });
        const secretStr = secret.base32;

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to DB
        const id = crypto.randomUUID();
        await c.env.DB.prepare("INSERT INTO Admins (id, username, password, twoFactorSecret, createdAt) VALUES (?, ?, ?, ?, ?)")
            .bind(id, username, hashedPassword, secretStr, new Date().toISOString())
            .run();

        // Generate TOTP Object for URL
        const totp = new OTPAuth.TOTP({
            issuer: "MavoFashion",
            label: username,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: secret
        });

        return c.json({
            success: true,
            message: "Admin created. Please scan QR Code in Google Authenticator.",
            secret: secretStr,
            otpauth_url: totp.toString() // Frontend generates QR from this
        });

    } catch (e: any) {
        console.error("Setup Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

// 2. CHECK ADMIN EXISTS (To show Setup or Login screen)
app.get('/check-init', async (c) => {
    try {
        const countRes = await c.env.DB.prepare("SELECT COUNT(*) as count FROM Admins").first() as { count: number };
        return c.json({ initialized: countRes.count > 0 });
    } catch (e: any) {
        console.error("Check-Init DB Error:", e);
        // If table missing, return false to trigger Setup (setup will fail with DB error but clearer)
        // Or return error to frontend
        return c.json({ 
            initialized: false, 
            error: "Database check failed. Table 'Admins' might be missing.",
            details: e.message 
        });
    }
});

// 3. LOGIN STEP 1: Verify Password
app.post('/login', async (c) => {
    try {
        const { username, password } = await c.req.json();
        
        const admin = await c.env.DB.prepare("SELECT * FROM Admins WHERE username = ?").bind(username).first() as any;
        
        if (!admin) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        // Password OK, require 2FA
        return c.json({ 
            success: true, 
            require2fa: true,
            tempToken: username // Simple identifier for next step (in prod, sign a temp jwt)
        });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 4. LOGIN STEP 2: Verify TOTP and Issue Token
app.post('/verify-2fa', async (c) => {
    try {
        const { username, code } = await c.req.json();
        
        const admin = await c.env.DB.prepare("SELECT * FROM Admins WHERE username = ?").bind(username).first() as any;
        if (!admin) return c.json({ error: "User not found" }, 401);

        const totp = new OTPAuth.TOTP({
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(admin.twoFactorSecret)
        });

        const delta = totp.validate({ token: code, window: 1 });

        if (delta === null) {
            return c.json({ error: "Invalid 2FA Code" }, 401);
        }

        // Generate JWT
        const secret = c.env.JWT_SECRET || 'fallback-secret-dev';
        const token = await sign({
            sub: admin.id,
            username: admin.username,
            role: 'admin',
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
        }, secret, 'HS256');

        return c.json({
            success: true,
            token,
            username: admin.username
        });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 5. CHANGE PASSWORD
app.put('/change-password', async (c) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader) return c.json({ error: "Unauthorized" }, 401);
        
        const token = authHeader.split(' ')[1];
        const secret = c.env.JWT_SECRET || 'fallback-secret-dev';
        
        // Verify Token
        let payload;
        try {
            payload = await verify(token, secret, 'HS256');
        } catch (err) {
            return c.json({ error: "Invalid Token" }, 401);
        }

        const { oldPassword, newPassword } = await c.req.json();
        if (!oldPassword || !newPassword) return c.json({ error: "Missing required fields" }, 400);

        // Fetch Admin
        const adminId = payload.sub;
        const admin = await c.env.DB.prepare("SELECT * FROM Admins WHERE id = ?").bind(adminId).first() as any;

        if (!admin) return c.json({ error: "Admin not found" }, 404);

        // Verify Old Password
        const validPass = await bcrypt.compare(oldPassword, admin.password);
        if (!validPass) {
            return c.json({ error: "Mật khẩu cũ không chính xác" }, 400);
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update DB
        await c.env.DB.prepare("UPDATE Admins SET password = ? WHERE id = ?")
            .bind(hashedNewPassword, adminId)
            .run();

        return c.json({ success: true, message: "Đổi mật khẩu thành công" });

    } catch (e: any) {
        console.error("Change Password Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

// 6. RECOVER 2FA (Get Secret by Password)
app.post('/recover', async (c) => {
    try {
        const { username, password } = await c.req.json();
        
        const admin = await c.env.DB.prepare("SELECT * FROM Admins WHERE username = ?").bind(username).first() as any;
        if (!admin) return c.json({ error: "Invalid credentials" }, 401);

        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) return c.json({ error: "Invalid credentials" }, 401);

        // Re-generate URL
        const totp = new OTPAuth.TOTP({
            issuer: "MavoFashion",
            label: username,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(admin.twoFactorSecret)
        });

        return c.json({
            success: true,
            secret: admin.twoFactorSecret,
            otpauth_url: totp.toString()
        });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// 7. DEBUG: Get Current 2FA Code (DEV ONLY)
app.get('/debug-2fa', async (c) => {
    try {
        const username = c.req.query('username');
        if (!username) return c.json({ error: "Missing username" }, 400);

        const admin = await c.env.DB.prepare("SELECT * FROM Admins WHERE username = ?").bind(username).first() as any;
        if (!admin) return c.json({ error: "User not found" }, 404);

        const totp = new OTPAuth.TOTP({
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            secret: OTPAuth.Secret.fromBase32(admin.twoFactorSecret)
        });

        const currentCode = totp.generate();
        
        return c.json({
            username: admin.username,
            secret: admin.twoFactorSecret,
            currentCode: currentCode,
            message: "This is for debugging only. Do not expose in production."
        });

    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

export default app;
