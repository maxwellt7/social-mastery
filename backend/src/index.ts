import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/errorHandler.js'
import { logger } from './utils/logger.js'
import offerRoutes from './routes/offer.routes.js'
import igRoutes from './routes/ig.routes.js'
import templateRoutes from './routes/template.routes.js'
import scriptRoutes from './routes/script.routes.js'
import creatifyRoutes from './routes/creatify.routes.js'
import campaignRoutes from './routes/campaign.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/offer', offerRoutes)
app.use('/api/ig', igRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/scripts', scriptRoutes)
app.use('/api/creatify', creatifyRoutes)
app.use('/api/campaigns', campaignRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app

