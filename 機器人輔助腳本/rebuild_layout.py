import re
import os

filepath = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 修復 <style> 內容，將 .dungeon-timeline-full 相關的 CSS 改為 30/70 比例
style_patterns = {
    r"\.dungeon-timeline-full::before {[\s\S]*?left: 17px;.*\n": r".dungeon-timeline-full::before {\n            content: '';\n            position: absolute;\n            top: 20px;\n            bottom: 20px;\n            left: 30%;\n            transform: translateX(-50%);\n",
    r"\.timeline-row {[\s\S]*?padding-left: 55px;.*\n": r".timeline-row {\n            position: relative;\n            z-index: 2;\n            padding-left: 0;\n",
    r"\.timeline-marker {[\s\S]*?left: 0;\n\s*top: 50%;\n\s*transform: translateY\(-50%\);": r".timeline-marker {\n            width: 36px;\n            height: 36px;\n            background-color: #ffffff;\n            border: 6px solid #f39c12;\n            border-radius: 50%;\n            position: absolute;\n            left: 30%;\n            top: 50%;\n            transform: translate(-50%, -50%);"
}

for p, repl in style_patterns.items():
    html = re.sub(p, repl, html, count=1)

# 也需要加上 .timeline-left-panel 屬性
if ".timeline-left-panel" not in html:
    html = html.replace(".dungeon-flag-wrapper {", """
        .timeline-left-panel {
            flex: 0 0 30%;
            padding-right: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .timeline-left-panel img {
            width: 100%;
            border-radius: 16px;
            border: 4px solid #fff;
            box-shadow: 0 8px 25px rgba(255, 159, 67, 0.15);
            background-color: #fffbf0;
            transition: all 0.3s ease;
        }

        .dungeon-flag-wrapper {""")

# dungeon-flag-wrapper 原本是 flex: 1，現在改成 flex: 0 0 70% 加上 padding-left: 20px
html = re.sub(r"\.dungeon-flag-wrapper \{\s*flex: 1;", r".dungeon-flag-wrapper {\n            flex: 0 0 70%;\n            padding-left: 20px;", html)
# 把 timeline-row.active marker 動畫加上
html = html.replace("transform: translateY(-50%) scale(1.2);", "transform: translate(-50%, -50%) scale(1.2);")

# 2. 移除我先前加的 Sticky Wrapper
# <div style="display: flex; gap: 40px; align-items: flex-start; margin-top: 30px;">
# 到 <ul class="dungeon-timeline-full">
wrapper_start = r'<div style="display: flex; gap: 40px; align-items: flex-start; margin-top: 30px;">[\s\S]*?<ul class="dungeon-timeline-full">'
html = re.sub(wrapper_start, '<ul class="dungeon-timeline-full">', html)

# 底部的 </ul>\n</div>\n</div> 也要改回 </ul>
html = html.replace('            </ul>\n        </div>\n    </div>', '    </ul>')

# 3. 將各個 <li> 結構改掉
stages = {
    'stage-1': '第一階段',
    'stage-2': '第二階段',
    'stage-3': '第三階段',
    'stage-4': '第四階段',
    'stage-5': '最後階段'
}
for stage_id, stage_name in stages.items():
    search_str = f'<li class="timeline-row active" id="{stage_id}">\n            <div class="timeline-marker"></div>\n            <div class="dungeon-flag-wrapper">'
    if search_str not in html:
        search_str = search_str.replace(' active"', '"')
    
    img_name = f'第一次同行{stage_name}'
    replace_str = f"""<li class="timeline-row{' active' if stage_id=='stage-1' else ''}" id="{stage_id}">
            <div class="timeline-left-panel">
                <img id="{stage_id}-img" src="/images/組隊副本/{img_name}.png" onerror="this.src='https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&font=Oswald'">
            </div>
            <div class="timeline-marker"></div>
            <div class="dungeon-flag-wrapper">"""
            
    html = html.replace(search_str, replace_str)


# 4. 更新 Hover Script & HTML triggers
# 第一階段的 Hover triggers 改用 'stage-1-img'
html = html.replace("setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png')", "setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png', 'stage-1-img')")
html = html.replace("setHoverImg('/images/組隊副本/第一次同行鱷魚.png')", "setHoverImg('/images/組隊副本/第一次同行鱷魚.png', 'stage-1-img')")
html = html.replace("resetHoverImg()", "resetHoverImg('stage-1-img')")

# javascript code replacement
script_search = """<script>
let currentStageImgSrc = '/images/組隊副本/第一次同行第一階段.png';
const previewImg = document.getElementById('stage-preview-img');

function updatePreviewImg(src) {
    if(previewImg && previewImg.src !== new URL(src, window.location.href).href) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
            previewImg.src = src;
            previewImg.style.opacity = '1';
        }, 150);
    }
}

function setHoverImg(src) {
    if(previewImg) {
        previewImg.src = src;
        previewImg.style.opacity = '1';
    }
}

function resetHoverImg() {
    if(previewImg) {
        previewImg.src = currentStageImgSrc;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.timeline-row');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 當內容進入畫面中央時觸發點亮
            if (entry.isIntersecting) {
                rows.forEach(r => r.classList.remove('active'));
                entry.target.classList.add('active');
                
                // 更換左側階段對應圖片
                const stageId = entry.target.id;
                let stageName = "第一階段";
                if(stageId === 'stage-2') stageName = "第二階段";
                if(stageId === 'stage-3') stageName = "第三階段";
                if(stageId === 'stage-4') stageName = "第四階段";
                if(stageId === 'stage-5') stageName = "第五階段";
                
                currentStageImgSrc = `/images/組隊副本/第一次同行${stageName}.png`;
                updatePreviewImg(currentStageImgSrc);
            }
        });
    }, {
        root: null,
        // -40% 確保滾到畫面中間才會被視為 "正在閱讀此段落"
        rootMargin: '-40% 0px -40% 0px', 
        threshold: 0
    });

    rows.forEach(row => observer.observe(row));
});
</script>"""

new_script = """<script>
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
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.timeline-row');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                rows.forEach(r => r.classList.remove('active'));
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px', 
        threshold: 0
    });

    rows.forEach(row => observer.observe(row));
});
</script>"""

html = html.replace(script_search, new_script)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Done!")
