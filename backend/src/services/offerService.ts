import prisma from '../lib/prisma'
import { ApiError } from '../middleware/errorHandler'
import * as pdfService from './pdfService'
import * as kodeyService from './kodeyService'

export async function uploadAndProcessPdf(file: Express.Multer.File, offerName: string) {
  // Extract text from PDF
  const pdfText = await pdfService.extractTextFromPdf(file.path)
  
  // Create offer record
  const offer = await prisma.offer.create({
    data: {
      name: offerName,
      pdfUrl: file.path,
    },
  })

  // Use Kodey.ai to analyze the PDF and create profile
  console.log(`📄 Processing PDF for: ${offerName}`)
  const profileData = await kodeyService.analyzeOfferDocument(pdfText, offerName)
  
  // Create offer profile
  const profile = await prisma.offerProfile.create({
    data: {
      offerId: offer.id,
      bigIdea: profileData.bigIdea,
      mechanism: profileData.mechanism,
      avatar: profileData.avatar,
      voiceAndTone: profileData.voiceAndTone,
      constraints: profileData.constraints,
      summaryText: profileData.summaryText,
    },
  })

  // Create initial playbook
  await prisma.directorPlaybook.create({
    data: {
      offerId: offer.id,
      version: 1,
      instructionsText: profileData.initialInstructions,
      config: {
        hookWeights: {},
        angleWeights: {},
        preferredPillars: [],
        riskLevel: 'moderate',
      },
    },
  })

  console.log(`✅ Offer created successfully: ${offer.id}`)
  return { offer, profile }
}

export async function getAllOffers() {
  return prisma.offer.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getOfferById(id: string) {
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: {
      profile: true,
    },
  })

  if (!offer) {
    throw new ApiError(404, 'Offer not found')
  }

  return offer
}

export async function getOfferProfile(offerId: string) {
  const profile = await prisma.offerProfile.findUnique({
    where: { offerId },
  })

  if (!profile) {
    throw new ApiError(404, 'Offer profile not found')
  }

  return profile
}

export async function getCurrentPlaybook(offerId: string) {
  const playbook = await prisma.directorPlaybook.findFirst({
    where: { offerId },
    orderBy: {
      version: 'desc',
    },
  })

  if (!playbook) {
    throw new ApiError(404, 'Playbook not found')
  }

  return playbook
}

export async function updateAIDirector(offerId: string, performanceData: any) {
  const currentPlaybook = await getCurrentPlaybook(offerId)
  const profile = await getOfferProfile(offerId)

  // Use Kodey.ai to analyze performance and update playbook
  const updatedConfig = await kodeyService.updatePlaybookFromPerformance(
    profile,
    currentPlaybook,
    performanceData
  )

  const newPlaybook = await prisma.directorPlaybook.create({
    data: {
      offerId,
      version: currentPlaybook.version + 1,
      instructionsText: updatedConfig.instructions,
      config: updatedConfig.config,
    },
  })

  return newPlaybook
}

export async function mapVariables(offerId: string, templateId: string, placeholders: string[]) {
  const profile = await getOfferProfile(offerId)
  
  // Use Kodey.ai to map template placeholders to offer details
  const mappings = await kodeyService.mapTemplatePlaceholders(profile, placeholders)
  
  return mappings
}

