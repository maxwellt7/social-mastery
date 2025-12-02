import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../middleware/errorHandler'
import * as offerService from '../services/offerService'

export const uploadPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded')
    }
    
    const { offerName } = req.body
    if (!offerName) {
      throw new ApiError(400, 'Offer name is required')
    }

    const result = await offerService.uploadAndProcessPdf(req.file, offerName)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offers = await offerService.getAllOffers()
    res.json(offers)
  } catch (error) {
    next(error)
  }
}

export const getOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const offer = await offerService.getOfferById(id)
    res.json(offer)
  } catch (error) {
    next(error)
  }
}

export const getOfferProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const profile = await offerService.getOfferProfile(id)
    res.json(profile)
  } catch (error) {
    next(error)
  }
}

export const getPlaybook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const playbook = await offerService.getCurrentPlaybook(id)
    res.json(playbook)
  } catch (error) {
    next(error)
  }
}

export const updateAIDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const performanceData = req.body
    const playbook = await offerService.updateAIDirector(id, performanceData)
    res.json(playbook)
  } catch (error) {
    next(error)
  }
}

export const mapVariables = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { templateId, placeholders } = req.body
    const mappings = await offerService.mapVariables(id, templateId, placeholders)
    res.json(mappings)
  } catch (error) {
    next(error)
  }
}

