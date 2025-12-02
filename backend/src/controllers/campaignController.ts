import { Request, Response, NextFunction } from 'express'
import * as campaignService from '../services/campaignService'

export const createCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.body
    const campaign = await campaignService.createCampaign(request)
    res.json(campaign)
  } catch (error) {
    next(error)
  }
}

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.query
    const campaigns = await campaignService.getCampaigns(offerId as string)
    res.json(campaigns)
  } catch (error) {
    next(error)
  }
}

export const getCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const campaign = await campaignService.getCampaign(id)
    res.json(campaign)
  } catch (error) {
    next(error)
  }
}

export const updateCampaign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body
    const campaign = await campaignService.updateCampaign(id, updates)
    res.json(campaign)
  } catch (error) {
    next(error)
  }
}

