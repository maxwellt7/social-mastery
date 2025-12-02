import { Request, Response, NextFunction } from 'express'
import * as igService from '../services/igService'

export const searchHighPerformers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchParams = req.body
    const posts = await igService.searchHighPerformers(searchParams)
    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export const getPublishedPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { offerId } = req.query
    const posts = await igService.getPublishedPosts(offerId as string)
    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const post = await igService.getPost(id)
    res.json(post)
  } catch (error) {
    next(error)
  }
}

export const getPostMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const metrics = await igService.getPostMetrics(id)
    res.json(metrics)
  } catch (error) {
    next(error)
  }
}

export const publish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publishData = req.body
    const result = await igService.publish(publishData)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

