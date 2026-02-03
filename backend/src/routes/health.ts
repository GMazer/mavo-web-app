import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: (process as any).uptime()
  });
});

export default router;