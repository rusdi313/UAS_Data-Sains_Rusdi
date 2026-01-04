import React from 'react';
import { Star, CheckCircle, Search, Menu } from 'lucide-react';

const SpecializationSection = () => (
  <div className="relative z-20 py-24 bg-neutral-900">
    <div className="container mx-auto px-6">
       <div className="text-center mb-16">
          <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2 block">Our Expertise</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Spesialisasi Kami</h2>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: <Star className="text-yellow-400" />, title: "Premium Fabric", desc: "Bahan impor kualitas terbaik untuk ketahanan jangka panjang." },
            { icon: <CheckCircle className="text-yellow-400" />, title: "Smart Measurement", desc: "Pengukuran presisi untuk tampilan yang rapi dan elegan." },
            { icon: <Search className="text-yellow-400" />, title: "AI Consultant", desc: "Rekomendasi cerdas berbasis data, bukan sekadar intuisi." },
            { icon: <Menu className="text-yellow-400" />, title: "Custom Style", desc: "Sesuaikan gaya lipatan dan gantung sesuai selera Anda." }
          ].map((spec, i) => (
            <div key={i} className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 hover:border-yellow-600/50 transition-colors group">
               <div className="w-12 h-12 bg-yellow-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  {spec.icon}
               </div>
               <h3 className="text-xl font-bold text-white mb-3">{spec.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{spec.desc}</p>
            </div>
          ))}
       </div>
    </div>
  </div>
);

export default SpecializationSection;