import pandas as pd
import os
from PIL import Image, ImageDraw, ImageColor
import random

# --- KONFIGURASI ---
# Pastikan path ini benar sesuai struktur foldermu
DATA_PATH = os.path.join('data', 'dataset_gordyn.csv') 
OUTPUT_DIR = os.path.join('generated_images_v2') # Folder output baru

# Mapping Warna Text ke Kode HEX
COLOR_MAP = {
    'white': '#F8F8FF',      # GhostWhite
    'putih': '#F8F8FF',
    'krem': '#FFFDD0',       # Cream
    'cream': '#FFFDD0',
    'beige': '#F5F5DC',
    'ivory': '#FFFFF0',
    'gray': '#A9A9A9',       # DarkGray
    'grey': '#A9A9A9',
    'abu': '#A9A9A9',
    'silver': '#C0C0C0',     # Silver
    'perak': '#C0C0C0',
    'gold': '#DAA520',       # Goldenrod (lebih realistis daripada kuning murni)
    'emas': '#DAA520',
    'brown': '#8B4513',      # SaddleBrown
    'cokelat': '#8B4513',
    'coffee': '#6F4E37',
    'black': '#2F4F4F',      # DarkSlateGray (Hitam pekat jelek digambar)
    'hitam': '#2F4F4F',
    'charcoal': '#36454F',
    'blue': '#4682B4',       # SteelBlue
    'biru': '#4682B4',
    'navy': '#000080',
    'turquoise': '#40E0D0',
    'turkis': '#40E0D0',
    'green': '#556B2F',      # DarkOliveGreen
    'hijau': '#556B2F',
    'red': '#B22222',        # FireBrick
    'merah': '#B22222',
    'rust': '#A0522D',       # Sienna
    'peach': '#FFDAB9',
    'salem': '#FFDAB9',
    'lavender': '#E6E6FA',
    'pink': '#FFB6C1',
}

def adjust_brightness(hex_color, factor):
    """Mencerahkan atau menggelapkan warna untuk efek bayangan lipatan"""
    rgb = ImageColor.getrgb(hex_color)
    new_rgb = tuple(min(255, max(0, int(c * factor))) for c in rgb)
    return f"#{new_rgb[0]:02x}{new_rgb[1]:02x}{new_rgb[2]:02x}"

def create_curtain_graphic(product_id, color_name, material_type):
    width, height = 600, 800 # Bentuk portrait agar seperti jendela
    
    # 1. Tentukan Warna Dasar
    base_hex = '#D3D3D3' # Default LightGray
    color_name_lower = str(color_name).lower()
    for key, hex_code in COLOR_MAP.items():
        if key in color_name_lower:
            base_hex = hex_code
            break

    # Tentukan intensitas lipatan berdasarkan bahan
    fold_intensity = 0.85 # Default
    num_folds = 12
    if 'vittrace' in str(material_type).lower():
        fold_intensity = 0.92 # Bahan tipis, lipatan halus
        num_folds = 18 # Lebih banyak lipatan kecil
        base_hex = adjust_brightness(base_hex, 1.1) # Lebih terang/transparan
    elif 'blackout' in str(material_type).lower():
        fold_intensity = 0.75 # Bahan tebal, lipatan tajam/gelap
        num_folds = 8 # Lipatan besar

    img = Image.new('RGB', (width, height), color=base_hex)
    draw = ImageDraw.Draw(img)

    # 2. Gambar Efek Lipatan Vertikal (Simulasi Gorden)
    fold_width = width // num_folds
    
    for i in range(num_folds):
        # Warna selang-seling: Terang - Gelap - Terang - Gelap
        if i % 2 == 0:
            # Bagian yang menonjol kena cahaya (sedikit lebih terang)
            stripe_color = adjust_brightness(base_hex, 1.05)
        else:
            # Bagian lipatan dalam (bayangan, lebih gelap)
            stripe_color = adjust_brightness(base_hex, fold_intensity)
            
        start_x = i * fold_width
        end_x = start_x + fold_width
        
        # Gambar persegi panjang vertikal dari atas ke bawah
        draw.rectangle([(start_x, 0), (end_x, height)], fill=stripe_color)

    # 3. Tambahkan sedikit efek "lantai" dan "dinding" di background
    # (Ini trik sederhana menimpa bagian atas dan bawah)
    wall_color = "#F0F0F0" # Putih tembok
    floor_color = "#DEB887" # Warna kayu lantai
    
    # Dinding atas (sedikit)
    draw.rectangle([(0, 0), (width, 50)], fill=wall_color)
    # Lantai bawah
    draw.rectangle([(0, height-100), (width, height)], fill=floor_color)

    # 4. Simpan Gambar
    filename = f"{product_id}.jpg"
    img.save(os.path.join(OUTPUT_DIR, filename), quality=85)
    print(f"✨ Generated Graphic: {filename} ({color_name} - {material_type})")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # Pastikan file ini dijalankan dari folder 'backend' agar path data benar
    if not os.path.exists(DATA_PATH):
         print(f"❌ Error: File data tidak ditemukan di: {DATA_PATH}")
         print("   Pastikan Anda menjalankan terminal di dalam folder 'backend'")
         return

    try:
        df = pd.read_csv(DATA_PATH)
        print(f"🎨 Memulai pembuatan {len(df)} grafis gorden...")
        
        for index, row in df.iterrows():
            create_curtain_graphic(
                product_id=row['ID'], 
                color_name=row['Warna'],
                material_type=row['Bahan']
            )
            
        print("="*50)
        print(f"🎉 SUKSES! {len(df)} gambar grafis gorden telah dibuat di folder '{OUTPUT_DIR}'")
        print(f"👉 Hapus gambar lama di 'frontend/public/images/'")
        print(f"👉 Pindahkan semua file baru dari '{OUTPUT_DIR}' ke folder tersebut.")
        print("="*50)

    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()