import axios from 'axios'
import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'
import { videoQueue } from '../lib/queue'

const creatifyClient = axios.create({
  baseURL: process.env.CREATIFY_BASE_URL,
  headers: {
    'X-API-ID': process.env.CREATIFY_API_ID,
    'X-API-KEY': process.env.CREATIFY_API_KEY,
    'Content-Type': 'application/json',
  },
})

export async function createVideo(scriptId: string) {
  const script = await prisma.script.findUnique({
    where: { id: scriptId },
  })

  if (!script) {
    throw new ApiError(404, 'Script not found')
  }

  // Check if video already exists
  const existing = await prisma.videoAsset.findUnique({
    where: { scriptId },
  })

  if (existing) {
    return existing
  }

  // Create video asset record
  const videoAsset = await prisma.videoAsset.create({
    data: {
      scriptId,
      creatifyJobId: 'pending',
      status: 'pending',
    },
  })

  // Add to job queue for async processing
  await videoQueue.add('create-video', {
    videoAssetId: videoAsset.id,
    scriptText: script.scriptText,
  })

  return videoAsset
}

export async function getVideoStatus(videoAssetId: string) {
  const videoAsset = await prisma.videoAsset.findUnique({
    where: { id: videoAssetId },
  })

  if (!videoAsset) {
    throw new ApiError(404, 'Video asset not found')
  }

  // If still processing, check Creatify API for status
  if (videoAsset.status === 'processing') {
    try {
      const { data } = await creatifyClient.get(`/videos/${videoAsset.creatifyJobId}`)
      
      if (data.status === 'completed') {
        // Update record with completed video
        return prisma.videoAsset.update({
          where: { id: videoAssetId },
          data: {
            status: 'completed',
            videoUrl: data.video_url,
            completedAt: new Date(),
          },
        })
      }
    } catch (error) {
      console.error('Error checking Creatify status:', error)
    }
  }

  return videoAsset
}

export async function processVideoCreation(videoAssetId: string, scriptText: string) {
  // This function would be called by the background worker
  try {
    // Call Creatify API to create video
    const { data } = await creatifyClient.post('/videos', {
      script: scriptText,
      avatar_id: 'default',
      voice_id: 'default',
      aspect_ratio: '9:16',
    })

    // Update video asset with job ID
    await prisma.videoAsset.update({
      where: { id: videoAssetId },
      data: {
        creatifyJobId: data.job_id,
        status: 'processing',
      },
    })
  } catch (error) {
    // Update as failed
    await prisma.videoAsset.update({
      where: { id: videoAssetId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    })
  }
}

