import React from 'react';

const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {/* Overlay gelap yang sedikit transparan agar teks di atasnya terbaca */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 z-0"></div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%]">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/4jv9-XU07es?autoplay=1&mute=1&controls=0&loop=1&playlist=4jv9-XU07es&showinfo=0&modestbranding=1&start=11"
          title="Background Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full object-cover opacity-50"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoBackground;