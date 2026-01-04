import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Search, MessageSquare, History, Trash2, Clock, ThumbsUp, ThumbsDown } from 'lucide-react'; // Tambah icon ThumbsUp, ThumbsDown
import { useNavigate } from 'react-router-dom';

const RecommendationSection = () => {
  const navigate = useNavigate();
  
  // State Utama
  const [preference, setPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // State History & Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(""); 
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // State Feedback (Baru)
  const [feedbackStatus, setFeedbackStatus] = useState(null); // 'up', 'down', atau null

  // --- [LOGIKA BARU SAAT HALAMAN DIMUAT] ---
  useEffect(() => {
    const userSession = localStorage.getItem('user_session');
    
    if (userSession) {
      // === KONDISI 1: SUDAH LOGIN ===
      const userData = JSON.parse(userSession);
      setIsLoggedIn(true);
      setCurrentUserEmail(userData.email);

      // 1. Load History SPESIFIK milik user ini
      const userHistoryKey = `chat_history_${userData.email}`;
      const savedHistory = JSON.parse(localStorage.getItem(userHistoryKey) || "[]");
      setHistory(savedHistory);

      // 2. Load Cache Tampilan Terakhir
      const lastSearch = sessionStorage.getItem('last_search_cache');
      if (lastSearch) {
        const parsedSearch = JSON.parse(lastSearch);
        setPreference(parsedSearch.preference);
        setRecommendations(parsedSearch.recommendations);
        setAiMessage(parsedSearch.aiMessage);
        setShowResults(true);
      }

    } else {
      // === KONDISI 2: BELUM LOGIN (TAMU) ===
      setIsLoggedIn(false);
      setHistory([]);
      setCurrentUserEmail("");

      // Hapus cache tampilan agar saat refresh KEMBALI KOSONG
      sessionStorage.removeItem('last_search_cache');
      setPreference("");
      setShowResults(false);
      setRecommendations([]);
      setAiMessage("");
    }
  }, []);

  const handleSearch = async () => {
    if (!preference.trim()) return;
    
    setLoading(true); 
    setErrorMsg(""); 
    setShowResults(false); 
    setShowHistory(false);
    setFeedbackStatus(null); // Reset feedback saat pencarian baru

    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: preference }),
      });

      if (!response.ok) throw new Error("Gagal menghubungi server AI");
      const data = await response.json();
      
      setRecommendations(data.products);
      setAiMessage(data.insight);
      setShowResults(true);

      // Simpan cache sementara
      const searchCache = {
        preference: preference,
        recommendations: data.products,
        aiMessage: data.insight
      };
      sessionStorage.setItem('last_search_cache', JSON.stringify(searchCache));

      // --- [LOGIKA SIMPAN HISTORY PER USER] ---
      if (isLoggedIn && currentUserEmail) {
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
          query: preference,
          insight: data.insight,
          topProduct: data.products[0]?.Nama_Gorden || "Tidak ada hasil"
        };
        
        const updatedHistory = [newEntry, ...history];
        setHistory(updatedHistory);
        
        // Simpan dengan key UNIK berdasarkan email
        localStorage.setItem(`chat_history_${currentUserEmail}`, JSON.stringify(updatedHistory));
      }

      setTimeout(() => document.getElementById('results').scrollIntoView({ behavior: 'smooth' }), 100);

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Maaf, server AI sedang offline.");
    } finally {
      setLoading(false);
    }
  };

  // --- [FUNGSI FEEDBACK BARU] ---
  const handleFeedback = (type) => {
    setFeedbackStatus(type);
    
    // Simulasi Log Data Science (bisa dilihat di Console browser)
    console.log(`[DATA SCIENCE LOG] Feedback received: ${type.toUpperCase()}`);
    console.log(`[DATA SCIENCE LOG] Query: "${preference}"`);
    console.log(`[DATA SCIENCE LOG] Model Action: Retaining query for reinforcement learning.`);

    alert(type === 'up' 
        ? "Terima kasih! Kami senang rekomendasi ini membantu Anda." 
        : "Terima kasih! Masukan Anda akan kami gunakan untuk melatih ulang AI agar lebih cerdas.");
  };

  const clearHistory = () => {
    if(window.confirm("Hapus semua riwayat Anda?")) {
        setHistory([]);
        if (currentUserEmail) {
            localStorage.removeItem(`chat_history_${currentUserEmail}`);
        }
    }
  };

  const loadHistoryItem = (item) => {
    setPreference(item.query);
    setShowHistory(false);
  };

  const resetSearch = () => {
    setPreference("");
    setShowResults(false);
    setRecommendations([]);
    setAiMessage("");
    setFeedbackStatus(null); // Reset feedback
    sessionStorage.removeItem('last_search_cache');
  };

  return (
    <div id="rekomendasi" className="relative z-20 py-24 bg-neutral-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          {/* INPUT AREA */}
          <div className="w-full md:w-1/3 space-y-8 sticky top-24">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white"><span className="text-yellow-500">AI Smart</span> Matcher</h2>
              <p className="text-gray-400">Ceritakan keinginan Anda...</p>
            </div>

            <div className="bg-neutral-800 p-6 rounded-2xl border border-yellow-900/30 shadow-xl">
              {isLoggedIn && (
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-yellow-200">Preferensi Gorden</label>
                    <div className="flex gap-2">
                        {showResults && (
                            <button onClick={resetSearch} className="text-xs text-red-400 hover:text-white px-2 py-1">Reset</button>
                        )}
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            className="text-xs flex items-center gap-1 text-gray-400 hover:text-white bg-neutral-700 px-2 py-1 rounded transition-colors"
                        >
                            <History size={12} /> {showHistory ? "Tutup" : "Riwayat"}
                        </button>
                    </div>
                </div>
              )}

              {/* LOGIKA TAMPILAN HISTORY */}
              {showHistory && isLoggedIn ? (
                <div className="h-64 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm py-4">Belum ada riwayat pencarian.</p>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500">Terbaru</span>
                                <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><Trash2 size={10}/> Hapus Semua</button>
                            </div>
                            {history.map((item) => (
                                <div key={item.id} onClick={() => loadHistoryItem(item)} className="p-3 bg-neutral-900 rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors border border-neutral-700 hover:border-yellow-500/50">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                        <span className="flex items-center gap-1"><Clock size={10}/> {item.date}</span>
                                    </div>
                                    <p className="text-white text-sm line-clamp-2 italic">"{item.query}"</p>
                                    <p className="text-yellow-500/80 text-xs mt-1">💡 {item.topProduct}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              ) : (
                <>
                  <textarea 
                    className="w-full h-32 bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none mb-4"
                    placeholder="Contoh: Saya ingin gorden bahan linen..."
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                  />
                  <button onClick={handleSearch} disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold transition-all flex justify-center items-center gap-2">
                    {loading ? <><Loader2 className="animate-spin" size={20} /><span>Menganalisis...</span></> : <>Minta Saran AI <ArrowRight size={18} /></>}
                  </button>
                </>
              )}
              
              {errorMsg && <p className="text-red-400 text-sm mt-3 text-center">{errorMsg}</p>}
            </div>
          </div>

          {/* RESULT AREA */}
          <div id="results" className="w-full md:w-2/3">
            {!showResults && !loading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-neutral-800 rounded-3xl opacity-50">
                <Search size={64} className="text-neutral-700 mb-4" />
                <p className="text-xl font-semibold text-neutral-600">
                    {isLoggedIn ? "Halo, silakan cari gorden atau lihat riwayat Anda." : "Login untuk menyimpan hasil pencarian Anda."}
                </p>
              </div>
            ) : (
                <div className="space-y-6 animate-fade-in-up">
                    
                    {/* --- [UPDATE: CARD ANALISIS AI DENGAN FEEDBACK] --- */}
                    <div className="bg-gradient-to-r from-neutral-800 to-neutral-800 border-l-4 border-yellow-500 p-6 rounded-r-xl rounded-bl-xl shadow-lg mb-8">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-yellow-500/20 rounded-full"><MessageSquare className="text-yellow-500" size={24} /></div>
                            <div className="flex-1">
                                <h4 className="text-yellow-500 font-bold mb-1 text-sm uppercase tracking-wide">Analisis AI</h4>
                                <p className="text-gray-200 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: aiMessage }}></p>
                            </div>
                        </div>

                        {/* FITUR FEEDBACK LOOP */}
                        <div className="mt-4 pt-4 border-t border-neutral-700 flex items-center justify-end gap-3">
                            <span className="text-xs text-gray-500">Apakah saran ini membantu?</span>
                            <button 
                                onClick={() => handleFeedback('up')}
                                className={`p-2 rounded-lg transition-all ${feedbackStatus === 'up' ? 'bg-green-500/20 text-green-400' : 'hover:bg-neutral-700 text-gray-400'}`}
                                title="Saran Bagus"
                            >
                                <ThumbsUp size={16} />
                            </button>
                            <button 
                                onClick={() => handleFeedback('down')}
                                className={`p-2 rounded-lg transition-all ${feedbackStatus === 'down' ? 'bg-red-500/20 text-red-400' : 'hover:bg-neutral-700 text-gray-400'}`}
                                title="Saran Kurang Tepat"
                            >
                                <ThumbsDown size={16} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Grid Produk */}
                    {recommendations.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {recommendations.map((item, idx) => (
                                <div key={idx} className="group bg-neutral-800 rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(234,179,8,0.15)] transition-all border border-neutral-700 hover:border-yellow-500/50">
                                    <div className="relative h-56 overflow-hidden bg-neutral-700">
                                        <img src={`/images/${item.Image_Filename}`} onError={(e) => {e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300?text=Kurnia+Elite"}} alt={item.Nama_Gorden} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-yellow-500/50"><span className="text-yellow-400 font-bold text-sm">{item.score} Match</span></div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{item.Nama_Gorden}</h4>
                                        <div className="flex gap-2 mb-3">
                                            <span className="text-[10px] uppercase tracking-wider bg-neutral-700 px-2 py-0.5 rounded text-gray-300">{item.Bahan}</span>
                                            {item.Warna && <span className="text-[10px] uppercase tracking-wider bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-500 border border-yellow-500/20">{item.Warna}</span>}
                                        </div>
                                        <p className="text-yellow-500 font-bold text-xl mb-4">{item.Harga}</p>
                                        <button onClick={() => navigate(`/product/${item.ID}`)} className="w-full py-2 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-sm font-medium transition-colors border border-neutral-600">Lihat Detail</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationSection;