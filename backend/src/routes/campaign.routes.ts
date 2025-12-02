import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as campaignController from '../services/campaign.service.js'

const router = Router()

// POST /api/campaigns
router.post('/', asyncHandler(campaignController.createCampaign))

// GET /api/campaigns
router.get('/', asyncHandler(campaignController.listCampaigns))

// GET /api/campaigns/:id
router.get('/:id', asyncHandler(campaignController.getCampaign))

// PUT /api/campaigns/:id
router.put('/:id', asyncHandler(campaignController.updateCampaign))

// DELETE /api/campaigns/:id
router.delete('/:id', asyncHandler(campaignController.deleteCampaign))

export default router

