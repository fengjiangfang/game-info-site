import os
import shutil

images_dir = r"d:\00\FJ\官方程式\game-info-site\src\images\組隊副本"
dungeon_dir = os.path.join(images_dir, "第一次同行")

if not os.path.exists(dungeon_dir):
    os.makedirs(dungeon_dir)

file_map = {
    "第一次同行克魯特NPC.png": "克魯特NPC.png",
    "第一次同行入場NPC.png": "入場NPC.png",
    "第一次同行第一階段.png": "第一階段.png",
    "第一次同行第二階段.png": "第二階段.png",
    "第一次同行第三階段.png": "第三階段.png",
    "第一次同行第四階段.png": "第四階段.png",
    "第一次同行第五階段.png": "第五階段.png",
    "第一次同行鱷魚.png": "鱷魚.png",
    "第一次同行最後階段.png": "最後階段.png" # 補上第五階段可能使用最後階段名稱的圖片
}

for old_name, new_name in file_map.items():
    old_path = os.path.join(images_dir, old_name)
    new_path = os.path.join(dungeon_dir, new_name)
    if os.path.exists(old_path):
        print(f"Moving {old_name} -> 第一次同行/{new_name}")
        shutil.move(old_path, new_path)

# 更新 code
njk_file = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"
with open(njk_file, 'r', encoding='utf-8') as f:
    html = f.read()

for old_name, new_name in file_map.items():
    html = html.replace(f"/images/組隊副本/{old_name}", f"/images/組隊副本/第一次同行/{new_name}")

with open(njk_file, 'w', encoding='utf-8') as f:
    f.write(html)

print("Cleanup and code update completed!")
