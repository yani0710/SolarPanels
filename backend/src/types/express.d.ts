import type { UserRecord } from '../db/models.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserRecord;
    }
  }
}
