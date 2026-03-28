import os
import glob

# 目錄
src_dir = r"d:\00\FJ\官方程式\game-info-site\src"
patterns = [
    os.path.join(src_dir, "*.njk"),
    os.path.join(src_dir, "組隊副本", "*.njk"),
    os.path.join(src_dir, "主題副本", "*.njk")
]

# 替換清單: (要替換的舊字串, 新的 CSS 類別字串)
REPLACEMENTS = [
    # 大型標題卡片外框
    (
        'style="padding: 24px; background: linear-gradient(135deg, #ff9f43, #feca57); border: 2px solid #ffb142; align-items: center; justify-content: center; grid-column: span 3; box-shadow: 0 6px 20px rgba(255, 159, 67, 0.4);"',
        'class="rule-card-hero"'
    ),
    # 大型標題卡片文字
    (
        'style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 4px; text-shadow: 0 0 15px rgba(255, 200, 100, 0.8); margin-bottom: 0;"',
        'class="rule-card-hero-title"'
    ),
    (
        'style="font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: 4px; text-shadow: 0 0 15px rgba(255, 200, 100, 0.8); margin-bottom: 0; text-align: center;"',
        'class="rule-card-hero-title"'
    ),
    # 邊框黃線卡片
    (
        'style="border: 2px solid #ffeaa7;"',
        'class="rule-card-bordered"'
    ),
    # 數據小卡片外框 (通常含有 padding 16px 與 border 等)
    (
        'style="padding: 16px; border: 2px solid #ffeaa7; align-items: center; justify-content: center;"',
        'class="rule-card-bordered rule-card-stat"'
    ),
    # 數據小卡片標題
    (
        'style="font-size: 14px; font-weight: 700; color: #7f8c8d; margin-bottom: 6px;"',
        'class="stat-label"'
    ),
    # 數據小卡片數值 (藍色)
    (
        'style="font-size: 16px; font-weight: 900; color: #3498db;"',
        'class="stat-value"'
    ),
    # 數據小卡片數值 (橘色)
    (
        'style="font-size: 16px; font-weight: 900; color: #e67e22;"',
        'class="stat-value-orange"'
    ),
    # 副本總覽時間軸外框
    (
        'style="margin-bottom: 25px; gap: 15px;"',
        'class="timeline-dungeon-box"'
    ),
    # 副本總覽時間軸文字框
    (
        'style="font-size: 20px; font-weight: 700; color: #2d3436; display: flex; align-items: center; gap: 8px;"',
        'class="timeline-dungeon-title"'
    ),
    # 副本總覽時間軸 Lv 顯示
    (
        'style="color: #ff7675; font-size: 17px; font-weight: 900; letter-spacing: 1px; flex: 0 0 52px;"',
        'class="timeline-dungeon-lvl"'
    ),
    # 首頁 preview 圖片樣式
    (
        'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1); transform: translateY(0%);"',
        ''
    )
]

changed_files = 0
for pattern in patterns:
    for filepath in glob.glob(pattern):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original_content = content
            
            # 因為 HTML 屬性的引號、空白問題，我們直接字串全等替換
            for old_str, new_str in REPLACEMENTS:
                if old_str in content:
                    # 如果原標籤已有 class，可能需要特別處理：
                    # 但這裡舊字串通常是獨立的 style="xxx"
                    # 此處簡單做法：如果有 class="xxx"，取代後會變成 class="xxx" class="yyy"
                    # 瀏覽器其實只吃第一個，所以在 HTML 中，我們需用正規或字串處理
                    # 但因為這幾個 Nunjucks 範本大部分是 `class="rule-card" style="..."`
                    # 我們可以寫:
                    content = content.replace(f' {old_str}', f' {new_str}')
                    content = content.replace(f'{old_str}', f'{new_str}')
            
            # 合併重複的 class (例如 class="rule-card" class="rule-card-hero")
            # a bit hacky but works for template refactoring
            if 'class="rule-card" class="rule-card-hero"' in content:
                content = content.replace('class="rule-card" class="rule-card-hero"', 'class="rule-card rule-card-hero"')
            if 'class="rule-card" class="rule-card-bordered"' in content:
                content = content.replace('class="rule-card" class="rule-card-bordered"', 'class="rule-card rule-card-bordered"')
            if 'class="rule-card" class="rule-card-bordered rule-card-stat"' in content:
                content = content.replace('class="rule-card" class="rule-card-bordered rule-card-stat"', 'class="rule-card rule-card-bordered rule-card-stat"')
            if 'class="timeline-item active" class="timeline-dungeon-box"' in content:
                content = content.replace('class="timeline-item active" class="timeline-dungeon-box"', 'class="timeline-item timeline-dungeon-box active"')
            if 'class="timeline-item" class="timeline-dungeon-box"' in content:
                content = content.replace('class="timeline-item" class="timeline-dungeon-box"', 'class="timeline-item timeline-dungeon-box"')

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {filepath}")
                changed_files += 1
                
        except Exception as e:
            print(f"Error reading {filepath}: {e}")

print(f"Refactor complete! Changed {changed_files} files.")
