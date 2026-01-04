import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import NotificationModal from './NotificationModal';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // State Notifikasi
  const [notification, setNotification] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- [LOGIKA BARU: REGISTER TIDAK AUTO LOGIN] ---
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const email = formData.email.trim();
    const password = formData.password.trim();
    const nameInput = formData.name.trim();

    // 1. Validasi Dasar
    if (!email || !password) {
      setNotification({ isOpen: true, title: "Gagal", message: "Email dan Password wajib diisi.", type: "error" });
      return;
    }

    // 2. Akses Database Lokal
    const USERS_DB_KEY = 'kurnia_users_db'; 
    let usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || "{}");

    if (isLogin) {
      // ===========================
      // LOGIKA LOGIN (MASUK)
      // ===========================
      let finalUserName = "";

      if (usersDb[email]) {
        // User ditemukan, cek password
        if (usersDb[email].password === password) {
          finalUserName = usersDb[email].name;
        } else {
          setNotification({ isOpen: true, title: "Gagal Masuk", message: "Password salah.", type: "error" });
          return;
        }
      } else {
        // User tidak ditemukan (Login pertama kali tanpa register)
        // Kita buatkan nama sementara agar sistem tetap jalan
        finalUserName = email.split('@')[0];
        // Auto-save user 'tamu' ini agar data tersimpan
        usersDb[email] = { name: finalUserName, password: password };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
      }

      // --> PROSES LOGIN SUKSES
      const activeSession = {
        name: finalUserName,
        email: email,
        isLoggedIn: true
      };

      localStorage.setItem('user_session', JSON.stringify(activeSession));
      window.dispatchEvent(new Event("storage"));
      
      setNotification({
        isOpen: true,
        title: "Login Berhasil!",
        message: `Selamat datang kembali, ${finalUserName}. Mengalihkan...`,
        type: "success"
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } else {
      // ===========================
      // LOGIKA REGISTER (DAFTAR)
      // ===========================
      
      // Validasi Register
      if (!nameInput) {
        setNotification({ isOpen: true, title: "Gagal", message: "Nama Lengkap wajib diisi.", type: "error" });
        return;
      }
      if (password !== formData.confirmPassword) {
        setNotification({ isOpen: true, title: "Gagal", message: "Konfirmasi password tidak cocok.", type: "error" });
        return;
      }
      if (usersDb[email]) {
        setNotification({ isOpen: true, title: "Gagal", message: "Email sudah terdaftar. Silakan login.", type: "error" });
        return;
      }

      // --> SIMPAN DATA USER BARU
      usersDb[email] = {
        name: nameInput,
        password: password
      };
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));

      // --> BERHENTI DISINI (JANGAN LOGIN)
      // Tampilkan notifikasi sukses dan pindah ke tab Login
      setNotification({
        isOpen: true,
        title: "Registrasi Berhasil!",
        message: "Akun Anda telah dibuat. Silakan login dengan akun baru Anda.",
        type: "success"
      });

      // Pindah tampilan ke Form Login
      setIsLogin(true);
      
      // Opsional: Kosongkan password agar user mengetik ulang (keamanan)
      setFormData({ ...formData, password: '', confirmPassword: '' });
    }
  };
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative z-50 overflow-hidden">
      
      <NotificationModal 
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-yellow-600/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-yellow-800/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden relative z-10 bg-neutral-900">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="/images/kurniaelite.jpg" 
            alt="Kurnia Elite Background"
            className="w-full h-full object-cover opacity-20 grayscale-[30%]" 
          />
          <div className="absolute inset-0 bg-neutral-900/60 mix-blend-multiply"></div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-b from-neutral-800/80 to-neutral-900/80 p-8 text-center border-b border-neutral-800 relative z-10 backdrop-blur-sm">
          <button onClick={() => navigate('/')} className="absolute left-6 top-8 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 via-yellow-600 to-yellow-800 rounded-2xl flex items-center justify-center text-black font-bold text-2xl border border-yellow-300 shadow-lg mb-4">KE</div>
          <h2 className="text-2xl font-bold text-white tracking-wide drop-shadow-sm">{isLogin ? 'Selamat Datang' : 'Bergabung Bersama Kami'}</h2>
          <p className="text-sm text-gray-400 mt-2">{isLogin ? 'Masuk untuk mengakses akun eksklusif Anda' : 'Daftar untuk mendapatkan penawaran gorden terbaik'}</p>
        </div>

        {/* Form Container */}
        <div className="p-8 relative z-10 backdrop-blur-sm bg-neutral-900/30">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nama (Hanya Register) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors z-20" size={20} />
                  <input type="text" name="name" value={formData.name} placeholder="Contoh: Budi Santoso" className="w-full bg-neutral-950/80 text-white pl-12 pr-4 py-3 rounded-xl border border-neutral-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder-gray-600 backdrop-blur-md" onChange={handleChange} />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors z-20" size={20} />
                <input type="email" name="email" value={formData.email} placeholder="nama@email.com" className="w-full bg-neutral-950/80 text-white pl-12 pr-4 py-3 rounded-xl border border-neutral-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder-gray-600 backdrop-blur-md" onChange={handleChange} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors z-20" size={20} />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} placeholder="••••••••" className="w-full bg-neutral-950/80 text-white pl-12 pr-12 py-3 rounded-xl border border-neutral-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder-gray-600 backdrop-blur-md" onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-white transition-colors z-20">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Hanya Register) */}
            {!isLogin && (
              <div className="space-y-2 animate-fade-in-up">
                <label className="text-xs font-bold text-yellow-500 uppercase tracking-wider ml-1">Konfirmasi Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors z-20" size={20} />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="••••••••" className="w-full bg-neutral-950/80 text-white pl-12 pr-4 py-3 rounded-xl border border-neutral-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 outline-none transition-all placeholder-gray-600 backdrop-blur-md" onChange={handleChange} />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-gray-400 hover:text-yellow-500 transition-colors font-medium">Lupa Password?</button>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-lg shadow-lg shadow-yellow-900/30 transition-all hover:scale-[1.02] active:scale-95 mt-6 relative z-20">
              {isLogin ? 'Masuk Sekarang' : 'Daftar Akun'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-neutral-800/50 relative z-10">
            <p className="text-gray-400 text-sm font-medium">
              {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors underline decoration-yellow-500/30 hover:decoration-yellow-500">
                {isLogin ? 'Daftar di sini' : 'Login di sini'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;