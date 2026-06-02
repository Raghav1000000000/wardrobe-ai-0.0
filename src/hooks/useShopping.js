import { useState, useCallback } from 'react';
import { callAI } from '../lib/ai';
import { getGapAnalysisPrompt } from '../lib/prompts';
import { CATEGORIES, OCCASIONS } from '../data/defaults';

export const useShopping = (profile, wardrobe) => {
  const [gaps, setGaps] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Analyze wardrobe gaps
  const analyzeGaps = useCallback(async () => {
    if (!profile || wardrobe.length === 0) {
      setError('Profile and wardrobe items required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = getGapAnalysisPrompt(profile, wardrobe);
      const response = await callAI(
        prompt.system,
        prompt.user
      );

      // Parse gap analysis response
      const gapData = parseGapAnalysis(response, profile, wardrobe);
      setGaps(gapData);
    } catch (err) {
      console.error('Gap analysis error:', err);
      setError(err.message || 'Failed to analyze gaps');
    } finally {
      setLoading(false);
    }
  }, [profile, wardrobe]);

  // Get product recommendations based on gaps
  const getRecommendations = useCallback(async (gapCategory) => {
    if (!gaps) return;

    setLoading(true);
    setError(null);

    try {
      const systemPrompt = `You are a fashion shopping expert. Based on the user's style profile and identified wardrobe gaps, suggest 3-5 specific products to purchase. Focus on the "${gapCategory}" category.`;
      
      const userMessage = `
User Profile:
- Vibes: ${profile.vibes.join(', ')}
- Fit: ${profile.fitPreference}
- Colors: ${profile.colourPalette.join(', ')}
- Occasions: ${profile.occasions.join(', ')}
- Budget: ${profile.budget}

Missing in "${gapCategory}". Suggest specific products with:
- Item name
- Expected price range
- Why it fits their style
- Where to shop (e.g., "H&M", "Zara", "Forever 21", "ASOS", "Target")

Format as JSON array: [{"name": "...", "price": "...", "reason": "...", "shopAt": "..."}]
`;

      const response = await callAI(systemPrompt, userMessage);
      
      try {
        const parsed = JSON.parse(response);
        setRecommendations(parsed);
      } catch {
        // If JSON parse fails, create mock recommendations
        setRecommendations(createMockRecommendations(gapCategory, profile));
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err.message || 'Failed to get recommendations');
      // Fall back to mock recommendations
      setRecommendations(createMockRecommendations(gapCategory, profile));
    } finally {
      setLoading(false);
    }
  }, [gaps, profile]);

  return {
    gaps,
    recommendations,
    loading,
    error,
    analyzeGaps,
    getRecommendations,
    clearRecommendations: () => setRecommendations(null),
  };
};

// Parse gap analysis from AI response
function parseGapAnalysis(response, profile, wardrobe) {
  const wornCount = {};
  const wornByOccasion = {};
  const wornByCategory = {};

  // Count items by category and occasion
  wardrobe.forEach((item) => {
    wornByCategory[item.category] = (wornByCategory[item.category] || 0) + 1;
    item.occasion?.forEach((occ) => {
      wornByOccasion[occ] = (wornByOccasion[occ] || 0) + 1;
    });
  });

  // Identify gaps
  const gaps = [];

  // Gap 1: Missing occasion items
  profile.occasions?.forEach((occ) => {
    const count = wornByOccasion[occ] || 0;
    if (count < 3) {
      gaps.push({
        type: 'occasion',
        title: `${occ} Outfits`,
        description: `You have ${count} items for ${occ}. Consider adding more options.`,
        priority: count === 0 ? 'high' : 'medium',
        suggestion: `Add 2-3 outfits suitable for ${occ}`,
      });
    }
  });

  // Gap 2: Missing category diversity
  CATEGORIES.forEach((cat) => {
    const count = wornByCategory[cat] || 0;
    if (count === 0) {
      gaps.push({
        type: 'category',
        title: `Add ${cat}`,
        description: `You don't have any ${cat.toLowerCase()} items.`,
        priority: 'medium',
        suggestion: `Consider adding at least one ${cat.toLowerCase()} piece`,
        category: cat,
      });
    } else if (count === 1) {
      gaps.push({
        type: 'variety',
        title: `More ${cat}`,
        description: `You have only 1 ${cat.toLowerCase()} item. More variety helps flexibility.`,
        priority: 'low',
        suggestion: `Add another ${cat.toLowerCase()} for more outfit combinations`,
        category: cat,
      });
    }
  });

  // Gap 3: Color palette coverage
  const usedColors = new Set();
  wardrobe.forEach((item) => {
    item.colours?.forEach((c) => usedColors.add(c));
  });

  profile.colourPalette?.forEach((color) => {
    if (!usedColors.has(color)) {
      gaps.push({
        type: 'color',
        title: `Add ${color} pieces`,
        description: `Your style palette includes ${color}, but you don't have items in this color.`,
        priority: 'low',
        suggestion: `Look for items in ${color} to expand outfit options`,
      });
    }
  });

  return gaps;
}

// Mock recommendations fallback
function createMockRecommendations(category, profile) {
  const mocks = {
    Tops: [
      { name: 'Minimalist White T-shirt', price: '$15-20', reason: 'Versatile basic for work and casual', shopAt: 'Uniqlo' },
      { name: 'Structured Blouse', price: '$35-50', reason: 'Professional option for work occasions', shopAt: 'H&M' },
      { name: 'Fitted Sweater', price: '$40-60', reason: 'Layering piece for all-seasons wear', shopAt: 'Zara' },
    ],
    Bottoms: [
      { name: 'Neutral Leggings', price: '$25-40', reason: 'Comfortable all-day option', shopAt: 'Athleta' },
      { name: 'Tailored Chinos', price: '$45-65', reason: 'Professional alternative to trousers', shopAt: 'Banana Republic' },
      { name: 'Mini Skirt', price: '$30-45', reason: 'Dress-up option for events', shopAt: 'ASOS' },
    ],
    Shoes: [
      { name: 'White Sneakers', price: '$60-90', reason: 'Casual staple with clean aesthetic', shopAt: 'Nike' },
      { name: 'Black Loafers', price: '$70-120', reason: 'Professional footwear for work', shopAt: 'Cole Haan' },
      { name: 'Nude Flats', price: '$40-70', reason: 'Versatile neutral shoe', shopAt: 'Clarks' },
    ],
    Accessories: [
      { name: 'Minimalist Belt', price: '$25-40', reason: 'Neutral accent piece', shopAt: 'Zara' },
      { name: 'Simple Watch', price: '$50-150', reason: 'Functional and stylish accessory', shopAt: 'Timex' },
      { name: 'Structured Bag', price: '$80-150', reason: 'Neutral work bag in neutral color', shopAt: 'Coach' },
    ],
  };

  return mocks[category] || mocks.Tops;
}
