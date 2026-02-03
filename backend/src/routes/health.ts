import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: (process as any).uptime()
  });
});

export default router;