import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';

const TOP_PRODUCTS = [
    { id: 1, name: "PRO TEXTILE Vittrace Basic", price: "100K-135K", image: "1.jpg" },
    { id: 44, name: "PURE DESIGN Vittrace Natural", price: "250K-275K", image: "44.jpg" },
    { id: 91, name: "Platinum 9 Collection ARMANO", price: "425K", image: "91.jpg" },
    { id: 101, name: "GVTEX Harmoni A8011", price: "185K-235K", image: "101.jpg" }
];

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/product/${product.id}`)} className="group bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-yellow-600 transition-all cursor-pointer relative z-20">
            <div className="h-64"><img src={`/images/${product.image}`} className="w-full h-full object-cover" /></div>
            <div className="p-4">
                <h4 className="font-bold text-white line-clamp-1">{product.name}</h4>
                <p className="text-yellow-500 font-bold">{product.price}</p>
                <button className="mt-4 text-yellow-400 text-sm">Details</button>
            </div>
        </div>
    );
};

const ProductCarousel = () => (
    <div className="py-16 bg-neutral-900 relative z-20">
        <Swiper modules={[Autoplay, Pagination, Navigation]} spaceBetween={20} slidesPerView={1} loop={true} breakpoints={{ 1024: { slidesPerView: 4 } }}>
            {TOP_PRODUCTS.map((p) => <SwiperSlide key={p.id}><ProductCard product={p} /></SwiperSlide>)}
        </Swiper>
    </div>
);
export default ProductCarousel;