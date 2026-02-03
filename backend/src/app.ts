import express, { Express } from 'express';
import cors from 'cors';
import healthRouter from './routes/health';

const app: Express = express();
const PORT = process.env.PORT || 8080;

app.use(cors() as any);
app.use(express.json() as any);

// API Routes
app.use('/api/health', healthRouter);

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

export default app;