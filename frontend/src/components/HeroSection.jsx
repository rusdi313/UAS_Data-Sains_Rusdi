import React from 'react';
import { Search } from 'lucide-react';

const HeroSection = () => {
  const scrollToRec = () => {
    document.getElementById('rekomendasi').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="home" className="relative z-20 min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <div className="inline-block px-4 py-1 mb-6 rounded-full border border-yellow-500/30 bg-yellow-900/20 backdrop-blur-sm">
          <span className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">✨ The Future of Interior Design</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="block text-white">Kemewahan Interior</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700">
            Dimulai dari Jendela
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Temukan gorden yang sempurna dengan teknologi <span className="text-yellow-400 font-semibold">AI Content-Based Filtering</span>. 
          Analisis gaya, bahan, dan warna yang sesuai dengan karakter ruangan Anda.
        </p>

        <button 
          onClick={scrollToRec}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.4)]"
        >
          <Search size={20} />
          Cari Rekomendasi AI
        </button>
      </div>
    </div>
  );
};

export default HeroSection;