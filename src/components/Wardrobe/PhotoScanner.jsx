import { useState } from 'react'
import { callAIWithVision } from '../../lib/ai'
import { getPhotoScanPrompt } from '../../lib/prompts'
import './PhotoScanner.css'

/**
 * PhotoScanner: Upload photo → Gemini Vision API → Parse clothing details
 * Automatically extracts category, colour, brand, etc.
 */
export const PhotoScanner = ({ onPhotoScanned, onCancel }) => {
  const [imageBase64, setImageBase64] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target.result.split(',')[1] // Remove data:image/jpeg;base64, prefix
      setImageBase64(base64)
      setPreviewUrl(event.target.result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleScan = async () => {
    if (!imageBase64) {
      setError('Please select a photo first')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const systemPrompt = getPhotoScanPrompt()
      const userMessage =
        'Analyze this clothing photo and extract the following information in JSON format: { name, category, subcategory, colours (array), brand, material, condition (good/fair/worn), occasion (array), season (array), aiTags (array of style descriptors) }. Return ONLY valid JSON, no other text.'

      const response = await callAIWithVision(
        systemPrompt,
        userMessage,
        imageBase64,
        'image/jpeg'
      )

      // Parse JSON response
      let parsedData
      try {
        // Extract JSON from response (in case there's additional text)
        const jsonMatch = response.text?.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
          throw new Error('No JSON found in response')
        }
        parsedData = JSON.parse(jsonMatch[0])
      } catch (parseError) {
        setError('Could not parse image analysis. Please try another photo or add manually.')
        setLoading(false)
        return
      }

      // Return parsed data with photo
      onPhotoScanned({
        ...parsedData,
        photo: previewUrl, // Keep original data URL for storage
      })
    } catch (err) {
      console.error('Vision API error:', err)
      setError(`Failed to analyze photo: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="photo-scanner">
      <div className="scanner-header">
        <h3>📸 Scan Clothing Photo</h3>
        <p>Upload a photo and AI will auto-fill the details</p>
      </div>

      {previewUrl ? (
        <div className="scanner-preview">
          <img src={previewUrl} alt="Preview" />
          <p className="preview-hint">Photo selected</p>
        </div>
      ) : (
        <label className="scanner-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={loading}
          />
          <div className="upload-area">
            <div className="upload-icon">📷</div>
            <p>Click to select a photo</p>
            <small>JPG, PNG, WebP (max 5MB)</small>
          </div>
        </label>
      )}

      {error && <div className="scanner-error">{error}</div>}

      <div className="scanner-actions">
        {previewUrl ? (
          <>
            <button
              className="btn-change"
              onClick={() => {
                setImageBase64(null)
                setPreviewUrl(null)
              }}
              disabled={loading}
            >
              Change Photo
            </button>
            <button className="btn-scan" onClick={handleScan} disabled={loading}>
              {loading ? '🔄 Scanning...' : '✨ Scan with AI'}
            </button>
          </>
        ) : null}
        <button className="btn-cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  )
}
