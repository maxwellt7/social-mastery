import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card'
import Button from '../components/common/Button'
import { useOffers, useUploadPdf, useOfferProfile } from '../hooks/useOffer'
import { Upload, FileText, ChevronRight, Brain, Target, Users } from 'lucide-react'
import Loader from '../components/common/Loader'
import Tag from '../components/common/Tag'

export default function OfferSetup() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [offerName, setOfferName] = useState('')
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  
  const { data: offers, isLoading } = useOffers()
  const uploadMutation = useUploadPdf()
  const { data: offerProfile, isLoading: profileLoading } = useOfferProfile(selectedOfferId || '')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !offerName) return
    
    try {
      const result = await uploadMutation.mutateAsync({ file: selectedFile, offerName })
      setSelectedFile(null)
      setOfferName('')
      // Auto-select the newly created offer
      setSelectedOfferId(result.offer.id)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (isLoading) {
    return <Loader text="Loading offers..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Offer Setup</h1>
        <p className="mt-2 text-gray-600">
          Upload your offer documents to create an AI Marketing Director profile
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Offer PDF</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Name
            </label>
            <input
              type="text"
              value={offerName}
              onChange={(e) => setOfferName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Zenith Launch System"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF Document
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Choose File</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !offerName}
            isLoading={uploadMutation.isPending}
          >
            Upload and Analyze
          </Button>

          {uploadMutation.isSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ Offer uploaded successfully! AI Director profile created. Click below to view details.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Offers</CardTitle>
        </CardHeader>
        <CardContent>
          {offers && offers.length > 0 ? (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.id}>
                  <div
                    onClick={() => setSelectedOfferId(selectedOfferId === offer.id ? null : offer.id)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{offer.name}</h4>
                        <p className="text-sm text-gray-600">
                          Created {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Tag variant="success">Active</Tag>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedOfferId === offer.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedOfferId === offer.id && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {profileLoading ? (
                        <Loader text="Loading AI profile..." />
                      ) : offerProfile ? (
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-5 h-5 text-purple-600" />
                              <h3 className="font-semibold text-gray-900">Big Idea</h3>
                            </div>
                            <p className="text-sm text-gray-700 ml-7">{offerProfile.bigIdea}</p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="w-5 h-5 text-green-600" />
                              <h3 className="font-semibold text-gray-900">Mechanism</h3>
                            </div>
                            <p className="text-sm text-gray-700 ml-7">{offerProfile.mechanism}</p>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              <h3 className="font-semibold text-gray-900">Target Avatar</h3>
                            </div>
                            <div className="ml-7 space-y-2">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Pain Points:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {offerProfile.avatar.psychographics.painPoints.map((pain: string, i: number) => (
                                    <li key={i}>{pain}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">Desires:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {offerProfile.avatar.psychographics.desires.map((desire: string, i: number) => (
                                    <li key={i}>{desire}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Voice & Tone</h3>
                            <p className="text-sm text-gray-700">{offerProfile.voiceAndTone}</p>
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                            <p className="text-sm text-gray-700">{offerProfile.summaryText}</p>
                          </div>

                          {offerProfile.constraints.length > 0 && (
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">Constraints</h3>
                              <ul className="text-sm text-gray-700 list-disc list-inside">
                                {offerProfile.constraints.map((constraint: string, i: number) => (
                                  <li key={i}>{constraint}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No profile data available</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              No offers yet. Upload your first offer document to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
