import { Request, Response, NextFunction } from 'express'
import * as scriptService from '../services/scriptService'

export const generateScripts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.body
    const scripts = await scriptService.generateScripts(request)
    res.json(scripts)
  } catch (error) {
    next(error)
  }
}

export const getScripts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.query
    const scripts = await scriptService.getScripts(offerId as string)
    res.json(scripts)
  } catch (error) {
    next(error)
  }
}

export const getScript = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const script = await scriptService.getScript(id)
    res.json(script)
  } catch (error) {
    next(error)
  }
}

export const updateScript = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body
    const script = await scriptService.updateScript(id, updates)
    res.json(script)
  } catch (error) {
    next(error)
  }
}

export const getVideoByScript = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const video = await scriptService.getVideoByScript(id)
    res.json(video)
  } catch (error) {
    next(error)
  }
}

