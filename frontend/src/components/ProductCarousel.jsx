import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; 
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Star } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom'; // 1. Tambahkan import useNavigate

// --- Data Produk Katalog Baru ---
const TOP_PRODUCTS = [
    { id: 1, name: "PRO TEXTILE Vittrace Basic", style: "Minimalis", price: "100K-135K", image: "1.jpg", label: "Best Value" },
    { id: 10, name: "PURE DESIGN Vittrace Natural", style: "Linen Halus", price: "250K-275K", image: "10.jpg", label: "Natural Look" },
    { id: 25, name: "Platinum 9 Collection ARMANO", style: "Luxury", price: "425K", image: "25.jpg", label: "Premium" },
    { id: 30, name: "GVTEX Harmoni A8011", style: "Blackout 90%", price: "185K-235K", image: "30.jpg", label: "Best Seller" },
    { id: 45, name: "PRO TEXTILE THB Blackout", style: "Blackout 100%", price: "235K-395K", image: "45.jpg", label: "Total Dark" },
    { id: 50, name: "ARCILLA Premium Jacquard", style: "Jacquard", price: "235K-395K", image: "50.jpg", label: "Exclusive" },
];

// --- KOMPONEN PRODUCT CARD ---
const ProductCard = ({ product }) => {
    const navigate = useNavigate(); // 2. Inisialisasi navigate di dalam card
    const imagePath = `/images/${product.image}`; 
    
    // Fungsi untuk pindah ke halaman detail
    const goToDetail = () => {
        navigate(`/product/${product.id}`); // 3. Arahkan ke rute /product/:id
    };

    return (
        <div 
            onClick={goToDetail} // 4. Tambahkan klik pada seluruh area kartu
            className="group bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800 hover:border-yellow-600/50 transition-all cursor-pointer"
        >
            <div className="relative h-64 overflow-hidden bg-neutral-700">
                <img 
                    src={imagePath} 
                    alt={product.name} 
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300?text=Kurnia+Elite"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-md">
                    <span className="text-white text-xs font-medium">{product.label}</span>
                </div>
            </div>
            <div className="p-4 pt-5">
                <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{product.name}</h4>
                <p className="text-2xl font-extrabold text-yellow-500 mb-4">{product.price}</p>
                
                <div className="border-t border-neutral-800 my-3"></div>

                <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-yellow-400 flex items-center gap-1">
                        <Star size={16} fill="#facc15" strokeWidth={1} />
                        Trending
                    </span>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Mencegah klik ganda karena pembungkusnya juga punya onClick
                            goToDetail();
                        }}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProductCarousel = () => {
  return (
    <div className="relative z-20 py-16 bg-neutral-900 dark:bg-neutral-900 light:bg-gray-100 border-b border-t border-neutral-800 dark:border-neutral-800 light:border-gray-200">
        <div className="container mx-auto px-6">
            <div className="text-center mb-10">
                <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2 block">EXPLORE</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-white light:text-gray-900">Gorden Terbaik Kami</h2>
                <p className="text-gray-400 dark:text-gray-400 light:text-gray-600 mt-2">Lihat koleksi pilihan yang paling populer di kalangan pelanggan.</p>
            </div>

            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                    delay: 3500, 
                    disableOnInteraction: false, 
                }}
                loop={true} 
                breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 30 },
                }}
                className="mySwiper p-2"
            >
                {TOP_PRODUCTS.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    </div>
  );
};

export default ProductCarousel;