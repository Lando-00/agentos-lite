import React from 'react';
import { usePage } from './PageContext';
import './BackButton.css';

const BackButton: React.FC = () => {
  const { returnToChat } = usePage();

  return (
    <button 
      className="back-button" 
      onClick={returnToChat} 
      aria-label="Return to chat"
      title="Return to chat"
    >
      <span className="back-arrow">←</span>
      <span className="back-text">Back</span>
    </button>
  );
};

export default BackButton;
