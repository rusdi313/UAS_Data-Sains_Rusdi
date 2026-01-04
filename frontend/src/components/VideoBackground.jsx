import React from 'react';

const VideoBackground = () => {
  return (
    // Ensure z-index remains 0 or -1 to stay behind other content
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      
      {/* Dark Overlay (So text above is readable) */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
      
      {/* Video Container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] pointer-events-none">
        <iframe
          width="100%"
          height="100%"
          // New Video URL (ID: 4jv9-XU07es)
          // Parameter playlist=4jv9-XU07es important for auto-looping
          // Parameter start=11 added to start at the 11th second
          src="https://www.youtube.com/embed/4jv9-XU07es?autoplay=1&mute=1&controls=0&loop=1&playlist=4jv9-XU07es&showinfo=0&modestbranding=1&start=11"
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-60"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoBackground;