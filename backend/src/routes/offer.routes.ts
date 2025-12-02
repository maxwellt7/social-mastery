import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import { upload } from '../middleware/upload.js'
import * as offerController from '../services/offer.service.js'

const router = Router()

// POST /api/offer/upload-pdf
router.post('/upload-pdf', upload.single('pdf'), asyncHandler(offerController.uploadPdf))

// GET /api/offer/:id
router.get('/:id', asyncHandler(offerController.getOffer))

// GET /api/offer/:id/profile
router.get('/:id/profile', asyncHandler(offerController.getOfferProfile))

// POST /api/offer/:id/update-ai-director
router.post('/:id/update-ai-director', asyncHandler(offerController.updateAIDirector))

// GET /api/offer - List all offers
router.get('/', asyncHandler(offerController.listOffers))

export default router

