import React, { useState } from 'react';

const ComicPanel = ({ panel, panelNumber }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format text with ** emphasis
  const formatText = (text) => {
    if (!text) return '';
    
    // Split by ** to find emphasis parts
    const parts = text.split('**');
    
    return parts.map((part, index) => {
      // Every odd index (1, 3, 5...) should be emphasized
      if (index % 2 === 1) {
        return <span key={index} className="emphasis">{part}</span>;
      }
      return part;
    });
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  return (
    <div className="comic-panel">
      <div className="panel-number">
        Page {panelNumber}
      </div>
      
      <div className="panel-content">
        <div className="comic-page">
          {/* Image Section */}
          <div className="comic-image-section">
            {!imageLoaded && !imageError && (
              <div className="image-loading">
                Loading...
              </div>
            )}
            
            {imageError && (
              <div className="image-loading" style={{ color: '#ff4488' }}>
                Loading Error
              </div>
            )}
            
            <img
              src={panel.imageUrl}
              alt={`Comic panel ${panelNumber}`}
              className="panel-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Text Section */}
          <div className="comic-text-section">
            <div className="speech-bubble">
              <div className="story-text">
                <strong>Comic Panel Description:</strong> {formatText(panel.text)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicPanel; 