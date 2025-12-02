import { Request, Response, NextFunction } from 'express'
import * as analyticsService from '../services/analyticsService'

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.query as any
    const summary = await analyticsService.getSummary(request)
    res.json(summary)
  } catch (error) {
    next(error)
  }
}

export const getInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.body
    const insights = await analyticsService.getInsights(offerId)
    res.json(insights)
  } catch (error) {
    next(error)
  }
}

export const refreshMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.body
    await analyticsService.refreshMetrics(offerId)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

