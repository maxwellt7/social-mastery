import { Router } from 'express'
import * as campaignController from '../controllers/campaignController'

const router = Router()

router.post('/', campaignController.createCampaign)
router.get('/', campaignController.getCampaigns)
router.get('/:id', campaignController.getCampaign)
router.patch('/:id', campaignController.updateCampaign)

export default router

