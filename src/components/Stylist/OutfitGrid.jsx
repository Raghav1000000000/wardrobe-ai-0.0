import './OutfitGrid.css'
import { OutfitCard } from './OutfitCard'

/**
 * OutfitGrid: Display multiple outfit suggestions
 */
export const OutfitGrid = ({ outfits, onSaveOutfit, title }) => {
  if (!outfits || outfits.length === 0) {
    return (
      <div className="outfit-empty">
        <div className="empty-icon">👗</div>
        <p>No outfit suggestions yet. Generate some to get started!</p>
      </div>
    )
  }

  return (
    <div className="outfit-section">
      {title && <h2 className="outfit-section-title">{title}</h2>}
      <div className="outfit-grid">
        {outfits.map((outfit, idx) => (
          <OutfitCard
            key={idx}
            outfit={outfit}
            onSave={onSaveOutfit}
          />
        ))}
      </div>
    </div>
  )
}
