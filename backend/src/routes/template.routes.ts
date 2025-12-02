import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as templateController from '../services/template.service.js'

const router = Router()

// POST /api/templates/from-ig-post
router.post('/from-ig-post', asyncHandler(templateController.createFromIGPost))

// GET /api/templates
router.get('/', asyncHandler(templateController.listTemplates))

// GET /api/templates/:id
router.get('/:id', asyncHandler(templateController.getTemplate))

// PUT /api/templates/:id
router.put('/:id', asyncHandler(templateController.updateTemplate))

// DELETE /api/templates/:id
router.delete('/:id', asyncHandler(templateController.deleteTemplate))

export default router

