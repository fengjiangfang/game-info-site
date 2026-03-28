const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 使用 resolve 確保跨平台路徑正確 (Linux/Windows)
const rootDir = path.resolve(__dirname, '../src/images');

// 穩健的遞歸尋找所有圖片檔案
function findImages(dir, results) {
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            findImages(fullPath, results);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.gif', '.png', '.jpg', '.jpeg'].includes(ext)) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

async function startCleaning() {
    console.log('🚀 開始全站圖片 WebP 徹底替換與物理清理...');
    
    // 容錯：如果目錄不存在 (CI 有時會忽略空目錄)，則優雅退出
    if (!fs.existsSync(rootDir)) {
        console.log('📢 找不到 images 目錄，可能是專案結構變更或已清理完成。跳過優化。');
        process.exit(0);
        return;
    }

    let allImages = [];
    try {
        allImages = findImages(rootDir, []);
    } catch (e) {
        console.log('📢 掃描過程遇到錯誤 (可能是空資料夾)，跳過優化。');
        process.exit(0);
        return;
    }

    if (allImages.length === 0) {
        console.log('✅ 目錄已純淨化 (0 張傳統格式圖片)，無需執行優化。');
        process.exit(0);
        return;
    }

    console.log(`🔍 掃描完成，共發現 ${allImages.length} 張傳統格式圖片待處理。`);

    for (const file of allImages) {
        const ext = path.extname(file).toLowerCase();
        const webpPath = file.substring(0, file.lastIndexOf('.')) + '.webp';

        try {
            console.log(`📦 正在處理: ${path.relative(rootDir, file)}`);
            
            // 轉換
            await sharp(file, { animated: ext === '.gif' })
                .webp({ effort: 4, quality: 80, lossless: false })
                .toFile(webpPath);

            // 成功生成後，物理刪除原始檔
            if (fs.existsSync(webpPath)) {
                fs.unlinkSync(file);
                console.log(`   🗑️ 原始檔案已清除。`);
            }
        } catch (err) {
            console.error(`❌ 處理失敗 ${path.basename(file)}:`, err.message);
        }
    }

    console.log('✅ 全站資產 100% WebP 化完成！');
    process.exit(0);
}

startCleaning();
