import './ItemCard.css'

/**
 * ItemCard: Display individual wardrobe item
 * Shows photo, name, category, brand, wear count
 */
export const ItemCard = ({ item, onWorn, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const days = Math.floor((Date.now() - date) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return `${Math.floor(days / 30)}m ago`
  }

  return (
    <div className="item-card">
      {/* Photo */}
      <div className="item-photo">
        {item.photo ? (
          <img src={item.photo} alt={item.name} />
        ) : (
          <div className="item-photo-placeholder">
            <span>No photo</span>
          </div>
        )}
        {/* Badge: times worn */}
        <div className="wear-badge">{item.timesWorn || 0} worn</div>
      </div>

      {/* Content */}
      <div className="item-content">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-category">{item.category}</p>
        {item.brand && <p className="item-brand">{item.brand}</p>}

        {/* Colours */}
        {item.colours && item.colours.length > 0 && (
          <div className="item-colours">
            {item.colours.map((colour, idx) => (
              <span key={idx} className="colour-tag">
                {colour}
              </span>
            ))}
          </div>
        )}

        {/* Last worn */}
        <p className="item-last-worn">
          Last worn: <strong>{formatDate(item.lastWorn)}</strong>
        </p>

        {/* Actions */}
        <div className="item-actions">
          <button className="btn-worn" onClick={() => onWorn(item.id)}>
            ✓ Worn
          </button>
          <button className="btn-edit" onClick={() => onEdit(item)}>
            Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
