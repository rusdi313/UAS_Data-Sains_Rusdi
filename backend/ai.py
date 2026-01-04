import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# --- KONFIGURASI CORS ---
# Mengizinkan semua origin agar Frontend Railway bisa mengakses API ini
CORS(app, resources={r"/*": {"origins": "*"}})

# --- KONFIGURASI DATA ---
INDO_STOP_WORDS = [
    'yang', 'untuk', 'pada', 'saya', 'anda', 'kita', 'mereka', 'dengan', 
    'adalah', 'di', 'ke', 'dari', 'dan', 'atau', 'ini', 'itu', 'mau',
    'ingin', 'warna', 'berwarna', 'dinding', 'seperti', 'cocok', 'pilih',
    'gorden', 'tirai', 'model', 'bahan'
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'dataset_gordyn.csv')

# --- INISIALISASI VARIABEL GLOBAL ---
df = pd.DataFrame()
tfidf = None
tfidf_matrix = None

def load_data():
    global df, tfidf, tfidf_matrix
    print("="*60)
    print(f"📂 MEMULAI PROSES LOAD DATA...")
    print(f"📍 Path File: {DATA_PATH}")

    # 1. Cek Apakah File Ada
    if not os.path.exists(DATA_PATH):
        print("❌ FATAL ERROR: File 'dataset_gordyn.csv' TIDAK DITEMUKAN!")
        return False

    # 2. Baca CSV
    try:
        df = pd.read_csv(DATA_PATH, encoding='utf-8', on_bad_lines='skip')
    except UnicodeDecodeError:
        df = pd.read_csv(DATA_PATH, encoding='latin-1', on_bad_lines='skip')
    except Exception as e:
        print(f"❌ FATAL ERROR: Gagal membaca file. Pesan: {e}")
        return False

    # 3. Normalisasi Nama Kolom
    df.columns = df.columns.str.strip()
    
    # Pastikan Kolom ID ada dan bertipe INTEGER
    # Cari kolom yang namanya mirip 'id' (id, ID, Id)
    id_cols = [c for c in df.columns if c.upper() == 'ID']
    if id_cols:
        df = df.rename(columns={id_cols[0]: 'ID'})
        # Konversi ke numeric, jika ada yang bukan angka jadikan NaN lalu hapus
        df['ID'] = pd.to_numeric(df['ID'], errors='coerce')
        df = df.dropna(subset=['ID'])
        df['ID'] = df['ID'].astype(int)
    else:
        # Jika benar-benar tidak ada kolom ID, buat baru
        print("⚠️ Kolom ID tidak ditemukan, membuat ID otomatis...")
        df['ID'] = range(1, len(df) + 1)

    # 4. Validasi Kolom Wajib untuk AI
    required = ['Nama_Gorden', 'Deskripsi', 'Gaya', 'Warna', 'Bahan']
    missing = [col for col in required if col not in df.columns]
    if missing:
        print(f"❌ FATAL ERROR: Kolom AI hilang: {missing}")
        return False

    # 5. Proses Vectorizer
    try:
        df['Combined_Features'] = (
            df['Nama_Gorden'].fillna('').astype(str) + " " + 
            df['Deskripsi'].fillna('').astype(str) + " " + 
            df['Gaya'].fillna('').astype(str) + " " + 
            df['Warna'].fillna('').astype(str) + " " + 
            df['Bahan'].fillna('').astype(str)
        )
        df['Combined_Features'] = df['Combined_Features'].str.lower()

        tfidf = TfidfVectorizer(stop_words=INDO_STOP_WORDS)
        tfidf_matrix = tfidf.fit_transform(df['Combined_Features'])
        
        # Pastikan kolom Image_Filename tersedia
        if 'Image_Filename' not in df.columns:
            df['Image_Filename'] = df['ID'].astype(str) + ".jpg"

        print(f"✅ SUKSES: Berhasil memuat {len(df)} data produk!")
        print(f"📊 Rentang ID tersedia: {df['ID'].min()} sampai {df['ID'].max()}")
        print("="*60)
        return True
    except Exception as e:
        print(f"❌ ERROR saat memproses TF-IDF: {e}")
        return False

# Load data saat startup
if not load_data():
    print("⚠️ SERVER BERJALAN DALAM MODE ERROR")

def generate_smart_advice(query):
    query = query.lower()
    if any(x in query for x in ['timur', 'barat', 'matahari', 'panas', 'silau', 'siang']):
        return "Karena ruangan Anda terpapar cahaya matahari langsung, saya sangat menyarankan gorden tipe **Blackout 100%** atau **90%** untuk menahan panas."
    elif any(x in query for x in ['kecil', 'sempit', 'gelap', 'minimalis']):
        return "Untuk ruangan terbatas, gunakan warna cerah (Putih/Krem) atau bahan **Vittrace** agar ruangan terasa luas."
    elif any(x in query for x in ['lantai', 'atas', 'apartemen', 'tinggi']):
        return "Untuk privasi di lantai tinggi, Gorden **Double Layer** adalah pilihan terbaik."
    elif any(x in query for x in ['kantor', 'kerja', 'formal']):
        return "Untuk ruang kerja, **Vertical Blind** atau warna netral memberikan kesan profesional."
    return "Berdasarkan preferensi Anda, berikut adalah koleksi terbaik kami."

# --- API ENDPOINTS ---

@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "online", "message": "Kurnia Elite Backend is Running", "total_data": len(df)})

@app.route('/api/recommend', methods=['POST'])
def recommend():
    if df.empty or tfidf is None:
        return jsonify({"error": "Sistem sedang memuat data", "products": []}), 503

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
            if score > 0.05: # Threshold kecil agar hasil lebih banyak muncul
                item = df.iloc[i].to_dict()
                item = {k: (v if pd.notna(v) else "") for k, v in item.items()}
                item['score'] = f"{int(score * 100)}%" 
                recommendations.append(item)

        return jsonify({
            "insight": generate_smart_advice(user_query),
            "products": recommendations
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product_detail(product_id):
    if df.empty:
        return jsonify({"error": "Data belum siap"}), 503

    try:
        # PENCARIAN ID (Dipastikan integer vs integer)
        product = df[df['ID'] == product_id]
        
        if product.empty:
            print(f"🔍 DEBUG: Mencari ID {product_id} tapi tidak ketemu.")
            return jsonify({"error": f"Produk dengan ID {product_id} tidak ditemukan"}), 404
        
        item = product.iloc[0].to_dict()
        # Bersihkan data NaN
        item = {k: (v if pd.notna(v) else "") for k, v in item.items()}
        
        return jsonify(item)
    except Exception as e:
        print(f"❌ ERROR Detail: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)