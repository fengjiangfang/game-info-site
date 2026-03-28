import re

filepath = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

parts = html.split('<li class="timeline-row')

for i in range(1, len(parts)):
    match = re.search(r'^.*?id="(stage-\d+)"', parts[i], re.DOTALL)
    if match:
        stage_id = match.group(1)
        # 替換掉複製貼上來的 hover JS 引數，指向該階段專屬的圖片 ID
        parts[i] = parts[i].replace("'stage-1-img'", f"'{stage_id}-img'")

html = '<li class="timeline-row'.join(parts)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Updated successfully!")
