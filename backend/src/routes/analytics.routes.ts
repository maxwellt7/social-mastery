import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as analyticsController from '../services/analytics.service.js'

const router = Router()

// GET /api/analytics/summary
router.get('/summary', asyncHandler(analyticsController.getSummary))

// POST /api/analytics/insights
router.post('/insights', asyncHandler(analyticsController.generateInsights))

// GET /api/analytics/performance/:postId
router.get('/performance/:postId', asyncHandler(analyticsController.getPostPerformance))

export default router

