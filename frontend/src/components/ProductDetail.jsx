import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Tag } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://kurnia-backend.up.railway.app/api/products/${productId}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setProduct(data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchProduct();
  }, [productId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white relative z-30">Memuat...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-white relative z-30">Produk tidak ditemukan.</div>;

  const waLink = `https://wa.me/6281398998910?text=${encodeURIComponent(`Halo, saya tertarik dengan ${product.Nama_Gorden} (#${product.ID})`)}`;

  return (
    <div className="min-h-screen bg-neutral-900/80 text-white pt-32 pb-12 px-6 relative z-30">
      <div className="container mx-auto max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 mb-8 cursor-pointer relative z-40">
          <ArrowLeft size={20} /> Kembali
        </button>
        <div className="bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 flex flex-col md:flex-row relative z-40">
          <div className="w-full md:w-1/2 h-96 md:h-auto"><img src={`/images/${product.Image_Filename}`} className="w-full h-full object-cover" /></div>
          <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6">
            <h1 className="text-3xl font-bold">{product.Nama_Gorden}</h1>
            <p className="text-2xl text-yellow-500 font-bold">{product.Harga}</p>
            <p className="text-gray-400">{product.Deskripsi}</p>
            <a href={waLink} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl bg-yellow-600 text-black font-bold flex justify-center items-center gap-2 cursor-pointer relative z-50">
              <CheckCircle size={20} /> Pesan Sekarang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;