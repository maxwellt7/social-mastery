import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.js'
import * as scriptController from '../services/script.service.js'

const router = Router()

// POST /api/scripts/generate
router.post('/generate', asyncHandler(scriptController.generateScripts))

// GET /api/scripts
router.get('/', asyncHandler(scriptController.listScripts))

// GET /api/scripts/:id
router.get('/:id', asyncHandler(scriptController.getScript))

// PUT /api/scripts/:id
router.put('/:id', asyncHandler(scriptController.updateScript))

// DELETE /api/scripts/:id
router.delete('/:id', asyncHandler(scriptController.deleteScript))

export default router

