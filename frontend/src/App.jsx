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
import AuthPage from './components/AuthPage';
import EditProfile from './components/EditProfile';
import StatsPage from './components/StatsPage';

// Komponen Halaman Utama (Home)
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
      {/* Container utama dengan styling dark mode */}
      <div className="relative min-h-screen bg-neutral-900 overflow-x-hidden">
        <VideoBackground />
        <Navbar /> 
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            
            {/* PERBAIKAN DI SINI: Ubah :id menjadi :productId */}
            <Route path="/product/:productId" element={<ProductDetail />} />
            
            <Route path="/profile" element={<EditProfile />} /> 
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;