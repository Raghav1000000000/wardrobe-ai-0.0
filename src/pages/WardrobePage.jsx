import { useState } from 'react'
import { useWardrobe } from '../hooks/useWardrobe'
import { WardrobeGrid } from '../components/Wardrobe/WardrobeGrid'
import { WardrobeStats } from '../components/Wardrobe/WardrobeStats'
import { AddItemModal } from '../components/Wardrobe/AddItemModal'
import './WardrobePage.css'

export default function WardrobePage() {
  const {
    wardrobe,
    loading,
    addItem,
    updateItem,
    deleteItem,
    markItemWorn,
    getStats,
    search,
  } = useWardrobe()

  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Get filtered items
  const getFilteredItems = () => {
    let items = wardrobe

    // Apply search
    if (searchQuery.trim()) {
      items = search(searchQuery)
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      items = items.filter((item) => item.category === filterCategory)
    }

    return items
  }

  const filteredItems = getFilteredItems()
  const stats = getStats()

  const handleAddItem = (formData) => {
    addItem(formData)
    setShowAddModal(false)
  }

  const handleItemWorn = (itemId) => {
    markItemWorn(itemId)
  }

  const handleItemEdit = (item) => {
    // TODO: Open edit modal
    console.log('Edit:', item)
  }

  const handleItemDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(itemId)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-skeleton"></div>
      </div>
    )
  }

  return (
    <div className="page-container wardrobe-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>👔 My Wardrobe</h1>
          <p>Manage your digital closet</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      {/* Stats */}
      <WardrobeStats stats={stats} />

      {/* Controls */}
      <div className="wardrobe-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {[
              'Tops',
              'Bottoms',
              'Dresses',
              'Outerwear',
              'Shoes',
              'Accessories',
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="mostWorn">Most Worn</option>
            <option value="leastWorn">Least Worn</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <WardrobeGrid
        items={filteredItems}
        sortBy={sortBy}
        onItemWorn={handleItemWorn}
        onItemEdit={handleItemEdit}
        onItemDelete={handleItemDelete}
      />

      {/* Add Modal */}
      {showAddModal && (
        <AddItemModal
          onItemAdded={handleAddItem}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
