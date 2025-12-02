import { Router } from 'express'
import offerRoutes from './offerRoutes'
import igRoutes from './igRoutes'
import templateRoutes from './templateRoutes'
import scriptRoutes from './scriptRoutes'
import campaignRoutes from './campaignRoutes'
import creatifyRoutes from './creatifyRoutes'
import analyticsRoutes from './analyticsRoutes'

const router = Router()

router.use('/offer', offerRoutes)
router.use('/ig', igRoutes)
router.use('/templates', templateRoutes)
router.use('/scripts', scriptRoutes)
router.use('/campaigns', campaignRoutes)
router.use('/creatify', creatifyRoutes)
router.use('/analytics', analyticsRoutes)

export default router

