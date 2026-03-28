import re

source_path = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\第一次同行.njk"
target_path = r"d:\00\FJ\官方程式\game-info-site\src\組隊副本\時空的裂縫.njk"

with open(source_path, 'r', encoding='utf-8') as f:
    source_html = f.read()

# Extract styles and scripts
style_match = re.search(r'<style>.*?</style>', source_html, re.DOTALL)
script_match = re.search(r'<script>.*?</script>', source_html, re.DOTALL)

style_content = style_match.group(0) if style_match else ""
script_content = script_match.group(0) if script_match else ""

# Data for Ludi PQ
stages = [
    {
        "num": "第一階段",
        "title": "玩偶之家",
        "rules": [
            "清理地圖上的怪物，蒐集 25 張通行證，交由隊長點擊 NPC 後即可通關。",
            '<span style="color: #c0392b; font-weight: bold;">💡 小提醒：</span> 注意圖中最上方左下的平台，通常會漏撿通行證。'
        ]
    },
    {
        "num": "第二階段",
        "title": "遺棄之塔&lt;第2階段&gt;",
        "rules": [
            "待通關傳送門開啟，先由一位或兩位玩家進入。",
            "待該玩家打掉「第二個箱子」，傳送至隱藏傳點後，該隊員會於隊伍頻道告知隊友 OK，這時所有人再通過傳送門進入。",
            "打箱子蒐集所有通行證（15 張）後交由隊長點擊 NPC 即可通關。"
        ]
    },
    {
        "num": "第三階段",
        "title": "遺棄之塔&lt;第3階段&gt;",
        "rules": [
            "清理地圖上的箱子及怪物，蒐集 32 張通行證，交由隊長點擊 NPC 後即可通關。"
        ]
    },
    {
        "num": "第四階段",
        "title": "遺棄之塔&lt;第4階段&gt;",
        "rules": [
            "進入地圖中五個洞口，將裡面怪物擊倒，取得共 6 張通行證，交由隊長點擊 NPC 後即可通關。",
            '<span style="color: #c0392b; font-weight: bold;">💡 洞口分工：</span> 地圖中上三個洞口適合<strong>法師</strong>職業，下兩個適合<strong>物攻</strong>職業。',
            "下面第一個洞口有兩隻怪物。"
        ]
    },
    {
        "num": "第五階段",
        "title": "遺棄之塔&lt;第5階段&gt;",
        "rules": [
            "進入洞口蒐集通行證，每洞有 4 張，共 24 張通行證，交由隊長點擊 NPC 後即可通關。",
            '<span style="color: #c0392b; font-weight: bold;">💡 職業限制：</span> 最上方洞只有<strong>法師</strong>的瞬移可打箱子。',
            '<span style="color: #c0392b; font-weight: bold;">💡 職業限制：</span> 最下方因有極高傷害怪物，需<strong>盜賊</strong>使用隱身術進入蒐集。'
        ]
    },
    {
        "num": "第六階段",
        "title": "遺棄之塔&lt;第6階段&gt;",
        "rules": [
            "跳法順序為：<strong style=\"color:#e74c3c; font-size: 18px;\">133 221 333 123 111</strong>",
            "跳至頂端由隊長點擊 NPC 即可通關。"
        ]
    },
    {
        "num": "第七階段",
        "title": "遺棄之塔&lt;第7階段&gt;",
        "rules": [
            "爬上頂端後，右方有三隻怪物，需<strong style=\"color:#ff9f43;\">遠攻職業</strong>擊倒怪物，怪物所掉落的通行證將會開啟箱子。",
            "開啟箱子後，下方會出現三隻泥人領導者。",
            "打倒後蒐集共 3 張通行證，交由隊長點擊 NPC 後即可過關。"
        ]
    },
    {
        "num": "第八階段",
        "title": "遺棄之塔&lt;第8階段&gt;",
        "rules": [
            "地圖上有九個平台，需有 <strong>五名玩家</strong> 分別站在不同的平台上。",
            "由隊長點擊 NPC 確認目前站位組合是否正確。",
            '<span style="color: #c0392b; font-weight: bold;">💡 小提醒：</span> 跳法普遍有兩種：一種橫著跳，一種直著跳。請與隊員商量好要使用哪種方式。'
        ]
    },
    {
        "num": "第九階段",
        "title": "時空的裂縫",
        "rules": [
            "打倒地圖上的怪物，掉落通行證開啟箱子，將會召喚出最終王。",
            "徹底擊倒王後，蒐集掉落的鑰匙交由隊長點擊 NPC 即可通關！"
        ]
    }
]

html_parts = []
html_parts.append("""---
layout: layout.njk
title: 時空的裂縫
---
<!-- 頂部大橫幅 -->
<div class="forum-banner">
    <div class="forum-banner-content">
        <h1>時空的裂縫</h1>
    </div>
</div>

<div class="forum-main-card" style="background-color: #fff4e6; padding: 40px;">
    
    <!-- 基本資訊區段 (左表右圖) -->
    <div style="display: flex; gap: 30px; margin-bottom: 50px; align-items: stretch;">
        <!-- 左側 70% 資訊列 -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 15px;">
            <div class="setting-row" style="margin: 0; flex: 1;">
                <div class="setting-row-left">
                    <div class="setting-row-icon" style="background-color: #ff9f43; color: white;"><i class="fa-solid fa-ranking-star"></i></div>
                    <div class="setting-row-label">副本等級限制</div>
                </div>
                <div class="setting-row-value" style="font-size: 20px; color: #2c3e50;">３５等</div>
            </div>
            <div class="setting-row" style="margin: 0; flex: 1;">
                <div class="setting-row-left">
                    <div class="setting-row-icon" style="background-color: #feca57; color: white;"><i class="fa-solid fa-users"></i></div>
                    <div class="setting-row-label">副本人數限制</div>
                </div>
                <div class="setting-row-value" style="font-size: 20px; color: #2c3e50;">５～６人</div>
            </div>
            <div class="setting-row" style="margin: 0; flex: 1;">
                <div class="setting-row-left">
                    <div class="setting-row-icon" style="background-color: #00b894; color: white;"><i class="fa-solid fa-arrow-up-right-dots"></i></div>
                    <div class="setting-row-label">副本總經驗值</div>
                </div>
                <div class="setting-row-value" style="font-size: 20px; color: #2c3e50;">７２２００點</div>
            </div>
            <div class="setting-row" style="margin: 0; flex: 1;">
                <div class="setting-row-left">
                    <div class="setting-row-icon" style="background-color: #e84393; color: white;"><i class="fa-solid fa-gift"></i></div>
                    <div class="setting-row-label">副本通關獎勵</div>
                </div>
                <div class="setting-row-value" style="font-size: 20px; color: #e74c3c;">組隊硬幣 1 個</div>
            </div>
        </div>

        <!-- 右側 30% NPC 圖片 -->
        <div style="flex: 0 0 30%; background-color: #fffbf0; border-radius: 20px; border: 4px solid #fff; box-shadow: 0 8px 25px rgba(255, 159, 67, 0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; padding: 20px 20px 15px 20px;">
            <div style="flex: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transform: translateY(-10px);">
                <img src="/images/組隊副本/時空的裂縫/入場NPC.png" style="width: 100%; height: 100%; object-fit: contain; border-radius: 16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" alt="入場NPC">
            </div>
            <div style="margin-top: 5px; font-weight: 900; color: #e67e22; font-size: 14px; text-align: center; letter-spacing: 1px; background: rgba(255, 159, 67, 0.1); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255, 159, 67, 0.3); width: 95%;">
                <i class="fa-solid fa-map-location-dot" style="margin-right: 4px;"></i> 入場地圖－玩具城:案奧斯塔101樓
            </div>
        </div>
    </div>

    <!-- 直立式全展開內容區 -->
""")

html_parts.append(style_content)

html_parts.append('\n    <ul class="dungeon-timeline-full">\n')

for i, stage in enumerate(stages):
    stage_idx = i + 1
    rules_html = "".join([f"                            <li>{r}</li>\n" for r in stage['rules']])
    
    html_parts.append(f"""
        <!-- {stage['num']} -->
        <li class="timeline-row">
            <div class="timeline-marker"></div>
            
            <!-- 左側靜態圖片 -->
            <div class="timeline-left-panel">
                <div style="position: relative; width: 100%;">
                    <img src="/images/組隊副本/時空的裂縫/{stage_idx}.png" id="stage-{stage_idx}-img" alt="{stage['num']}">
                </div>
            </div>
            
            <!-- 右側階段說明卡片 -->
            <div class="dungeon-flag-wrapper">
                <div class="dungeon-flag-large">
                    <div class="stage-color-bar">
                        <h3 class="stage-header">
                            <span class="stage-badge">{stage['num']}</span>
                            <span class="stage-title">{stage['title']}</span>
                        </h3>
                        <ul class="rule-list">
{rules_html}                        </ul>
                    </div>
                </div>
            </div>
        </li>
""")

html_parts.append("""    </ul>
    
    <!-- 底部導覽按鈕區 -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px; margin-bottom: 20px;">
        
        <!-- 左側：上一關 -->
        <div style="flex: 1; display: flex; justify-content: flex-start;">
            <a href="/組隊副本/第一次同行/" style="display: inline-block; padding: 12px 25px; background: white; color: #ff9f43; border: 2px solid #ff9f43; font-weight: 900; font-size: 16px; border-radius: 30px; text-decoration: none; box-shadow: 0 4px 10px rgba(255, 159, 67, 0.1); transition: all 0.2s ease;" onmouseover="this.style.background='#ff9f43'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='white'; this.style.color='#ff9f43'; this.style.transform='scale(1)';"><i class="fa-solid fa-arrow-left"></i> 第一次同行</a>
        </div>

        <!-- 中間：返回總覽 -->
        <div style="position: relative; display: inline-flex; align-items: center; justify-content: center;">
            <a href="/組隊副本/" style="display: inline-block; padding: 12px 35px; background: linear-gradient(135deg, #ff9f43, #feca57); color: white; font-weight: 900; font-size: 16px; border-radius: 30px; text-decoration: none; box-shadow: 0 4px 15px rgba(255, 159, 67, 0.4); transition: transform 0.2s ease, filter 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'; this.style.filter='brightness(1.1)';" onmouseout="this.style.transform='scale(1)'; this.style.filter='brightness(1)';">返回組隊副本總覽</a>
        </div>

        <!-- 右側：下一關 -->
        <div style="flex: 1; display: flex; justify-content: flex-end;">
            <a href="/組隊副本/毒霧森林/" style="display: inline-block; padding: 12px 25px; background: white; color: #ff9f43; border: 2px solid #ff9f43; font-weight: 900; font-size: 16px; border-radius: 30px; text-decoration: none; box-shadow: 0 4px 10px rgba(255, 159, 67, 0.1); transition: all 0.2s ease;" onmouseover="this.style.background='#ff9f43'; this.style.color='white'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='white'; this.style.color='#ff9f43'; this.style.transform='scale(1)';">毒霧森林 <i class="fa-solid fa-arrow-right"></i></a>
        </div>

    </div>

</div>

""")

html_parts.append(script_content)

with open(target_path, 'w', encoding='utf-8') as f:
    f.write("".join(html_parts))

print("Successfully generated Ludi PQ layout.")
