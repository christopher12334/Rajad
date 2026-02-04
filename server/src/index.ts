import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { tracksRouter } from './routes/tracks.js';
import { maaametRouter } from './routes/maaamet.js';
import { uploadsRouter } from './routes/uploads.js';
import { reviewsRouter } from './routes/reviews.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));

const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins, // ok: allow listed origins
    credentials: true,
  }),
);

app.use(express.json({ limit: '2mb' }));

// Serve uploaded images
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', immutable: false }));

// Health + root
app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/', (req, res) => res.send('OK'));

// API routes
app.use('/api/tracks', tracksRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/maaamet', maaametRouter);

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
