import React, { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useWardrobe } from '../hooks/useWardrobe';
import { useShopping } from '../hooks/useShopping';
import GapAnalysis from '../components/Shopping/GapAnalysis';
import ProductRecommendations from '../components/Shopping/ProductRecommendations';
import './ShoppingPage.css';

const ShoppingPage = () => {
  const { profile } = useProfile();
  const { wardrobe } = useWardrobe();
  const { gaps, recommendations, loading, error, analyzeGaps, getRecommendations, clearRecommendations } = useShopping(profile, wardrobe);
  const [selectedGap, setSelectedGap] = useState(null);

  // Check if requirements are met
  const hasProfile = profile?.completedOnboarding;
  const hasWardrobe = wardrobe && wardrobe.length > 0;

  const handleAnalyzeGaps = () => {
    clearRecommendations();
    analyzeGaps();
  };

  const handleSelectGap = (gap) => {
    setSelectedGap(gap);
    if (gap.category) {
      getRecommendations(gap.category);
    } else if (gap.title) {
      getRecommendations(gap.title);
    }
  };

  return (
    <div className="shopping-page">
      <div className="shopping-container">
        {/* Header */}
        <div className="shopping-header">
          <h1>🛍️ Shopping Expert</h1>
          <p>Get personalized recommendations to fill wardrobe gaps</p>
        </div>

        {/* Requirements Check */}
        {!hasProfile || !hasWardrobe ? (
          <div className="requirements-check">
            <div className="requirement-item">
              <span className={hasProfile ? '✅' : '❌'}>Profile</span>
              {!hasProfile && <p>Complete your style profile first</p>}
            </div>
            <div className="requirement-item">
              <span className={hasWardrobe ? '✅' : '❌'}>Wardrobe</span>
              {!hasWardrobe && <p>Add at least one wardrobe item to start</p>}
            </div>
          </div>
        ) : (
          <div className="shopping-content">
            {/* CTA Section */}
            <div className="shopping-cta">
              <button 
                className="analyze-button" 
                onClick={handleAnalyzeGaps}
                disabled={loading}
              >
                {loading ? '⏳ Analyzing...' : '🔍 Analyze My Gaps'}
              </button>
              <p className="cta-hint">Discover what's missing from your wardrobe</p>
            </div>

            {/* Gap Analysis Results */}
            {gaps && (
              <>
                <GapAnalysis 
                  gaps={gaps} 
                  loading={loading}
                  error={error}
                  onSelectGap={handleSelectGap}
                />

                {/* Product Recommendations */}
                {selectedGap && (
                  <ProductRecommendations 
                    recommendations={recommendations}
                    loading={loading}
                    error={error}
                    gapTitle={selectedGap.title}
                  />
                )}
              </>
            )}

            {/* Info Section */}
            <div className="shopping-info">
              <h3>💡 How Shopping Expert Works</h3>
              <ul>
                <li><strong>Analyzes your wardrobe</strong> — Checks your items by category, occasion, and color</li>
                <li><strong>Identifies gaps</strong> — Spots missing pieces that would improve flexibility</li>
                <li><strong>Recommends items</strong> — Suggests specific products that match your style</li>
                <li><strong>Prioritizes purchases</strong> — Shows high, medium, and low priority gaps</li>
                <li><strong>Respects your budget</strong> — Recommendations consider your budget range</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingPage;
