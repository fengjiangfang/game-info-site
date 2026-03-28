import os

# 目錄與檔案路徑
src_file = r"d:\00\FJ\官方程式\game-info-site\src\style.css"
css_dir = r"d:\00\FJ\官方程式\game-info-site\src\css"
os.makedirs(css_dir, exist_ok=True)

with open(src_file, 'r', encoding='utf-8') as f:
    full_css = f.read()

# 定位切點
idx_sidebar = full_css.find("/* ========================================================= */\n/* 左側選單樣式 (Dark Mode)")
idx_main_end = full_css.find("/* Banner 橫幅")
idx_responsive = full_css.find("/* Responsive */")
idx_settings = full_css.find("/* ========================================================= */\n/* 基礎設定 - 單欄條款列表樣式 (Settings List)")
idx_dungeon = full_css.find("/* ================= 副本進度條與總覽 ================= */")
idx_hero = full_css.find("/* ========================================================= */\n/* 共用大型標題卡片與內容版型 (Rule Card Hero)")

if idx_sidebar == -1 or idx_main_end == -1 or idx_responsive == -1 or idx_settings == -1 or idx_dungeon == -1:
    print("Error: Could not find one or more split markers!")
    exit(1)

# 分割為四個部分
# 1. variables: 頂部 CSS
css_variables = full_css[:idx_sidebar]

# 2. layout: sidebar、main-content、responsive
css_layout = full_css[idx_sidebar:idx_main_end] + "\n" + full_css[idx_responsive:idx_settings]

# 3. components: banner、各式卡片、基礎設定
if idx_hero != -1:
    css_components = full_css[idx_main_end:idx_responsive] + "\n" + full_css[idx_settings:idx_dungeon] + "\n" + full_css[idx_hero:]
    css_dungeons = full_css[idx_dungeon:idx_hero]
else:
    css_components = full_css[idx_main_end:idx_responsive] + "\n" + full_css[idx_settings:idx_dungeon]
    css_dungeons = full_css[idx_dungeon:]

# 存檔
with open(os.path.join(css_dir, "variables.css"), "w", encoding="utf-8") as f:
    f.write(css_variables)
with open(os.path.join(css_dir, "layout.css"), "w", encoding="utf-8") as f:
    f.write(css_layout)
with open(os.path.join(css_dir, "components.css"), "w", encoding="utf-8") as f:
    f.write(css_components)
with open(os.path.join(css_dir, "dungeons.css"), "w", encoding="utf-8") as f:
    f.write(css_dungeons)

# 將原始 style.css 壓縮為 導入
new_style_content = """/* ========================================================= */
/* 主樣式入口點 (style.css) 分為數個模組                                */
/* ========================================================= */
@import url('./css/variables.css');
@import url('./css/layout.css');
@import url('./css/components.css');
@import url('./css/dungeons.css');
"""

with open(src_file, "w", encoding="utf-8") as f:
    f.write(new_style_content)

print(f"Split success! style.css is now only {len(new_style_content.splitlines())} lines.")
