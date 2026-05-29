import { useState } from 'react'
import { callAI } from '../../lib/ai'
import { getStyleOnboardingPrompt } from '../../lib/prompts'
import { VIBES, FIT_PREFERENCES, COLOUR_PALETTES, OCCASIONS, BUDGET_BANDS } from '../../data/defaults'
import './ProfileEditor.css'

export default function ProfileEditor({ profile, onUpdate, onClose }) {
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState({ ...profile })
  const [loading, setLoading] = useState(false)

  const handleFieldChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelectChange = (field, value) => {
    setEditedProfile((prev) => {
      const current = prev[field] || []
      if (Array.isArray(current) && current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  const handleSave = () => {
    onUpdate(editedProfile)
    setEditMode(false)
  }

  const handleRegeneratePersona = async () => {
    setLoading(true)
    try {
      const systemPrompt = getStyleOnboardingPrompt()
      const summaryText = formatProfileSummary(editedProfile)
      const message = `Based on this updated style profile, generate a new warm 2-line style persona description:\n\n${summaryText}`

      const response = await callAI(systemPrompt, message)
      setEditedProfile((prev) => ({ ...prev, stylePersona: response }))
    } catch (error) {
      console.error('Error regenerating persona:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatProfileSummary = (prof) => {
    const lines = []
    lines.push(`Name: ${prof.name}`)
    if (prof.vibes?.length) lines.push(`Vibes: ${prof.vibes.join(', ')}`)
    if (prof.fitPreference) lines.push(`Fit: ${prof.fitPreference}`)
    if (prof.colourPalette?.length) lines.push(`Colours: ${prof.colourPalette.join(', ')}`)
    if (prof.occasions?.length) lines.push(`Occasions: ${prof.occasions.join(', ')}`)
    if (prof.budget) lines.push(`Budget: ${prof.budget}`)
    if (prof.bodyNotes) lines.push(`Body Notes: ${prof.bodyNotes}`)
    return lines.join('\n')
  }

  if (!editMode) {
    return (
      <div className="profile-editor-view">
        <button className="btn-edit" onClick={() => setEditMode(true)}>
          Edit Profile
        </button>
      </div>
    )
  }

  return (
    <div className="profile-editor">
      <div className="editor-header">
        <h2>Edit Your Profile</h2>
        <button className="btn-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="editor-content">
        {/* Name */}
        <div className="field-group">
          <label>Name</label>
          <input
            type="text"
            value={editedProfile.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="text-input"
          />
        </div>

        {/* Vibes */}
        <div className="field-group">
          <label>Your Vibes</label>
          <div className="chips-grid">
            {VIBES.map((vibe) => (
              <button
                key={vibe}
                className={`chip ${editedProfile.vibes?.includes(vibe) ? 'active' : ''}`}
                onClick={() => handleMultiSelectChange('vibes', vibe)}
              >
                {vibe}
              </button>
            ))}
          </div>
        </div>

        {/* Fit Preference */}
        <div className="field-group">
          <label>Fit Preference</label>
          <div className="chips-grid">
            {FIT_PREFERENCES.map((fit) => (
              <button
                key={fit}
                className={`chip ${editedProfile.fitPreference === fit ? 'active' : ''}`}
                onClick={() => handleFieldChange('fitPreference', fit)}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        {/* Colour Palette */}
        <div className="field-group">
          <label>Colour Palette</label>
          <div className="chips-grid">
            {COLOUR_PALETTES.map((colour) => (
              <button
                key={colour}
                className={`chip ${editedProfile.colourPalette?.includes(colour) ? 'active' : ''}`}
                onClick={() => handleMultiSelectChange('colourPalette', colour)}
              >
                {colour}
              </button>
            ))}
          </div>
        </div>

        {/* Occasions */}
        <div className="field-group">
          <label>Occasions</label>
          <div className="chips-grid">
            {OCCASIONS.map((occasion) => (
              <button
                key={occasion}
                className={`chip ${editedProfile.occasions?.includes(occasion) ? 'active' : ''}`}
                onClick={() => handleMultiSelectChange('occasions', occasion)}
              >
                {occasion}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="field-group">
          <label>Budget Level</label>
          <div className="chips-grid">
            {BUDGET_BANDS.map((budget) => (
              <button
                key={budget}
                className={`chip ${editedProfile.budget === budget ? 'active' : ''}`}
                onClick={() => handleFieldChange('budget', budget)}
              >
                {budget}
              </button>
            ))}
          </div>
        </div>

        {/* Body Notes */}
        <div className="field-group">
          <label>Any Body/Fit Notes?</label>
          <textarea
            value={editedProfile.bodyNotes || ''}
            onChange={(e) => handleFieldChange('bodyNotes', e.target.value)}
            placeholder="E.g., 'I prefer high waists' or 'I have broad shoulders'"
            className="textarea-input"
          />
        </div>

        {/* Style Persona */}
        <div className="field-group">
          <div className="persona-header">
            <label>Your Style Persona</label>
            <button
              className="btn-regenerate"
              onClick={handleRegeneratePersona}
              disabled={loading}
            >
              {loading ? 'Regenerating...' : '✨ Regenerate'}
            </button>
          </div>
          <p className="persona-text">{editedProfile.stylePersona || 'No persona yet'}</p>
        </div>
      </div>

      <div className="editor-actions">
        <button className="btn-save" onClick={handleSave}>
          Save Changes
        </button>
        <button className="btn-cancel" onClick={() => { setEditMode(false); setEditedProfile(profile) }}>
          Cancel
        </button>
      </div>
    </div>
  )
}
