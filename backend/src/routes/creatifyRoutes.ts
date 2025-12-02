import { Router } from 'express'
import * as creatifyController from '../controllers/creatifyController'

const router = Router()

router.post('/create-video', creatifyController.createVideo)
router.get('/video-status/:id', creatifyController.getVideoStatus)

export default router

