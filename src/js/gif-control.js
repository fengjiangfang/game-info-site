/**
 * GIF 播放控制邏輯
 * 確保 GIF 僅在所屬階段處於 Active 狀態時播放，否則顯示靜止影格。
 */
document.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        const stageImages = document.querySelectorAll('.timeline-left-panel img');

        stageImages.forEach(img => {
            const isGif = img.src.toLowerCase().includes('.gif');
            const row = img.closest('.timeline-row');
            const isActive = row && row.classList.contains('active');

            // 如果是 GIF 且尚未解析過靜止影格
            if (isGif && img.complete && img.naturalWidth > 0 && isActive && !img.__gifStaticParsed) {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || 600;
                    canvas.height = img.naturalHeight || 450;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
                    if (pixel[3] > 0) {
                        img.__gifAnimSrc = img.src;
                        img.__gifStaticSrc = canvas.toDataURL('image/png');
                        img.__gifStaticParsed = true;
                    }
                } catch (err) {
                    console.error("Canvas draw failed: ", err);
                }
            }

            // 根據 Active 狀態切換動態與靜止來源
            if (img.__gifStaticParsed && img.dataset.hovering !== 'true') {
                if (isActive) {
                    if (img.src !== img.__gifAnimSrc) {
                        img.src = img.__gifAnimSrc;
                    }
                } else {
                    if (img.src !== img.__gifStaticSrc) {
                        img.src = img.__gifStaticSrc;
                    }
                }
            }
        });
    }, 300);
});
