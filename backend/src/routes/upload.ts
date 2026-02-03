import { Hono } from 'hono';
import { AwsClient } from 'aws4fetch';
import { Bindings } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// POST /api/uploads/presign
app.post('/presign', async (c) => {
    try {
        const body = await c.req.json();
        const { filename, contentType } = body;

        if (!filename || !contentType) {
            return c.json({ error: "Missing filename or contentType" }, 400);
        }

        // 1. Initialize AwsClient (aws4fetch)
        // Note: Using environment variables instead of R2 binding to support signing logic
        const r2 = new AwsClient({
            accessKeyId: c.env.R2_ACCESS_KEY_ID,
            secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
            service: 's3',
            region: 'auto',
        });

        // 2. Generate unique key (folder/timestamp_filename)
        const key = `products/${Date.now()}_${filename.replace(/\s+/g, '-')}`;

        // 3. Construct the R2 Endpoint URL for this specific file
        // Format: https://<accountid>.r2.cloudflarestorage.com/<bucket>/<key>
        const endpointUrl = new URL(
            `https://${c.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${c.env.R2_BUCKET_NAME}/${key}`
        );

        // 4. Sign the URL for a PUT request
        // signQuery: true puts the signature in the URL query params
        const signedRequest = await r2.sign(endpointUrl, {
            method: 'PUT',
            aws: { signQuery: true },
            headers: {
                'Content-Type': contentType
            }
        });

        const uploadUrl = signedRequest.url;
        
        // 5. Construct the public URL (what we will save to DB)
        // Ensure R2_PUBLIC_DOMAIN does not have a trailing slash
        const publicUrl = `${c.env.R2_PUBLIC_DOMAIN}/${key}`;

        return c.json({
            uploadUrl,
            publicUrl,
            key
        });

    } catch (e: any) {
        console.error("Presign error:", e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;