import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db/database.js';
import { authRouter } from './routes/auth.routes.js';
import { appliancesRouter } from './routes/appliances.routes.js';
import { systemsRouter } from './routes/systems.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'SolarWise BG API' }));
app.use('/api/auth', authRouter);
app.use('/api/appliances', appliancesRouter);
app.use('/api/systems', systemsRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`SolarWise BG API listening on http://localhost:${port}`);
});
