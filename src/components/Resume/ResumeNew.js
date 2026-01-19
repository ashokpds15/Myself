import React from 'react';

const ExternalSiteEmbed = () => {
  return (
    <div>
      {/* Live market timing message */}
      <div style={{ 
        textAlign: 'center', 
        padding: '37px', 
        fontSize: '18px', 
        fontWeight: 'Italy', 
        backgroundColor: '#001f3f',  // Navy blue background
        color: '#FFDD57',  // Yellow text color
        borderBottom: '2px solid #FF4136',  // Red bottom border
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Shadow for depth
        position: 'relative',  // Required for absolute positioning of the scrolling text
        overflow: 'hidden',  // Hide overflow to keep the animation contained
      }}>
        <div style={{
          whiteSpace: 'nowrap',  // Prevent line breaks
          position: 'absolute',
          width: '100%',
          animation: 'scroll 100s linear infinite',  // Animation details
          left: '100%',
        }}>
          This data is <span style={{ color: '#FF4136', fontWeight: 'bold' }}>live</span> between Sunday to Thursday 11 PM to 3 PM
        </div>
      </div>

      {/* Embedded iframe with the live market */}
      <div style={{ height: 'calc(100vh - 60px)', width: '100%' }}>
        <iframe
          src="https://nepsealpha.com/live-market?mobile_app=1"
          title="Live Market"
          style={{ 
            height: '100%', 
            width: '100%', 
            border: '5px solid #000' 
          }}
        />
      </div>
      
      <style>
        {`
          @keyframes scroll {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default ExternalSiteEmbed;