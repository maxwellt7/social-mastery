import { Request, Response, NextFunction } from 'express'
import * as templateService from '../services/templateService'

export const createFromIGPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = req.body
    const template = await templateService.createFromIGPost(request)
    res.json(template)
  } catch (error) {
    next(error)
  }
}

export const getTemplates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.query
    const templates = await templateService.getTemplates(offerId as string)
    res.json(templates)
  } catch (error) {
    next(error)
  }
}

export const getTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const template = await templateService.getTemplate(id)
    res.json(template)
  } catch (error) {
    next(error)
  }
}

export const updateTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const updates = req.body
    const template = await templateService.updateTemplate(id, updates)
    res.json(template)
  } catch (error) {
    next(error)
  }
}

export const deleteTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    await templateService.deleteTemplate(id)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

export const saveVariableMapping = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mapping = req.body
    const result = await templateService.saveVariableMapping(mapping)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getVariableMappings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const mappings = await templateService.getVariableMappings(id)
    res.json(mappings)
  } catch (error) {
    next(error)
  }
}

