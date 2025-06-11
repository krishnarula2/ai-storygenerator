import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ComicPanel from './components/ComicPanel';

function App() {
  const [prompt, setPrompt] = useState('');
  const [panels, setPanels] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [currentStoryTheme, setCurrentStoryTheme] = useState('');
  
  // Comic Reader State
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

  const generateStory = async () => {
    if (!prompt.trim()) {
      setError('Please enter a story prompt');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      
      // Generate story text
      const storyResponse = await axios.post('/generate-story', {
        prompt: prompt.trim()
      });
      
      // Generate image for the story
      const imageResponse = await axios.post('/generate-image', {
        scene: storyResponse.data.story
      });
      
      const newPanel = {
        id: Date.now(),
        text: storyResponse.data.story,
        imageUrl: imageResponse.data.image_url,
        timestamp: new Date().toISOString()
      };
      
      setPanels([newPanel]);
      setCurrentStoryTheme(prompt.trim());
      setPrompt('');
      
    } catch (error) {
      console.error('Error generating story:', error);
      setError('Failed to generate story. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const continueStory = async () => {
    if (panels.length === 0) {
      setError('Generate the first panel before continuing');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      
      // Send the current story context for continuation
      const previousStories = panels.map(panel => panel.text);
      
      // Generate continued story
      const storyResponse = await axios.post('/generate-story', {
        prompt: `Continue this story: ${previousStories.join(' ')}`
      });
      
      // Generate image for the new story part
      const imageResponse = await axios.post('/generate-image', {
        scene: storyResponse.data.story
      });
      
      const newPanel = {
        id: Date.now(),
        text: storyResponse.data.story,
        imageUrl: imageResponse.data.image_url,
        timestamp: new Date().toISOString()
      };
      
      setPanels(prevPanels => [...prevPanels, newPanel]);
      
    } catch (error) {
      console.error('Error continuing story:', error);
      setError('Failed to continue story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const clearStory = () => {
    setPanels([]);
    setCurrentStoryTheme('');
    setPrompt('');
    setError('');
    setIsReaderOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateStory();
    }
  };

  // Comic Reader Functions
  const openReader = (panelIndex) => {
    setCurrentPanelIndex(panelIndex);
    setIsReaderOpen(true);
  };

  const closeReader = () => {
    setIsReaderOpen(false);
  };

  const goToNextPanel = () => {
    if (currentPanelIndex < panels.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    }
  };

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    }
  };

  // Keyboard navigation for comic reader
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isReaderOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          goToNextPanel();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousPanel();
          break;
        case 'Escape':
          e.preventDefault();
          closeReader();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReaderOpen, currentPanelIndex, panels.length]);

  // Format text with ** emphasis for the reader
  const formatText = (text) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className="emphasis">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="app">
      {/* AI Status Indicator */}
      <div className="ai-indicator">
        AI NEURAL NET ONLINE
      </div>

      <header className="header">
        <h1 className="title">COMICQUEST</h1>
        <p className="subtitle">Neural AI Story Generator</p>
        <div className="ai-status">
          QUANTUM PROCESSING ENABLED
        </div>
      </header>

      <main className="main-container">
        <section className="terminal-section">
          <label className="prompt-label">
            Initialize Comic Sequence:
          </label>
          
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            className="prompt-input"
            placeholder="Enter neural pathway: A cyberpunk detective discovers a conspiracy that goes beyond reality..."
            disabled={isGenerating}
          />
          
          <div className="button-cluster">
            <button
              onClick={generateStory}
              disabled={isGenerating || !prompt.trim()}
              className="generate-button"
            >
              {isGenerating && panels.length === 0 ? 'NEURAL PROCESSING...' : 'EXECUTE COMIC GENERATION'}
            </button>
          </div>
          
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--text-secondary)', 
            marginTop: '0.8rem',
            fontFamily: "'JetBrains Mono', monospace",
            opacity: 0.7
          }}>
            {'>> '}Tip: Press Ctrl+Enter to generate quickly
          </div>
        </section>

        {/* Comic Panels Display */}
        {isGenerating && <div className="loading">Neural Network Processing...</div>}
        {error && <div className="error">Error: {error}</div>}
        
        {panels.length > 0 && (
          <div className="comic-panels">
            {panels.map((panel, index) => (
              <div key={panel.id} onClick={() => openReader(index)} className="clickable-panel">
                <ComicPanel panel={panel} panelNumber={index + 1} />
              </div>
            ))}
          </div>
        )}
        
        {/* Comic Reader Modal */}
        {isReaderOpen && (
          <div className="comic-reader-overlay" onClick={closeReader}>
            <div className="comic-reader" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button className="reader-close" onClick={closeReader}>×</button>
              
              {/* Navigation Info */}
              <div className="reader-info">
                Page {currentPanelIndex + 1} of {panels.length}
              </div>
              
              {/* Main Comic Panel */}
              <div className="reader-panel">
                <div className="reader-image-section">
                  <img
                    src={panels[currentPanelIndex].imageUrl}
                    alt={`Comic panel ${currentPanelIndex + 1}`}
                    className="reader-image"
                  />
                </div>
                
                <div className="reader-text-section">
                  <div className="reader-speech-bubble">
                    <div className="reader-story-text">
                      <strong>Comic Panel Description:</strong> {formatText(panels[currentPanelIndex].text)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button 
                className="nav-arrow nav-arrow-left" 
                onClick={goToPreviousPanel}
                disabled={currentPanelIndex === 0}
              >
                ‹
              </button>
              
              <button 
                className="nav-arrow nav-arrow-right" 
                onClick={goToNextPanel}
                disabled={currentPanelIndex === panels.length - 1}
              >
                ›
              </button>
              
              {/* Keyboard Hints */}
              <div className="reader-hints">
                <span>← → Arrow keys to navigate</span>
                <span>ESC to close</span>
                <span>SPACE for next panel</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Integrated Action Panel - Always visible when there are panels */}
        {panels.length > 0 && (
          <div className="action-panel">
            <button 
              className="continue-button" 
              onClick={continueStory}
              disabled={isGenerating}
            >
              Continue Sequence
            </button>
            <button 
              className="clear-button" 
              onClick={clearStory}
            >
              Clear Memory
            </button>
            {panels.length > 0 && (
              <button 
                className="read-button" 
                onClick={() => openReader(0)}
              >
                Read Comic
              </button>
            )}
          </div>
        )}
        
        {currentStoryTheme && panels.length > 0 && (
          <div className="status-info">
            ACTIVE SEQUENCE: "{currentStoryTheme}" | PANELS GENERATED: {panels.length}
            <br />
            <small style={{ opacity: 0.8 }}>Click any panel to enter reading mode</small>
          </div>
        )}
      </main>
    </div>
  );
}

export default App; 