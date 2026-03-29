import { OfferProfile } from '../../types/offer'

interface OfferSummaryPanelProps {
  profile: OfferProfile
}

export default function OfferSummaryPanel({ profile }: OfferSummaryPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Big Idea</h3>
        <p className="text-gray-700">{profile.bigIdea}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mechanism</h3>
        <p className="text-gray-700">{profile.mechanism}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Target Avatar</h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Demographics</h4>
            <p className="text-gray-600 text-sm">{profile.avatarJson?.demographics}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Psychographics</h4>
            <p className="text-gray-600 text-sm">{profile.avatarJson?.psychographics}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Pain Points</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {profile.avatarJson?.painPoints.map((point: string, idx: number) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">Desires</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {profile.avatarJson?.desires.map((desire: string, idx: number) => (
                <li key={idx}>{desire}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice & Tone</h3>
        <p className="text-gray-700">{profile.voiceAndTone}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Constraints</h3>
        <p className="text-gray-700">{profile.constraints}</p>
      </div>
    </div>
  )
}

