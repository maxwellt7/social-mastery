import { Router } from 'express'
import * as igController from '../controllers/igController'

const router = Router()

router.post('/search-high-performers', igController.searchHighPerformers)
router.get('/posts', igController.getPublishedPosts)
router.get('/posts/:id', igController.getPost)
router.get('/posts/:id/metrics', igController.getPostMetrics)
router.post('/publish', igController.publish)

export default router

