import * as express from 'express'
export {};

declare global {
    namespace Express {
      interface Request {
        userId: string
      }
    }
}