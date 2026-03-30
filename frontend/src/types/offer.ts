export interface Offer {
  id: string
  name: string
  pdfUrl: string
  createdAt: string
  updatedAt: string
  profile?: OfferProfile
}

export interface OfferProfile {
  id: string
  offerId: string
  bigIdea: string
  mechanism: string
  avatar: AvatarDetails
  voiceAndTone: string
  constraints: string[]
  summaryText: string
  createdAt: string
  updatedAt: string
}

export interface AvatarDetails {
  demographics: string
  psychographics: string
  painPoints: string[]
  desires: string[]
}

export interface DirectorPlaybook {
  id: string
  offerId: string
  version: number
  instructionsText: string
  config: PlaybookConfig
  createdAt: string
}

export interface PlaybookConfig {
  hookWeights: Record<string, number>
  angleWeights: Record<string, number>
  preferredPillars: string[]
  riskLevel: 'safe' | 'moderate' | 'aggressive'
}

export interface UploadPdfRequest {
  file: File
  offerName: string
}

export interface UploadPdfResponse {
  offer: Offer
  profile: OfferProfile
}
