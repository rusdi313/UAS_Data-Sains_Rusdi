import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PieChart as PieIcon, BarChart as BarIcon, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatsPage = () => {
  const navigate = useNavigate();

  // Data 1: Komposisi Bahan
  const materialData = [
    { name: 'Blackout (100%-90%)', value: 45 },
    { name: 'Vittrace (Sheer)', value: 35 },
    { name: 'Jacquard/Luxury', value: 20 },
  ];

  // Data 2: Distribusi Harga
  const priceData = [
    { range: '100K-150K', jumlah: 15 },
    { range: '150K-200K', jumlah: 25 },
    { range: '200K-300K', jumlah: 30 },
    { range: '300K-450K', jumlah: 10 },
  ];

  const COLORS = ['#EAB308', '#CA8A04', '#A16207', '#713F12'];

  return (
    <div className="min-h-screen bg-neutral-900 text-white pt-32 pb-12 px-6 relative z-30">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')} className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
                <ArrowLeft size={24} className="text-yellow-500" />
            </button>
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <TrendingUp className="text-yellow-500" /> 
                    Dashboard Data Gorden
                </h1>
                <p className="text-gray-400 text-sm">Analisis Statistik Produk Kurnia Elite</p>
            </div>
        </div>

        {/* Grid Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* CHART 1: Komposisi Bahan */}
            <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-100">
                    <PieIcon size={20} className="text-yellow-500"/> Komposisi Bahan
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={materialData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {materialData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            {/* PERUBAHAN DI SINI: itemStyle={{ color: '#fff' }} */}
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} 
                                itemStyle={{ color: '#ffffff' }} 
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                    *Mayoritas produk adalah bahan Blackout untuk privasi maksimal.
                </p>
            </div>

            {/* CHART 2: Distribusi Harga */}
            <div className="bg-neutral-800 p-6 rounded-3xl border border-neutral-700 shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-100">
                    <BarIcon size={20} className="text-yellow-500"/> Distribusi Harga
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                            <XAxis dataKey="range" stroke="#9CA3AF" tick={{fontSize: 12}} />
                            <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
                            {/* PERUBAHAN DI SINI JUGA */}
                            <Tooltip 
                                cursor={{fill: '#262626'}} 
                                contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }} 
                                itemStyle={{ color: '#ffffff' }}
                                labelStyle={{ color: '#eab308' }} // Warna judul tooltip jadi emas
                            />
                            <Bar dataKey="jumlah" fill="#EAB308" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">
                    *Produk terbanyak berada di rentang harga menengah (200K-300K).
                </p>
            </div>

        </div>

        {/* Insight Card */}
        <div className="mt-8 bg-gradient-to-r from-yellow-900/20 to-neutral-800 border border-yellow-500/20 p-6 rounded-3xl">
            <h3 className="text-lg font-bold text-yellow-500 mb-2">💡 Insight Data Science</h3>
            <p className="text-gray-300 leading-relaxed">
                Berdasarkan analisis dataset, pelanggan cenderung mencari gorden dengan fitur <span className="text-white font-bold">Blackout</span>. 
                Sistem rekomendasi saat ini menggunakan metode <em>Content-Based Filtering</em> dengan algoritma TF-IDF untuk mencocokkan deskripsi produk dengan preferensi pengguna.
            </p>
        </div>

      </div>
    </div>
  );
};

export default StatsPage;