import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Tag, Info, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // --- KONFIGURASI API ---
  const API_BASE_URL = "https://kurnia-backend.up.railway.app"; 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        // UPDATE: Menggunakan URL Railway untuk mengambil detail produk
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error("Produk tidak ditemukan atau server bermasalah.");
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch Detail Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
        <p className="text-xl">Memuat Detail Produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white p-6">
        <div className="bg-red-500/10 border border-red-500 p-8 rounded-2xl text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Waduh! Terjadi Kesalahan</h2>
          <p className="text-gray-400 mb-6">{error || "Data produk gagal dimuat."}</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors flex items-center gap-2 mx-auto">
            <ArrowLeft size={18} /> Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Koleksi
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* IMAGE SECTION */}
          <div className="w-full lg:w-1/2">
            <div className="rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-800 aspect-square">
              <img 
                src={`/images/${product.Image_Filename}`} 
                alt={product.Nama_Gorden}
                onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/800x800?text=Kurnia+Elite"}}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* INFO SECTION */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <div className="flex gap-3 mb-4">
                <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-xs font-bold uppercase tracking-widest">{product.Gaya}</span>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest">{product.Bahan}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.Nama_Gorden}</h1>
              <p className="text-3xl text-yellow-500 font-bold">{product.Harga}</p>
            </div>

            <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800">
              <h3 className="flex items-center gap-2 font-bold mb-4 text-gray-300"><Info size={18}/> Deskripsi Produk</h3>
              <p className="text-gray-400 leading-relaxed italic">"{product.Deskripsi}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-800 rounded-xl border border-neutral-700/50">
                <p className="text-xs text-gray-500 uppercase mb-1">Pilihan Warna</p>
                <p className="font-semibold text-white">{product.Warna || "N/A"}</p>
              </div>
              <div className="p-4 bg-neutral-800 rounded-xl border border-neutral-700/50">
                <p className="text-xs text-gray-500 uppercase mb-1">ID Produk</p>
                <p className="font-semibold text-white">#KE-{product.ID}</p>
              </div>
            </div>

            <button className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-lg rounded-2xl transition-all shadow-xl shadow-yellow-900/20 flex justify-center items-center gap-3">
              <ShoppingCart size={22} /> PESAN SEKARANG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;