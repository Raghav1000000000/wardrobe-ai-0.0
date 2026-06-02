import React from 'react';
import './ProductRecommendations.css';

const ProductRecommendations = ({ recommendations, loading, error, gapTitle }) => {
  if (loading) {
    return (
      <div className="product-recommendations">
        <div className="rec-loading">Finding perfect recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-recommendations">
        <div className="rec-error">⚠️ {error}</div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="product-recommendations">
      <div className="rec-header">
        <h3>🛍️ Recommended Products{gapTitle && ` for ${gapTitle}`}</h3>
        <p>Items that match your style perfectly</p>
      </div>

      <div className="rec-grid">
        {recommendations.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const handleShopClick = () => {
    // In a real app, this would link to shopping sites
    alert(`Search "${product.name}" on ${product.shopAt}`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <div className="image-placeholder">
          {product.icon || '👗'}
        </div>
      </div>

      <div className="product-content">
        <h4 className="product-name">{product.name}</h4>

        <div className="product-price">
          <span className="price-label">Price:</span>
          <span className="price-range">{product.price}</span>
        </div>

        <div className="product-reason">
          <span className="reason-label">Why:</span>
          <p>{product.reason}</p>
        </div>

        <div className="product-shop">
          <span className="shop-label">Shop at:</span>
          <button className="shop-button" onClick={handleShopClick}>
            {product.shopAt} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendations;
