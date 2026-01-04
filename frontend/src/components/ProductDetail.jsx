import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Tag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white relative z-30 pt-20">
        Memuat Detail...
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white relative z-30 pt-20">
        Produk tidak ditemukan.
    </div>
  );

  // --- LOGIC WHATSAPP ---
  // Format pesan: Halo, saya tertarik dengan [Nama Produk].
  const waNumber = "6281398998910";
  const message = `Halo Admin Kurnia Elite, saya tertarik dengan produk gorden: *${product.Nama_Gorden}* (ID: ${product.ID}). Boleh minta info lebih lanjut?`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-neutral-900 text-white pt-32 pb-12 px-6 relative z-30">
      <div className="container mx-auto max-w-5xl">
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 mb-8 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} /> Kembali ke Pencarian
        </button>

        <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 flex flex-col md:flex-row">
          
          {/* Sisi Kiri: Gambar */}
          <div className="w-full md:w-1/2 bg-neutral-700 relative h-96 md:h-auto">
            <img 
              src={`/images/${product.Image_Filename}`} 
              alt={product.Nama_Gorden} 
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src="https://via.placeholder.com/600x800?text=Kurnia+Elite"; }}
            />
          </div>

          {/* Sisi Kanan: Informasi */}
          <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="bg-yellow-600/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-600/30">
                  {product.Bahan}
                </span>
                <span className="bg-neutral-700 text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {product.Warna}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{product.Nama_Gorden}</h1>
              <p className="text-xl text-yellow-500 font-bold">{product.Harga}</p>
            </div>

            <div className="border-t border-neutral-700 my-4 pt-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Tag size={18} /> Deskripsi Produk
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                {product.Deskripsi}
              </p>
            </div>

            <div className="space-y-3 bg-neutral-900/50 p-4 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ID Produk:</span>
                <span className="text-white font-mono">#{product.ID}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gaya/Style:</span>
                <span className="text-white">{product.Gaya}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Kategori Harga:</span>
                <span className="text-white">{product.Kategori_Harga}</span>
              </div>
            </div>

            {/* --- TOMBOL WA (DIPERBARUI) --- */}
            <a 
              href={waLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold shadow-lg shadow-yellow-900/20 transition-all flex justify-center items-center gap-2 mt-4 cursor-pointer no-underline"
            >
              <CheckCircle size={20} />
              Pesan Sekarang via WhatsApp
            </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;