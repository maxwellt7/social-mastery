import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as igController from '../services/ig.service.js'

const router = Router()

// POST /api/ig/search-high-performers
router.post('/search-high-performers', asyncHandler(igController.searchHighPerformers))

// POST /api/ig/publish
router.post('/publish', asyncHandler(igController.publishPost))

// GET /api/ig/posts/:id/metrics
router.get('/posts/:id/metrics', asyncHandler(igController.getPostMetrics))

export default router

