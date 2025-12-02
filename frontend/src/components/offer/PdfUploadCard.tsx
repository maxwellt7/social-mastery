import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText } from 'lucide-react'
import Button from '../common/Button'
import { useUploadPdf } from '../../hooks/useOffer'

export default function PdfUploadCard() {
  const [offerName, setOfferName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const uploadPdf = useUploadPdf()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0])
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !offerName) return

    const formData = new FormData()
    formData.append('pdf', selectedFile)
    formData.append('name', offerName)

    try {
      await uploadPdf.mutateAsync(formData)
      setOfferName('')
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Offer Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="offerName" className="block text-sm font-medium text-gray-700 mb-1">
            Offer Name
          </label>
          <input
            id="offerName"
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., Launch Architect Masterclass"
            required
          />
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {selectedFile ? (
            <div className="flex items-center justify-center space-x-2 text-primary-600">
              <FileText className="w-8 h-8" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">
                {isDragActive
                  ? 'Drop the PDF here'
                  : 'Drag & drop your PDF here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-2">PDF files only, max 10MB</p>
            </>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!selectedFile || !offerName}
          loading={uploadPdf.isPending}
        >
          Upload & Process
        </Button>

        {uploadPdf.isSuccess && (
          <div className="p-3 bg-green-50 text-green-800 rounded-lg text-sm">
            PDF uploaded successfully! Processing in background...
          </div>
        )}

        {uploadPdf.isError && (
          <div className="p-3 bg-red-50 text-red-800 rounded-lg text-sm">
            Upload failed. Please try again.
          </div>
        )}
      </form>
    </div>
  )
}

