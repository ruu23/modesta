// src/types/express.d.ts
import { IUser } from '../src/models/User'

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}