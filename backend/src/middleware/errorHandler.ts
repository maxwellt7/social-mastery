import { Request, Response, NextFunction, RequestHandler } from 'express'

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  })
}

export class ApiError extends Error implements AppError {
  statusCode: number
  isOperational: boolean

  constructor(messageOrStatusCode: string | number, statusCodeOrMessage: number | string = 500, isOperational = true) {
    const message = typeof messageOrStatusCode === 'string' ? messageOrStatusCode : String(statusCodeOrMessage)
    const statusCode = typeof messageOrStatusCode === 'number' ? messageOrStatusCode : (typeof statusCodeOrMessage === 'number' ? statusCodeOrMessage : 500)
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}
