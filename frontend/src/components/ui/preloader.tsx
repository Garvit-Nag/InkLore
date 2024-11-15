import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div style={loaderStyle}>
      <div style={{ ...boxStyle, backgroundColor: '#4e4e4e', animationDelay: '0.2s' }}></div>
      <div style={{ ...boxStyle, backgroundColor: '#bdbdbd', animationDelay: '0.4s' }}></div>
      <div style={{ ...boxStyle, backgroundColor: '#4e4e4e', animationDelay: '0.6s' }}></div>
      <div style={{ ...boxStyle, backgroundColor: '#bdbdbd', animationDelay: '0.8s' }}></div>
    </div>
  );
};

const loaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100px',
  backgroundColor: 'transparent', // Dark mode background
};

const boxStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  margin: '0 8px',
  borderRadius: '50%',
  animation: 'jump 1s ease-in-out infinite',
};

// Injecting keyframes for the jumping animation
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
      @keyframes jump {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-30px);
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }
  

export default Preloader;
