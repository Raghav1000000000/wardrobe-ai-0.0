import React from 'react';
import './Skeletons.css';

// Generic skeleton loader for cards
export const CardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
    </div>
  </div>
);

// Wardrobe item skeleton
export const WardrobeSkeleton = () => (
  <div className="skeleton-wardrobe-item">
    <div className="skeleton skeleton-photo"></div>
    <div className="skeleton skeleton-title"></div>
    <div className="skeleton skeleton-text"></div>
    <div className="skeleton skeleton-text short"></div>
  </div>
);

// Outfit card skeleton
export const OutfitSkeleton = () => (
  <div className="skeleton-outfit-card">
    <div className="skeleton skeleton-outfit-image"></div>
    <div className="skeleton-outfit-content">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton-buttons">
        <div className="skeleton skeleton-button"></div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  </div>
);

// Product recommendation skeleton
export const ProductSkeleton = () => (
  <div className="skeleton-product">
    <div className="skeleton skeleton-product-image"></div>
    <div className="skeleton-product-content">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  </div>
);

// Styled skeleton grid for loading multiple items
export const SkeletonGrid = ({ count = 4, variant = 'card' }) => {
  const skeletons = Array.from({ length: count });
  const SkeletonComponent = 
    variant === 'wardrobe' ? WardrobeSkeleton :
    variant === 'outfit' ? OutfitSkeleton :
    variant === 'product' ? ProductSkeleton :
    CardSkeleton;

  return (
    <div className={`skeleton-grid skeleton-grid-${variant}`}>
      {skeletons.map((_, idx) => (
        <SkeletonComponent key={idx} />
      ))}
    </div>
  );
};

export default CardSkeleton;
