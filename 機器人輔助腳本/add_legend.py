import os

filepath = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"

with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 替換 CSS
old_css = """        .timeline-left-panel {
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
        }"""

new_css = """        .timeline-left-panel {
            flex: 0 0 30%;
            padding-right: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 15px;
        }
        
        .timeline-left-panel img {
            width: 100%;
            border-radius: 16px;
            border: 4px solid #fff;
            box-shadow: 0 8px 25px rgba(255, 159, 67, 0.15);
            background-color: #fffbf0;
            transition: all 0.3s ease;
        }

        .stage-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 15px;
            font-weight: 800;
            background: rgba(255, 255, 255, 0.6);
            padding: 8px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 2px solid #fff;
        }

        .stage-legend span {
            cursor: pointer;
            transition: transform 0.2s ease, filter 0.2s ease;
            cursor: default;
        }
        
        .stage-legend span:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
        }"""

# Fallback string matching if exact match fails due to whitespace
if old_css not in html:
    # Just insert it before `<style>` ends
    new_css_to_insert = """
        .stage-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 15px;
            font-weight: 800;
            background: rgba(255, 255, 255, 0.6);
            padding: 8px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 2px solid #fff;
        }
        .stage-legend span {
            cursor: default;
            transition: transform 0.2s ease, filter 0.2s ease;
        }
        .stage-legend span:hover {
            transform: scale(1.1);
            filter: brightness(1.1);
        }
"""
    html = html.replace('</style>', new_css_to_insert + '\n    </style>')
    html = html.replace('align-items: center;\n        }\n        \n        .timeline-left-panel img', 'align-items: center;\n            flex-direction: column;\n            gap: 15px;\n        }\n        \n        .timeline-left-panel img')
else:
    html = html.replace(old_css, new_css)


# 2. 插入第一階段的註解 (Legend)
target_html = """<img id="stage-1-img" src="/images/組隊副本/第一次同行第一階段.png" onerror="this.src='https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&font=Oswald'">
            </div>"""

legend_html = """<img id="stage-1-img" src="/images/組隊副本/第一次同行第一階段.png" onerror="this.src='https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&font=Oswald'">
                <div class="stage-legend">
                    <span style="color: #ff9f43;" onmouseover="setHoverImg('/images/組隊副本/第一次同行第一階段.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">第一階段</span>
                    <span style="color: #95a5a6;">|</span>
                    <span style="color: #27ae60;" onmouseover="setHoverImg('/images/組隊副本/第一次同行克魯特NPC.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">克魯特NPC</span>
                    <span style="color: #95a5a6;">|</span>
                    <span style="color: #b51cdbff;" onmouseover="setHoverImg('/images/組隊副本/第一次同行鱷魚.png', 'stage-1-img')" onmouseout="resetHoverImg('stage-1-img')">鱷魚</span>
                </div>
            </div>"""

html = html.replace(target_html, legend_html)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(html)
    
print("Updated successfully!")
