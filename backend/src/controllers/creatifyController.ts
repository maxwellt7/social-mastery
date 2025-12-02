import { Request, Response, NextFunction } from 'express'
import * as creatifyService from '../services/creatifyService'

export const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { scriptId } = req.body
    const videoAsset = await creatifyService.createVideo(scriptId)
    res.json(videoAsset)
  } catch (error) {
    next(error)
  }
}

export const getVideoStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const videoAsset = await creatifyService.getVideoStatus(id)
    res.json(videoAsset)
  } catch (error) {
    next(error)
  }
}

