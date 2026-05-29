import './WardrobeStats.css'

/**
 * WardrobeStats: Display wardrobe statistics and metrics
 */
export const WardrobeStats = ({ stats }) => {
  return (
    <div className="wardrobe-stats">
      <div className="stat-card">
        <div className="stat-icon">👔</div>
        <div className="stat-content">
          <div className="stat-value">{stats.totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">✨</div>
        <div className="stat-content">
          <div className="stat-value">{stats.wornThisMonth}</div>
          <div className="stat-label">Worn This Month</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💤</div>
        <div className="stat-content">
          <div className="stat-value">{stats.deadStock}</div>
          <div className="stat-label">Never Worn</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">💵</div>
        <div className="stat-content">
          <div className="stat-value">${stats.averageCostPerWear}</div>
          <div className="stat-label">Avg Cost per Wear</div>
        </div>
      </div>

      {Object.keys(stats.itemsByCategory).length > 0 && (
        <div className="stat-card full-width">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Items by Category</div>
            <div className="category-breakdown">
              {Object.entries(stats.itemsByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
