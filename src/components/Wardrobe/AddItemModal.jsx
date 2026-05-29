import { useState } from 'react'
import { CATEGORIES, SUBCATEGORIES, VIBES, OCCASIONS } from '../../data/defaults'
import { PhotoScanner } from './PhotoScanner'
import './AddItemModal.css'

/**
 * AddItemModal: Add new wardrobe item
 * Two modes: Manual entry or Photo scan
 */
export const AddItemModal = ({ onItemAdded, onCancel }) => {
  const [mode, setMode] = useState('manual') // 'manual' or 'scanner'
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    colours: [],
    brand: '',
    material: '',
    occasion: [],
    season: [],
    condition: 'good',
    notes: '',
    price: '',
    photo: null,
  })

  const [showSubcategories, setShowSubcategories] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === 'category') {
      setShowSubcategories(!!value)
    }
  }

  const handleChipToggle = (field, value) => {
    setFormData((prev) => {
      const current = prev[field] || []
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter((v) => v !== value) }
      }
      return { ...prev, [field]: [...current, value] }
    })
  }

  const handlePhotoScanned = (scannedData) => {
    setFormData((prev) => ({
      ...prev,
      ...scannedData,
      colours: scannedData.colours || [],
      occasion: scannedData.occasion || [],
      season: scannedData.season || [],
    }))
    setMode('manual') // Switch back to manual to review/edit
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert('Please enter item name')
      return
    }
    if (!formData.category) {
      alert('Please select category')
      return
    }

    onItemAdded(formData)
  }

  if (mode === 'scanner') {
    return (
      <div className="modal-overlay">
        <PhotoScanner
          onPhotoScanned={handlePhotoScanned}
          onCancel={() => setMode('manual')}
        />
      </div>
    )
  }

  const subcategoriesForCategory = formData.category
    ? SUBCATEGORIES[formData.category] || []
    : []

  return (
    <div className="modal-overlay">
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>Add New Item</h2>
          <button className="btn-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Photo Section */}
          <div className="form-section">
            <label>Photo</label>
            {formData.photo ? (
              <div className="photo-preview">
                <img src={formData.photo} alt="Item" />
                <button
                  type="button"
                  className="btn-remove-photo"
                  onClick={() => setFormData((prev) => ({ ...prev, photo: null }))}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-use-scanner"
                  onClick={() => setMode('scanner')}
                >
                  📸 Use AI Photo Scanner
                </button>
              </>
            )}
          </div>

          {/* Name */}
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Black leather jacket"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {showSubcategories && (
              <div className="form-group">
                <label>Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                >
                  <option value="">Select type</option>
                  {subcategoriesForCategory.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Brand & Material */}
          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="e.g., Nike, Zara"
              />
            </div>

            <div className="form-group">
              <label>Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                placeholder="e.g., Cotton, Polyester"
              />
            </div>
          </div>

          {/* Colours (chips) */}
          <div className="form-group">
            <label>Colours</label>
            <div className="chips-container">
              {[
                'Black',
                'White',
                'Gray',
                'Navy',
                'Blue',
                'Red',
                'Pink',
                'Yellow',
                'Green',
                'Purple',
                'Brown',
                'Beige',
              ].map((colour) => (
                <button
                  key={colour}
                  type="button"
                  className={`chip ${formData.colours.includes(colour) ? 'active' : ''}`}
                  onClick={() => handleChipToggle('colours', colour)}
                >
                  {colour}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion (chips) */}
          <div className="form-group">
            <label>Occasion</label>
            <div className="chips-container">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  className={`chip ${formData.occasion.includes(occ) ? 'active' : ''}`}
                  onClick={() => handleChipToggle('occasion', occ)}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Season & Condition */}
          <div className="form-row">
            <div className="form-group">
              <label>Season</label>
              <div className="chips-container">
                {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
                  <button
                    key={season}
                    type="button"
                    className={`chip ${formData.season.includes(season) ? 'active' : ''}`}
                    onClick={() => handleChipToggle('season', season)}
                  >
                    {season}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="worn">Worn</option>
              </select>
            </div>
          </div>

          {/* Price & Notes */}
          <div className="form-row">
            <div className="form-group">
              <label>Price Paid ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any notes about this item..."
              rows="3"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-add">
              ✨ Add to Wardrobe
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
