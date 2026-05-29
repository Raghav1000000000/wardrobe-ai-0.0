import { useState, useEffect } from 'react'
import { getWardrobe, setWardrobe } from '../lib/storage'
import { DEFAULT_WARDROBE_ITEM } from '../data/defaults'

/**
 * Custom hook for managing wardrobe inventory
 * Handles CRUD operations and statistics
 */
export const useWardrobe = () => {
  const [wardrobe, setWardrobeState] = useState([])
  const [loading, setLoading] = useState(true)

  // Load wardrobe from localStorage on mount
  useEffect(() => {
    const loadedWardrobe = getWardrobe()
    setWardrobeState(loadedWardrobe)
    setLoading(false)
  }, [])

  // Add new item to wardrobe
  const addItem = (itemData) => {
    const newItem = {
      ...DEFAULT_WARDROBE_ITEM,
      ...itemData,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateAdded: new Date().toISOString(),
    }
    const updated = [...wardrobe, newItem]
    setWardrobeState(updated)
    setWardrobe(updated)
    return newItem
  }

  // Update existing item
  const updateItem = (itemId, updates) => {
    const updated = wardrobe.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    )
    setWardrobeState(updated)
    setWardrobe(updated)
  }

  // Delete item
  const deleteItem = (itemId) => {
    const updated = wardrobe.filter((item) => item.id !== itemId)
    setWardrobeState(updated)
    setWardrobe(updated)
  }

  // Mark item as worn today
  const markItemWorn = (itemId) => {
    const updated = wardrobe.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          timesWorn: (item.timesWorn || 0) + 1,
          lastWorn: new Date().toISOString(),
        }
      }
      return item
    })
    setWardrobeState(updated)
    setWardrobe(updated)
  }

  // Get statistics
  const getStats = () => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const totalItems = wardrobe.length

    const wornThisMonth = wardrobe.filter((item) => {
      if (!item.lastWorn) return false
      return new Date(item.lastWorn) > thirtyDaysAgo
    }).length

    const neverWorn = wardrobe.filter((item) => !item.lastWorn || item.timesWorn === 0)
      .length

    const costPerWear = wardrobe.reduce((acc, item) => {
      if (!item.price || item.timesWorn === 0) return acc
      return acc + item.price / Math.max(item.timesWorn, 1)
    }, 0)

    const itemsByCategory = wardrobe.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {})

    return {
      totalItems,
      wornThisMonth,
      neverWorn,
      deadStock: neverWorn, // Items never worn
      averageCostPerWear: costPerWear > 0 ? (costPerWear / Math.max(wardrobe.length, 1)).toFixed(2) : 0,
      itemsByCategory,
    }
  }

  // Filter and sort
  const filterByCategory = (category) => {
    return wardrobe.filter((item) => item.category === category)
  }

  const filterByColour = (colour) => {
    return wardrobe.filter((item) => item.colours?.includes(colour))
  }

  const sortByWorn = (ascending = false) => {
    return [...wardrobe].sort((a, b) => {
      if (ascending) return (a.timesWorn || 0) - (b.timesWorn || 0)
      return (b.timesWorn || 0) - (a.timesWorn || 0)
    })
  }

  const sortByDateAdded = (newest = true) => {
    return [...wardrobe].sort((a, b) => {
      if (newest) return new Date(b.dateAdded) - new Date(a.dateAdded)
      return new Date(a.dateAdded) - new Date(b.dateAdded)
    })
  }

  // Search
  const search = (query) => {
    const q = query.toLowerCase()
    return wardrobe.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.brand?.toLowerCase().includes(q) ||
        item.notes?.toLowerCase().includes(q) ||
        item.aiTags?.some((tag) => tag.toLowerCase().includes(q))
    )
  }

  return {
    wardrobe,
    loading,
    addItem,
    updateItem,
    deleteItem,
    markItemWorn,
    getStats,
    filterByCategory,
    filterByColour,
    sortByWorn,
    sortByDateAdded,
    search,
  }
}
