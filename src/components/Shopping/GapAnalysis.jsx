import React, { useEffect, useState } from 'react';
import './GapAnalysis.css';

const GapAnalysis = ({ gaps, loading, error, onSelectGap }) => {
  const [selectedGap, setSelectedGap] = useState(null);

  const handleSelectGap = (gap) => {
    setSelectedGap(gap);
    onSelectGap?.(gap);
  };

  if (loading) {
    return (
      <div className="gap-analysis">
        <div className="gap-loading">Analyzing your wardrobe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gap-analysis">
        <div className="gap-error">❌ {error}</div>
      </div>
    );
  }

  if (!gaps || gaps.length === 0) {
    return (
      <div className="gap-analysis">
        <div className="gap-empty">✨ Your wardrobe looks well-balanced! No major gaps detected.</div>
      </div>
    );
  }

  // Group gaps by priority
  const highPriority = gaps.filter((g) => g.priority === 'high');
  const mediumPriority = gaps.filter((g) => g.priority === 'medium');
  const lowPriority = gaps.filter((g) => g.priority === 'low');

  return (
    <div className="gap-analysis">
      <div className="gap-header">
        <h2>🎯 Wardrobe Gaps Analysis</h2>
        <p>Here's what could improve your wardrobe</p>
      </div>

      {highPriority.length > 0 && (
        <div className="gap-section">
          <h3 className="gap-section-title high">🔴 High Priority</h3>
          <div className="gap-list">
            {highPriority.map((gap, idx) => (
              <GapCard key={idx} gap={gap} selected={selectedGap === gap} onClick={() => handleSelectGap(gap)} />
            ))}
          </div>
        </div>
      )}

      {mediumPriority.length > 0 && (
        <div className="gap-section">
          <h3 className="gap-section-title medium">🟡 Medium Priority</h3>
          <div className="gap-list">
            {mediumPriority.map((gap, idx) => (
              <GapCard key={idx} gap={gap} selected={selectedGap === gap} onClick={() => handleSelectGap(gap)} />
            ))}
          </div>
        </div>
      )}

      {lowPriority.length > 0 && (
        <div className="gap-section">
          <h3 className="gap-section-title low">🟢 Low Priority</h3>
          <div className="gap-list">
            {lowPriority.map((gap, idx) => (
              <GapCard key={idx} gap={gap} selected={selectedGap === gap} onClick={() => handleSelectGap(gap)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GapCard = ({ gap, selected, onClick }) => {
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  return (
    <div className={`gap-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="gap-card-header">
        <h4>{gap.title}</h4>
        <span className="gap-priority">{priorityEmoji[gap.priority]}</span>
      </div>
      <p className="gap-description">{gap.description}</p>
      <div className="gap-suggestion">💡 {gap.suggestion}</div>
      {gap.category && <div className="gap-category">Category: {gap.category}</div>}
    </div>
  );
};

export default GapAnalysis;
