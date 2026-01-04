import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# --- KONFIGURASI CORS (UPDATE UNTUK DEPLOY) ---
# Kita izinkan semua origin ("*") agar Frontend di Railway bisa akses Backend ini tanpa kena blokir.
CORS(app, resources={r"/*": {"origins": "*"}})

# --- KONFIGURASI DATA ---
INDO_STOP_WORDS = [
    'yang', 'untuk', 'pada', 'saya', 'anda', 'kita', 'mereka', 'dengan', 
    'adalah', 'di', 'ke', 'dari', 'dan', 'atau', 'ini', 'itu', 'mau',
    'ingin', 'warna', 'berwarna', 'dinding', 'seperti', 'cocok', 'pilih',
    'gorden', 'tirai', 'model', 'bahan'
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Pastikan folder 'data' dan file csv Anda ikut ter-upload ke GitHub!
DATA_PATH = os.path.join(BASE_DIR, 'data', 'dataset_gordyn.csv')

# --- INISIALISASI VARIABEL GLOBAL ---
df = pd.DataFrame()
tfidf = None
tfidf_matrix = None

# --- FUNGSI LOAD DATA (DIAGNOSTIK) ---
def load_data():
    global df, tfidf, tfidf_matrix
    print("="*60)
    print(f"📂 MEMULAI PROSES LOAD DATA...")
    print(f"📍 Path File: {DATA_PATH}")

    # 1. Cek Apakah File Ada
    if not os.path.exists(DATA_PATH):
        print("❌ FATAL ERROR: File 'dataset_gordyn.csv' TIDAK DITEMUKAN!")
        print(f"   Pastikan file ada di folder: {os.path.join(BASE_DIR, 'data')}")
        return False

    # 2. Coba Baca CSV (Handle Encoding Error)
    try:
        # Coba UTF-8 dulu
        df = pd.read_csv(DATA_PATH, encoding='utf-8', on_bad_lines='skip')
    except UnicodeDecodeError:
        print("⚠️  Gagal baca UTF-8, mencoba encoding latin-1 (Excel format)...")
        try:
            df = pd.read_csv(DATA_PATH, encoding='latin-1', on_bad_lines='skip')
        except Exception as e:
            print(f"❌ FATAL ERROR: Format file CSV rusak. Pesan: {e}")
            return False

    # 3. Cek Kelengkapan Kolom
    # Pastikan nama kolom di CSV sesuai dengan ini (Case Sensitive!)
    required_columns = ['Nama_Gorden', 'Deskripsi', 'Gaya', 'Warna', 'Bahan']
    # Normalisasi nama kolom di dataframe (opsional, jaga-jaga ada spasi)
    df.columns = df.columns.str.strip()
    
    missing = [col for col in required_columns if col not in df.columns]
    
    if missing:
        print(f"❌ FATAL ERROR: Kolom berikut HILANG dari CSV: {missing}")
        print(f"   Kolom yang ada: {df.columns.tolist()}")
        return False

    # 4. Proses Vectorizer
    try:
        # Gabungkan fitur (Pastikan semua jadi string agar tidak crash)
        df['Combined_Features'] = (
            df['Nama_Gorden'].astype(str) + " " + 
            df['Deskripsi'].astype(str) + " " + 
            df['Gaya'].astype(str) + " " + 
            df['Warna'].astype(str) + " " + 
            df['Bahan'].astype(str)
        )
        df['Combined_Features'] = df['Combined_Features'].str.lower()

        tfidf = TfidfVectorizer(stop_words=INDO_STOP_WORDS)
        tfidf_matrix = tfidf.fit_transform(df['Combined_Features'])
        
        # Buat kolom ID jika belum ada (untuk frontend)
        if 'ID' not in df.columns:
             df['ID'] = range(1, len(df) + 1)

        # Buat kolom Image_Filename jika belum ada
        if 'Image_Filename' not in df.columns:
            df['Image_Filename'] = df['ID'].astype(str) + ".jpg"

        print(f"✅ SUKSES: Berhasil memuat {len(df)} data produk!")
        print("="*60)
        return True
    except Exception as e:
        print(f"❌ ERROR saat memproses data AI: {e}")
        return False

# Jalankan Load Data saat startup
if not load_data():
    print("⚠️ SERVER BERJALAN DALAM MODE ERROR (Data Gagal Dimuat)")

# --- LOGIC CHATBOT ---
def generate_smart_advice(query):
    query = query.lower()
    advice = ""
    if any(x in query for x in ['timur', 'barat', 'matahari', 'panas', 'silau', 'siang']):
        advice = "Karena ruangan Anda terpapar cahaya matahari langsung, saya sangat menyarankan gorden tipe **Blackout 100%** atau **90%** untuk menahan panas."
    elif any(x in query for x in ['kecil', 'sempit', 'gelap', 'minimalis']):
        advice = "Untuk ruangan terbatas, gunakan warna cerah (Putih/Krem) atau bahan **Vittrace** agar ruangan terasa luas."
    elif any(x in query for x in ['lantai', 'atas', 'apartemen', 'tinggi']):
        advice = "Untuk privasi di lantai tinggi, Gorden **Double Layer** adalah pilihan terbaik."
    elif any(x in query for x in ['kantor', 'kerja', 'formal']):
        advice = "Untuk ruang kerja, **Vertical Blind** atau warna netral memberikan kesan profesional."
    else:
        advice = "Berdasarkan preferensi Anda, berikut adalah koleksi terbaik kami."
    return advice

# --- API ENDPOINT ---
@app.route('/api/recommend', methods=['POST'])
def recommend():
    if df.empty or tfidf is None:
        return jsonify({
            "insight": "Sistem sedang memuat data atau mengalami gangguan.",
            "products": []
        }), 500

    try:
        data = request.json
        user_query = data.get('query', '').lower()
        
        if not user_query.strip():
            return jsonify({"error": "Query kosong"}), 400

        user_vec = tfidf.transform([user_query])
        similarity_scores = cosine_similarity(user_vec, tfidf_matrix).flatten()
        top_indices = similarity_scores.argsort()[-10:][::-1]

        recommendations = []
        for i in top_indices:
            score = similarity_scores[i]
            if score > 0.1: 
                item = df.iloc[i].to_dict()
                # Bersihkan data untuk JSON (hapus NaN)
                item = {k: (v if pd.notna(v) else "") for k, v in item.items()}
                item['score'] = f"{int(score * 100)}%" 
                recommendations.append(item)
            else:
                break 

        ai_insight = generate_smart_advice(user_query)

        return jsonify({
            "insight": ai_insight,
            "products": recommendations
        })

    except Exception as e:
        print(f"Error Runtime: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

# --- API GET PRODUCT BY ID ---
@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    if df.empty:
        return jsonify({"error": "Data belum dimuat"}), 503

    try:
        product = df[df['ID'] == product_id]
        
        if product.empty:
            return jsonify({"error": "Produk tidak ditemukan"}), 404
        
        item = product.iloc[0].to_dict()
        item = {k: (v if pd.notna(v) else "") for k, v in item.items()}
        
        return jsonify(item)

    except Exception as e:
        print(f"Error detail: {e}")
        return jsonify({"error": "Server Error"}), 500

@app.route('/', methods=['GET'])
def home():
    return "Kurnia Elite Backend is Running!"

# --- BAGIAN PENTING UNTUK DEPLOYMENT ---
if __name__ == '__main__':
    # Railway akan menyediakan PORT lewat environment variable
    # Jika dijalankan di local, default ke 5000
    port = int(os.environ.get("PORT", 5000))
    
    # host='0.0.0.0' PENTING agar bisa diakses dari luar container
    app.run(host='0.0.0.0', port=port)