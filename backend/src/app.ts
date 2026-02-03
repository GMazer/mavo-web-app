import express, { Express } from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import productsRouter from './routes/products';

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors() as any);
app.use(express.json() as any);

// Logging Middleware: Helps see incoming requests in terminal
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Silence /favicon.ico 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

export default app;