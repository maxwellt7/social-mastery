import { Router } from 'express'
import { upload } from '../middleware/upload'
import * as offerController from '../controllers/offerController'

const router = Router()

router.post('/upload-pdf', upload.single('file'), offerController.uploadPdf)
router.get('/', offerController.getOffers)
router.get('/:id', offerController.getOffer)
router.get('/:id/profile', offerController.getOfferProfile)
router.get('/:id/playbook', offerController.getPlaybook)
router.post('/:id/update-ai-director', offerController.updateAIDirector)
router.post('/:id/map-variables', offerController.mapVariables)

export default router

