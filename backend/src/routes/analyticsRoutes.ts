import { Router } from 'express'
import * as analyticsController from '../controllers/analyticsController'

const router = Router()

router.get('/summary', analyticsController.getSummary)
router.post('/insights', analyticsController.getInsights)
router.post('/refresh', analyticsController.refreshMetrics)

export default router

