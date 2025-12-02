import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as creatifyController from '../services/creatify.service.js'

const router = Router()

// POST /api/creatify/create-video
router.post('/create-video', asyncHandler(creatifyController.createVideo))

// GET /api/creatify/job-status/:id
router.get('/job-status/:id', asyncHandler(creatifyController.getJobStatus))

// GET /api/creatify/avatars
router.get('/avatars', asyncHandler(creatifyController.listAvatars))

// GET /api/creatify/voices
router.get('/voices', asyncHandler(creatifyController.listVoices))

export default router

