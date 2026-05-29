import './WardrobeGrid.css'
import { ItemCard } from './ItemCard'

/**
 * WardrobeGrid: Display wardrobe items in responsive grid
 * Supports filtering, sorting, and searching
 */
export const WardrobeGrid = ({
  items,
  filter = null,
  sortBy = 'newest',
  onItemWorn,
  onItemEdit,
  onItemDelete,
}) => {
  // Apply sorting
  const getSortedItems = () => {
    if (sortBy === 'mostWorn') {
      return [...items].sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0))
    }
    if (sortBy === 'leastWorn') {
      return [...items].sort((a, b) => (a.timesWorn || 0) - (b.timesWorn || 0))
    }
    // Default: newest first
    return [...items].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    )
  }

  const sortedItems = getSortedItems()

  if (sortedItems.length === 0) {
    return (
      <div className="wardrobe-empty">
        <div className="empty-icon">👔</div>
        <h2>No items yet</h2>
        <p>Start building your digital wardrobe by adding your first piece!</p>
      </div>
    )
  }

  return (
    <div className="wardrobe-grid">
      {sortedItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onWorn={onItemWorn}
          onEdit={onItemEdit}
          onDelete={onItemDelete}
        />
      ))}
    </div>
  )
}
