const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDirs = [
    'src/images/組隊副本',
    'src/images/主題副本'
];

// 遞迴遍歷目錄
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.gif', '.png', '.jpg', '.jpeg'].includes(ext)) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

// 核心轉換邏輯
async function optimizeImages() {
    console.log('🚀 開始全自動圖片 WebP 替換與清理 (掃描整個 src/images)...');
    
    for (const dir of inputDirs) {
        if (!fs.existsSync(dir)) continue;

        const files = getAllFiles(dir);
        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            // 排除已經是 webp 的檔案
            if (ext === '.webp') continue;

            const outputWebp = file.replace(/\.(gif|png|jpg|jpeg)$/i, '.webp');

            try {
                console.log(`📦 轉換並替換: ${path.basename(file)} -> WebP`);
                
                const instance = sharp(file, { animated: ext === '.gif' });

                if (ext === '.gif') {
                    await instance
                        .webp({ effort: 4, quality: 80, lossless: false, force: true })
                        .toFile(outputWebp);
                } else {
                    await instance
                        .webp({ quality: 85 })
                        .toFile(outputWebp);
                }

                // [重要] 轉換成功後，刪除原始檔案
                if (fs.existsSync(outputWebp)) {
                    fs.unlinkSync(file);
                    console.log(`   🗑️ 已刪除原始檔: ${path.basename(file)}`);
                }
            } catch (err) {
                console.error(`❌ 轉換失敗 ${file}:`, err.message);
            }
        }
    }
    console.log('✅ 全站圖片 WebP 替換與清理完成！');
}

optimizeImages();
