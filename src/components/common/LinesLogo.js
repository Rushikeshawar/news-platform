// src/components/common/LinesLogo.js
import React, { useState, useEffect } from 'react';

const LinesLogo = ({
  height = 40,
  showTagline = false,
  animated = false,
  className = '',
  theme = 'light',
}) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (animated) {
      const intervals = [
        setTimeout(() => setAnimationStage(1), 100),
        setTimeout(() => setAnimationStage(2), 300),
        setTimeout(() => setAnimationStage(3), 500),
        setTimeout(() => setAnimationStage(4), 800),
      ];
      return () => intervals.forEach(clearTimeout);
    }
  }, [animated]);

  const lineHeight = height * 0.15;
  const lineWidth = height * 0.6; // Slightly reduced for better fit
  const spacing = height * 0.1; // Adjusted spacing for alignment

  // Fixed colors to match design intent
  const lineColor = theme === 'light' ? '#2563eb' : '#1d4ed8'; // Light mode: #2563eb, Dark mode: darker blue
  const textColor = theme === 'light' ? '#111827' : '#040404ff';
  const taglineColor = theme === 'light' ? '#4a5568' : '#9ca3af';

  const lineStyle = {
    height: `${lineHeight}px`,
    backgroundColor: lineColor,
    borderRadius: `${lineHeight / 2}px`,
    transition: animated ? 'width 0.3s ease-out' : 'none',
  };

  const getLineWidth = (lineIndex) => {
    if (!animated) return `${lineWidth}px`;
    return animationStage >= lineIndex ? `${lineWidth}px` : '0px';
  };

  const textOpacity = animated ? (animationStage >= 4 ? 1 : 0) : 1;
  const textTransform = animated ? (animationStage >= 4 ? 'translateX(0)' : 'translateX(20px)') : 'translateX(0)';

  return (
    <div className={`flex items-center ${className}`} style={{ height: `${height}px`, alignItems: 'center', verticalAlign: 'middle' }}>
      {/* Logo Icon (Three equal lines) */}
      <div className="flex flex-col justify-center" style={{ width: `${height * 0.7}px`, padding: '2px 0' }}>
        <div style={{ ...lineStyle, width: getLineWidth(1) }} />
        <div style={{ height: `${spacing}px` }} />
        <div style={{ ...lineStyle, width: getLineWidth(2) }} />
        <div style={{ height: `${spacing}px` }} />
        <div style={{ ...lineStyle, width: getLineWidth(3) }} />
      </div>
      <div style={{ width: `${height * 0.2}px` }} /> {/* Reduced spacing between lines and text */}
      {/* Text Logo */}
      <div
        className="flex flex-col justify-center"
        style={{
          opacity: textOpacity,
          transform: textTransform,
          transition: animated ? 'opacity 0.3s ease-out, transform 0.3s ease-out' : 'none',
        }}
      >
        <div
          className="font-bold"
          style={{
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: `${height * 0.45}px`,
            letterSpacing: '2px',
            lineHeight: '1',
            color: textColor,
          }}
        >
          LINES
        </div>
        {showTagline && (
          <>
            <div style={{ height: `${height * 0.02}px` }} />
            <div
              className="font-medium"
              style={{
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontSize: `${height * 0.20}px`,
                letterSpacing: '0.5px',
                lineHeight: '1',
                color: taglineColor,
              }}
            >
              The World in One Line
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LinesLogo;