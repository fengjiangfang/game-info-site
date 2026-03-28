import re

filepath = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 移除目前寫死的多重圖例 (stage 1 獨有)
old_legend = """                <div class="stage-legend">
                    <span style="color: #ff9f43;" onmouseover="setHoverImg('/images/組隊副本/第一次同行第一階段.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">第一階段</span>
                    <span style="color: #95a5a6;">|</span>
                    <span style="color: #27ae60;" onmouseover="setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">克魯特NPC</span>
                    <span style="color: #95a5a6;">|</span>
                    <span style="color: #b51cdbff;" onmouseover="setHoverImg('/images/組隊副本/第一次同行鱷魚.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">鱷魚</span>
                </div>"""

# 我們將把所有階段都加上單一的動態 caption
html = html.replace(old_legend, "")

stages = {
    'stage-1': '第一階段',
    'stage-2': '第二階段',
    'stage-3': '第三階段',
    'stage-4': '第四階段',
    'stage-5': '最後階段'
}

for stage_id, stage_name in stages.items():
    # 尋找 img 標籤結尾
    img_tag = f'id="{stage_id}-img"'
    
    # 為了避免重複添加，先找出該 img
    pattern = rf'(<img id="{stage_id}-img" src="[^"]+" onerror="[^"]+">)'
    
    new_caption = f'\\1\n                <div class="stage-legend" style="justify-content: center;">\n                    <span id="{stage_id}-img-caption" style="color: #ff9f43; font-size: 16px; transition: opacity 0.15s ease-in-out;">{stage_name}</span>\n                </div>'
    
    # 先確保沒有舊的 stage-legend 緊跟在後面
    html = re.sub(pattern + r'\s*<div class="stage-legend".*?</div>', '', html, flags=re.DOTALL)
    # 然後添加新的
    html = re.sub(pattern, new_caption, html)

# 2. 更新第一階段內的 hover calls
html = html.replace("setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png', 'stage-1-img')", "setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png', 'stage-1-img', '克魯特NPC', '#27ae60')")
html = html.replace("setHoverImg('/images/組隊副本/第一次同行鱷魚.png', 'stage-1-img')", "setHoverImg('/images/組隊副本/第一次同行鱷魚.png', 'stage-1-img', '鱷魚', '#b51cdbff')")


# 3. 更新 script
script_search = """<script>
function setHoverImg(src, imgId) {
    const img = document.getElementById(imgId);
    if(img) {
        if(!img.dataset.defaultSrc) {
            img.dataset.defaultSrc = img.getAttribute('src');
        }
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = src;
            img.style.opacity = '1';
        }, 150);
    }
}

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    if(img && img.dataset.defaultSrc) {
        img.style.opacity = '0';
        setTimeout(() => {
            img.src = img.dataset.defaultSrc;
            img.style.opacity = '1';
        }, 150);
    }
}"""

new_script = """<script>
function setHoverImg(src, imgId, captionText, captionColor) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if(img) {
        if(!img.dataset.defaultSrc) {
            img.dataset.defaultSrc = img.getAttribute('src');
            if(caption) {
                caption.dataset.defaultText = caption.innerText;
                caption.dataset.defaultColor = caption.style.color;
            }
        }
        img.style.opacity = '0';
        if(caption) caption.style.opacity = '0';
        setTimeout(() => {
            img.src = src;
            img.style.opacity = '1';
            if(caption && captionText) {
                caption.innerText = captionText;
                caption.style.color = captionColor || '#ff9f43';
                caption.style.opacity = '1';
            }
        }, 150);
    }
}

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if(img && img.dataset.defaultSrc) {
        img.style.opacity = '0';
        if(caption) caption.style.opacity = '0';
        setTimeout(() => {
            img.src = img.dataset.defaultSrc;
            img.style.opacity = '1';
            if(caption && caption.dataset.defaultText) {
                caption.innerText = caption.dataset.defaultText;
                caption.style.color = caption.dataset.defaultColor;
                caption.style.opacity = '1';
            }
        }, 150);
    }
}"""

html = html.replace(script_search, new_script)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated dynamically!")
