import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, BarChart2 } from 'lucide-react'; // Tambah icon BarChart2
import { useLocation, useNavigate } from 'react-router-dom';

// --- [1. KOMPONEN MODAL INTERNAL UNTUK NAVBAR] ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative bg-neutral-900 border border-yellow-500/30 rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-scale-up text-center">
        
        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
          <LogOut size={32} />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-neutral-800 text-gray-300 hover:bg-neutral-700 font-medium transition-colors border border-neutral-700">Batal</button>
          <button onClick={onConfirm} className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold transition-colors shadow-lg shadow-red-900/20">Ya, Keluar</button>
        </div>
      </div>
    </div>
  );
};

// --- [2. KOMPONEN NAVBAR UTAMA] ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // State Baru: Foto Profil
  const [userPhoto, setUserPhoto] = useState(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // --- [UPDATE: LOGIKA LOAD USER & FOTO] ---
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user_session');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Ambil foto terbaru dari database user
        const usersDb = JSON.parse(localStorage.getItem('kurnia_users_db') || "{}");
        const userDetail = usersDb[parsedUser.email];

        if (userDetail && userDetail.photo) {
          setUserPhoto(userDetail.photo);
        } else {
          setUserPhoto(null);
        }
      } else {
        setUser(null);
        setUserPhoto(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  const confirmLogout = () => {
    localStorage.removeItem('user_session'); 
    sessionStorage.removeItem('last_search_cache'); 
    
    setUser(null);
    setUserPhoto(null); 
    setShowLogoutModal(false);
    setMobileMenuOpen(false);

    navigate('/');
    window.dispatchEvent(new Event("storage"));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? 'bg-neutral-900/95 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
  }`;

  return (
    <>
      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Keluar"
        message="Apakah Anda yakin ingin keluar dari akun Anda? Riwayat pencarian sesi ini akan disimpan."
      />

      <nav className={navbarClasses}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 rounded-lg flex items-center justify-center text-black font-bold text-xl border border-yellow-300">KE</div>
            <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">KURNIA ELITE</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-yellow-100/80">
            <button onClick={() => scrollToSection('home')} className="hover:text-yellow-400 transition-colors bg-transparent border-none cursor-pointer">Beranda</button>
            <button onClick={() => scrollToSection('rekomendasi')} className="hover:text-yellow-400 transition-colors bg-transparent border-none cursor-pointer">Cari Gorden</button>
            
            {/* MENU BARU: STATISTIK */}
            <button onClick={() => navigate('/stats')} className="hover:text-yellow-400 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1">
               Statistik
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-700">
                
                {/* Tombol Profil */}
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-300 transition-colors bg-transparent border-none cursor-pointer group"
                  title="Edit Profil"
                >
                  <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center border border-yellow-500/50 overflow-hidden group-hover:border-yellow-400 transition-colors">
                    {userPhoto ? (
                      <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <span>Hi, {user.name.split(' ')[0]}</span>
                </button>

                <button 
                  onClick={handleLogoutClick}
                  className="text-gray-400 hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer"
                  title="Keluar Akun"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.5)] cursor-pointer border-none"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-yellow-400 bg-transparent border-none cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900/95 backdrop-blur-xl border-t border-yellow-900/30 p-6 flex flex-col gap-4 absolute w-full left-0 top-full">
              <button onClick={() => scrollToSection('home')} className="text-yellow-100 hover:text-yellow-400 text-left py-2 bg-transparent border-none cursor-pointer">Beranda</button>
              <button onClick={() => scrollToSection('rekomendasi')} className="text-yellow-100 hover:text-yellow-400 text-left py-2 bg-transparent border-none cursor-pointer">Cari Gorden</button>
              
              {/* MENU BARU MOBILE: STATISTIK */}
              <button onClick={() => { setMobileMenuOpen(false); navigate('/stats'); }} className="text-yellow-100 hover:text-yellow-400 text-left py-2 bg-transparent border-none cursor-pointer">Statistik</button>
              
              {user ? (
                  <div className="border-t border-neutral-700 pt-4 mt-2">
                      <button 
                        onClick={() => { setMobileMenuOpen(false); navigate('/profile'); }}
                        className="flex items-center gap-3 text-yellow-500 font-bold mb-4 bg-transparent border-none cursor-pointer w-full text-left"
                      >
                         <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center border border-yellow-500/50 overflow-hidden">
                            {userPhoto ? (
                              <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <span>Akun: {user.name}</span>
                      </button>

                      <button onClick={handleLogoutClick} className="text-red-400 flex items-center gap-2 bg-transparent border-none cursor-pointer">
                          <LogOut size={16} /> Keluar
                      </button>
                  </div>
              ) : (
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="text-yellow-100 font-bold py-2 bg-transparent border-none cursor-pointer text-left">
                      Login / Register
                  </button>
              )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;