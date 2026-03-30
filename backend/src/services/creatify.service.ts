import { Request, Response } from 'express'
import prisma from '../utils/prisma.js'
import { creatifyClient } from '../integrations/creatify.client.js'
import { ApiError } from '../middleware/errorHandler.js'
import { logger } from '../utils/logger.js'
import { videoGenerationQueue } from '../jobs/videoGeneration.job.js'

export async function createVideo(req: Request, res: Response) {
  const { scriptId, voiceId, avatarId, aspectRatio = '9:16', style } = req.body

  if (!scriptId) {
    throw new ApiError('Script ID is required', 400)
  }

  try {
    // Get script
    const script = await prisma.script.findUnique({
      where: { id: scriptId },
    })

    if (!script) {
      throw new ApiError('Script not found', 404)
    }

    // Create video job with Creatify
    const videoJob = await creatifyClient.createVideo({
      script: script.scriptText,
      voice_id: voiceId,
      avatar_id: avatarId,
      aspect_ratio: aspectRatio,
      style,
    })

    // Create video asset record
    const videoAsset = await prisma.videoAsset.create({
      data: {
        scriptId,
        creatifyJobId: videoJob.job_id,
        status: videoJob.status,
      },
    })

    // Add job to queue for polling
    await videoGenerationQueue.add(
      'poll-video-status',
      {
        videoAssetId: videoAsset.id,
        creatifyJobId: videoJob.job_id,
      },
      {
        delay: 5000, // Start polling after 5 seconds
        attempts: 50,
        backoff: {
          type: 'exponential',
          delay: 10000, // 10 seconds
        },
      }
    )

    // Update script status
    await prisma.script.update({
      where: { id: scriptId },
      data: { status: 'sent_to_creatify' },
    })

    res.status(202).json({
      success: true,
      data: {
        videoAssetId: videoAsset.id,
        creatifyJobId: videoJob.job_id,
        status: videoJob.status,
      },
      message: 'Video generation started',
    })
  } catch (error) {
    logger.error('Error creating video:', error)
    throw new ApiError('Failed to create video', 500)
  }
}

export async function getJobStatus(req: Request, res: Response) {
  const { id: creatifyJobId } = req.params

  try {
    // Get status from Creatify
    const status = await creatifyClient.getVideoStatus(creatifyJobId)

    // Update database
    const videoAsset = await prisma.videoAsset.findFirst({
      where: { creatifyJobId },
    })

    if (videoAsset) {
      await prisma.videoAsset.update({
        where: { id: videoAsset.id },
        data: {
          status: status.status,
          videoUrl: status.video_url,
          thumbnailUrl: status.thumbnail_url,
          errorMessage: status.error,
        },
      })

      // Update script status if video is ready
      if (status.status === 'completed') {
        await prisma.script.update({
          where: { id: videoAsset.scriptId },
          data: { status: 'video_ready' },
        })
      }
    }

    res.json({
      success: true,
      data: status,
    })
  } catch (error) {
    logger.error(`Error getting job status for ${creatifyJobId}:`, error)
    throw new ApiError('Failed to get job status', 500)
  }
}

export async function listAvatars(req: Request, res: Response) {
  try {
    const avatars = await creatifyClient.listAvatars()

    res.json({
      success: true,
      data: avatars,
    })
  } catch (error) {
    logger.error('Error listing avatars:', error)
    throw new ApiError('Failed to list avatars', 500)
  }
}

export async function listVoices(req: Request, res: Response) {
  try {
    const voices = await creatifyClient.listVoices()

    res.json({
      success: true,
      data: voices,
    })
  } catch (error) {
    logger.error('Error listing voices:', error)
    throw new ApiError('Failed to list voices', 500)
  }
}

