import { Router } from 'express'
import * as scriptController from '../controllers/scriptController'

const router = Router()

router.post('/generate', scriptController.generateScripts)
router.get('/', scriptController.getScripts)
router.get('/:id', scriptController.getScript)
router.patch('/:id', scriptController.updateScript)
router.get('/:id/video', scriptController.getVideoByScript)

export default router

