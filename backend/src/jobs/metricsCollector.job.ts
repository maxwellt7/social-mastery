import { Queue, Worker } from 'bullmq'
import redis from '../utils/redis.js'
import prisma from '../utils/prisma.js'
import { instagramClient } from '../integrations/instagram.client.js'
import { logger } from '../utils/logger.js'

export const metricsCollectorQueue = new Queue('metrics-collector', {
  connection: redis,
})

export const metricsCollectorWorker = new Worker(
  'metrics-collector',
  async (job) => {
    const { instagramPostId, igPostId } = job.data

    try {
      logger.info(`Collecting metrics for Instagram post ${igPostId}`)

      // Get metrics from Instagram
      const metrics = [
        'impressions',
        'reach',
        'likes',
        'comments',
        'saves',
        'shares',
        'plays',
        'total_interactions',
      ]

      const insights = await instagramClient.getMediaInsights(igPostId, metrics)

      // Transform insights
      const metricsData: any = {}
      insights.data.forEach((insight) => {
        metricsData[insight.name] = insight.values[0]?.value || 0
      })

      // Save to database
      await prisma.performanceMetric.create({
        data: {
          instagramPostId,
          metricsJson: metricsData,
        },
      })

      logger.info(`Metrics collected for post ${igPostId}:`, metricsData)

      return { success: true, metrics: metricsData }
    } catch (error) {
      logger.error(`Error collecting metrics for post ${igPostId}:`, error)
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 10,
  }
)

metricsCollectorWorker.on('completed', (job) => {
  logger.info(`Metrics collector job ${job.id} completed successfully`)
})

metricsCollectorWorker.on('failed', (job, err) => {
  logger.error(`Metrics collector job ${job?.id} failed:`, err)
})

// Set up recurring job to collect metrics for all active posts
async function setupRecurringMetricsCollection() {
  // This runs daily to ensure we're collecting metrics for all posts
  await metricsCollectorQueue.add(
    'collect-all-metrics',
    {},
    {
      repeat: {
        pattern: '0 0 * * *', // Daily at midnight
      },
    }
  )

  logger.info('Recurring metrics collection scheduled')
}

setupRecurringMetricsCollection()

logger.info('Metrics collector worker started')

