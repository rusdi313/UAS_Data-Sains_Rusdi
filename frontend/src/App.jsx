import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import VideoBackground from './components/VideoBackground';
import HeroSection from './components/HeroSection';
import ProductCarousel from './components/ProductCarousel';
import RecommendationSection from './components/RecommendationSection';
import SpecializationSection from './components/SpecializationSection';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';

const Home = () => (
  <>
    <HeroSection />
    <ProductCarousel />
    <RecommendationSection />
    <SpecializationSection />
  </>
);

const App = () => {
  return (
    <Router>
      {/* Hapus bg-neutral-900 di sini agar video background terlihat */}
      <div className="relative min-h-screen">
        <VideoBackground />
        <Navbar /> 
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;