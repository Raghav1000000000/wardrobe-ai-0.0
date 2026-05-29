import './OutfitCard.css'

/**
 * OutfitCard: Display single outfit suggestion
 * Shows items, reasoning, vibe, and styling tips
 */
export const OutfitCard = ({ outfit, onSave }) => {
  return (
    <div className="outfit-card">
      {/* Header */}
      <div className="outfit-header">
        <h3>{outfit.name}</h3>
        <button className="btn-save" onClick={() => onSave?.(outfit)}>
          ⭐ Save
        </button>
      </div>

      {/* Items */}
      <div className="outfit-items">
        <h4>Items:</h4>
        <ul>
          {outfit.items?.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Reasoning */}
      <div className="outfit-reasoning">
        <p>
          <strong>Why it works:</strong> {outfit.reasoning}
        </p>
      </div>

      {/* Vibe & Occasion */}
      {outfit.vibe && (
        <div className="outfit-vibe">
          <span className="vibe-tag">{outfit.vibe}</span>
          {outfit.occasion && (
            <span className="occasion-tag">{outfit.occasion}</span>
          )}
        </div>
      )}

      {/* Tips (for events) */}
      {outfit.tips && (
        <div className="outfit-tips">
          <p>
            <strong>💡 Pro tip:</strong> {outfit.tips}
          </p>
        </div>
      )}

      {/* Confidence (for events) */}
      {outfit.confidenceLevel && (
        <div className="outfit-confidence">
          <strong>Confidence:</strong> {outfit.confidenceLevel}
        </div>
      )}
    </div>
  )
}
