import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose, title, message, type = 'success' }) => {
  // Tutup modal otomatis setelah 3 detik
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
      {/* Overlay Gelap */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-neutral-900 border border-yellow-500/30 rounded-2xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 animate-scale-up">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Konten */}
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            isSuccess ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isSuccess ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Progress Bar Durasi (Opsional) */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-b-2xl animate-progress-shrink w-full"></div>
      </div>

      {/* Style Animasi Lokal */}
      <style>{`
        @keyframes scale-up {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
        @keyframes progress-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress-shrink {
          animation: progress-shrink 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default NotificationModal;