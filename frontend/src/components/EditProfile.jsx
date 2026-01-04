import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, User, Lock, Mail } from 'lucide-react';
import NotificationModal from './NotificationModal';

const EditProfile = () => {
  const navigate = useNavigate();
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  
  // State Data Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: '', 
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [notification, setNotification] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // Load Data User
  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('user_session'));
    if (!sessionData) {
      navigate('/login');
      return;
    }

    const usersDb = JSON.parse(localStorage.getItem('kurnia_users_db') || "{}");
    const userDetail = usersDb[sessionData.email];

    if (userDetail) {
      setCurrentUserEmail(sessionData.email);
      setFormData(prev => ({
        ...prev,
        name: userDetail.name,
        email: sessionData.email,
        photo: userDetail.photo || "", 
        currentPassword: userDetail.password 
      }));
    }
  }, [navigate]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    let finalPassword = formData.currentPassword; 

    if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmNewPassword) {
            setNotification({ isOpen: true, title: "Gagal", message: "Password baru tidak cocok.", type: "error" });
            return;
        }
        if (formData.newPassword.length < 3) {
            setNotification({ isOpen: true, title: "Gagal", message: "Password terlalu pendek.", type: "error" });
            return;
        }
        finalPassword = formData.newPassword;
    }

    const usersDb = JSON.parse(localStorage.getItem('kurnia_users_db') || "{}");
    
    usersDb[currentUserEmail] = {
        name: formData.name,
        password: finalPassword,
        photo: formData.photo
    };
    
    localStorage.setItem('kurnia_users_db', JSON.stringify(usersDb));

    const newSession = {
        name: formData.name,
        email: currentUserEmail,
        photo: formData.photo,
        isLoggedIn: true
    };
    localStorage.setItem('user_session', JSON.stringify(newSession));
    
    window.dispatchEvent(new Event("storage"));

    setNotification({ isOpen: true, title: "Berhasil!", message: "Profil Anda telah diperbarui.", type: "success" });
  };

  return (
    // PERUBAHAN UTAMA DI SINI:
    // 1. z-index dinaikkan menjadi z-[60] agar di atas navbar (z-50) dan video background.
    // 2. pointer-events-auto memastikan semua klik diterima.
    <div className="min-h-screen bg-neutral-900 text-white pt-32 pb-12 px-6 relative z-[60] pointer-events-auto">
      
      {/* Modal Notifikasi */}
      <NotificationModal 
        isOpen={notification.isOpen} onClose={() => setNotification({ ...notification, isOpen: false })}
        title={notification.title} message={notification.message} type={notification.type}
      />

      <div className="container mx-auto max-w-4xl relative">
        
        {/* Tombol Kembali */}
        <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 mb-8 transition-colors cursor-pointer relative z-50"
        >
          <ArrowLeft size={20} /> Kembali
        </button>

        <div className="bg-neutral-800 rounded-3xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col md:flex-row relative z-40">
          
          {/* Kolom Foto */}
          <div className="w-full md:w-1/3 bg-neutral-900/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-700">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-yellow-500/30 overflow-hidden bg-neutral-800 flex items-center justify-center shadow-lg">
                {formData.photo ? (
                    <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <User size={64} className="text-gray-500" />
                )}
              </div>
              
              <label className="absolute bottom-2 right-2 bg-yellow-600 p-2 rounded-full cursor-pointer hover:bg-yellow-500 transition-colors shadow-md text-black z-50">
                <Camera size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <p className="mt-4 text-gray-400 text-sm">Format: JPG, PNG (Max 2MB)</p>
          </div>

          {/* Kolom Form */}
          <div className="w-full md:w-2/3 p-8 md:p-12 relative">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500 border-b border-neutral-700 pb-4">Edit Informasi Akun</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">Nama Lengkap</label>
                <div className="relative">
                    <User className="absolute left-4 top-3.5 text-yellow-500/50" size={18} />
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 pl-12 pr-4 focus:border-yellow-500 focus:outline-none transition-colors text-white relative z-50" 
                    />
                </div>
              </div>

              <div className="space-y-2 opacity-60">
                <label className="text-sm font-bold text-gray-400">Email (Tidak dapat diubah)</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        value={formData.email} 
                        disabled 
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 text-gray-500 cursor-not-allowed relative z-50" 
                    />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-yellow-500"/> Ganti Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Password Baru</label>
                        <input 
                            type="password" 
                            name="newPassword" 
                            value={formData.newPassword} 
                            onChange={handleChange} 
                            placeholder="Kosongkan jika tidak diganti"
                            className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 px-4 focus:border-yellow-500 focus:outline-none text-white relative z-50" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Konfirmasi Password</label>
                        <input 
                            type="password" 
                            name="confirmNewPassword" 
                            value={formData.confirmNewPassword} 
                            onChange={handleChange} 
                            placeholder="Ulangi password baru"
                            className="w-full bg-neutral-900 border border-neutral-600 rounded-xl py-3 px-4 focus:border-yellow-500 focus:outline-none text-white relative z-50" 
                        />
                    </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button 
                    type="submit" 
                    className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-8 rounded-xl shadow-lg shadow-yellow-900/20 flex items-center gap-2 transition-all cursor-pointer relative z-50"
                >
                    <Save size={20} /> Simpan Perubahan
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;