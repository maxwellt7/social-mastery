import { Queue } from 'bullmq'
import redis from './redis'

// Video generation queue
export const videoQueue = new Queue('video-generation', {
  connection: redis,
})

// Instagram posting queue
export const postingQueue = new Queue('instagram-posting', {
  connection: redis,
})

// Analytics collection queue
export const analyticsQueue = new Queue('analytics-collection', {
  connection: redis,
})

console.log('✅ Job queues initialized')

