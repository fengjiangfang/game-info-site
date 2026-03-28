const fs = require('fs');
const path = require('path');

const dir = path.join('d:', '00', 'FJ', '\u5B98\u65B9\u7A0B\u5F0F', 'game-info-site', 'src');

const replacements = [
    // 1. Dungeon info header container
    ['style="display: flex; gap: 30px; margin-bottom: 50px; align-items: stretch;"', 'class="dungeon-info-header"'],
    // 2. Info left column
    ['style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 15px;"', 'class="dungeon-info-left"'],
    // 3. Setting row margin/flex
    ['class="setting-row" style="margin: 0; flex: 1;"', 'class="setting-row"'],
    // 4. Setting value normal
    ['class="setting-row-value" style="font-size: 20px; color: #2c3e50;"', 'class="setting-row-value"'],
    // 5. Setting value reward (red)
    ['class="setting-row-value" style="font-size: 20px; color: #e74c3c;"', 'class="setting-row-value reward"'],
    // 6. Info right NPC panel
    ['style="flex: 0 0 30%; background-color: #fffbf0; border-radius: 20px; border: 4px solid #fff; box-shadow: 0 8px 25px rgba(255, 159, 67, 0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; padding: 20px 20px 15px 20px;"', 'class="dungeon-info-right"'],
    // 7. NPC image wrapper
    ['style="flex: 1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; transform: translateY(-10px);"', 'class="dungeon-npc-img"'],
    // 8. NPC image inline style
    ['style="width: 100%; height: 100%; object-fit: contain; border-radius: 16px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));"', ''],
    // 9. Location badge
    ['style="margin-top: 5px; font-weight: 900; color: #e67e22; font-size: 14px; text-align: center; letter-spacing: 1px; background: rgba(255, 159, 67, 0.1); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255, 159, 67, 0.3); width: 95%;"', 'class="dungeon-location-badge"'],
    // 10. Item text (non-bold)
    ['style="color: #0984e3;"', 'class="item-text"'],
    // 11. Item text bold
    ['style="color: #0984e3; font-weight: bold;"', 'class="item-text-bold"'],
    // 12. Tip text
    ['style="color: #c0392b; font-weight: bold;"', 'class="tip-text"'],
    // 13. Stage caption
    ['style="color: #ff9f43; font-size: 16px; transition: opacity 0.15s ease-in-out;"', 'class="stage-caption"'],
    // 14. Forum main card warm
    ['class="forum-main-card" style="background-color: #fff4e6; padding: 40px;"', 'class="forum-main-card forum-main-card-warm"'],
    // 15. Stage legend justify
    ['class="stage-legend" style="justify-content: center; margin-top: 15px;"', 'class="stage-legend"'],
    ['class="stage-legend" style="justify-content: center;"', 'class="stage-legend"'],
];

let totalCount = 0;

function walk(dir) {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.njk')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            let fileCount = 0;

            for (const [oldStr, newStr] of replacements) {
                if (content.includes(oldStr)) {
                    const count = content.split(oldStr).length - 1;
                    content = content.split(oldStr).join(newStr);
                    changed = true;
                    fileCount += count;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated (' + fileCount + ' replacements): ' + path.basename(fullPath));
                totalCount += fileCount;
            }
        }
    });
}

walk(dir);
console.log('Total replacements: ' + totalCount);
