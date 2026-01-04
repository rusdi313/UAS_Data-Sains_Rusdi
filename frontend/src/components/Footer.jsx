import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-20 bg-black py-12 border-t border-yellow-900/30">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center space-x-2 mb-6">
           <div className="w-8 h-8 flex items-center justify-center border border-[#C5A059] rounded text-[#C5A059] font-serif font-bold text-sm">KE</div>
           <span className="text-xl font-serif font-bold tracking-wide">Kurnia Ellite</span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
          Menghadirkan kemewahan dan fungsionalitas dalam satu balutan kain. Solusi interior modern berbasis data untuk hunian masa depan.
        </p>
      </div>
      
      <div>
        <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-xs mb-6">Layanan</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li><a href="#" className="hover:text-white transition">Konsultasi AI</a></li>
          <li><a href="#" className="hover:text-white transition">Katalog Premium</a></li>
          <li><a href="#" className="hover:text-white transition">Instalasi</a></li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-[#C5A059] font-bold uppercase tracking-widest text-xs mb-6">Hubungi Kami</h4>
        <ul className="space-y-4 text-sm text-gray-400">
          <li>Jl. Malaka No.2A, RT.5/RW.5, Cipayung, Kec. Cipayung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13840, Indonesia</li>
          <li>kurniaeliteinterior@gmail.com</li>
          <li>+62 813-9899-8910</li>
        </ul>
      </div>
    </div>
    
    <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
      &copy; 2025 Kurnia Elite. Powered by Rusdi Aulia Romadhon.
    </div>
    </footer>
  );
};

export default Footer;