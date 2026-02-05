
import { Hono } from 'hono';
import { Bindings, D1Result } from '../bindings';

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/dashboard
app.get('/', async (c) => {
    try {
        // 1. Fetch Orders (For stats & chart)
        const { results: orders } = await c.env.DB.prepare("SELECT * FROM Orders ORDER BY createdAt DESC").all() as D1Result<any>;

        // 2. Fetch Products (For category distribution)
        const { results: products } = await c.env.DB.prepare("SELECT id, category, images FROM Products").all() as D1Result<any>;

        // --- CALCULATIONS ---

        // A. General Stats
        const totalOrders = orders.length;
        // Filter valid orders for revenue (completed or processing)
        const validOrders = orders.filter(o => o.status === 'completed'); 
        const totalRevenue = validOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        // Average Order Value (based on valid orders)
        const avgOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

        // Unique Customers
        const uniqueCustomers = new Set(orders.map(o => o.customerEmail || o.customerPhone)).size;

        // B. Chart Data (Last 7 Days Revenue)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0]; // YYYY-MM-DD
        });

        const revenueChart = last7Days.map(date => {
            const dayRevenue = orders
                .filter(o => (o.status === 'completed' || o.status === 'processing') && o.createdAt.startsWith(date))
                .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            return { date, value: dayRevenue };
        });

        // C. Top Categories (Based on Product Inventory Count)
        const categoryCounts: Record<string, number> = {};
        products.forEach(p => {
            const cat = p.category || 'Khác';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        const totalProductCount = products.length;
        const topCategories = Object.entries(categoryCounts)
            .map(([name, count]) => ({ 
                name, 
                count, 
                percent: totalProductCount > 0 ? Math.round((count / totalProductCount) * 100) : 0 
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

        // D. Top Selling Products
        const productSales: Record<string, { name: string, price: number, sold: number, revenue: number, img: string }> = {};
        
        orders.forEach(order => {
            if (order.status !== 'cancelled') {
                let items = [];
                try { items = JSON.parse(order.items); } catch(e) {}
                
                items.forEach((item: any) => {
                    if (!productSales[item.id]) {
                        // Find image from products array (inefficient lookup but okay for small dataset)
                        const prod = products.find(p => p.id === item.id);
                        let imgUrl = '';
                        if (prod && prod.images) {
                            try { imgUrl = JSON.parse(prod.images)[0]; } catch(e) {}
                        }

                        productSales[item.id] = { 
                            name: item.name, 
                            price: item.price, 
                            sold: 0, 
                            revenue: 0,
                            img: imgUrl
                        };
                    }
                    productSales[item.id].sold += item.quantity;
                    productSales[item.id].revenue += item.price * item.quantity;
                });
            }
        });

        const topSelling = Object.values(productSales)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5);

        // E. Recent Orders
        const recentOrders = orders.slice(0, 5).map(o => ({
            id: o.id,
            customer: o.customerName,
            status: o.status,
            amount: o.totalAmount,
            createdAt: o.createdAt
        }));

        return c.json({
            stats: {
                totalRevenue,
                totalOrders,
                newCustomers: uniqueCustomers,
                avgOrderValue
            },
            chart: revenueChart,
            topCategories,
            topProducts: topSelling,
            recentOrders,
            totalProducts: totalProductCount
        });

    } catch (e: any) {
        console.error("Dashboard Error:", e);
        return c.json({ error: e.message }, 500);
    }
});

export default app;
