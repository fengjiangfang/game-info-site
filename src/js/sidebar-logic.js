document.addEventListener('DOMContentLoaded', () => {
    const allDetails = document.querySelectorAll('details');

    document.querySelectorAll('details.main-group, details.feature-subgroup').forEach(detail => {
        detail.addEventListener('mouseenter', () => {
            detail.setAttribute('open', '');
        });
        detail.addEventListener('mouseleave', () => {
            if (!detail.querySelector('.active')) {
                detail.removeAttribute('open');
                if (detail.id) {
                    localStorage.setItem('details_state_' + detail.id, 'closed');
                }
            }
        });
    });

    document.querySelectorAll('summary').forEach(summary => {
        summary.addEventListener('click', (e) => {
            const detail = summary.parentElement;
            if (detail.open && detail.querySelector('.active')) {
                e.preventDefault();
            }
        });
    });

    allDetails.forEach(detail => {
        if (detail.id) {
            const hasActiveChild = detail.querySelector('.active');
            if (hasActiveChild) {
                detail.setAttribute('open', '');
                localStorage.setItem('details_state_' + detail.id, 'open');
            } else {
                if (detail.classList.contains('feature-subgroup')) {
                    detail.removeAttribute('open');
                    localStorage.setItem('details_state_' + detail.id, 'closed');
                } else {
                    const savedState = localStorage.getItem('details_state_' + detail.id);
                    if (savedState === 'open') {
                        detail.setAttribute('open', '');
                    } else if (savedState === 'closed') {
                        detail.removeAttribute('open');
                    }
                }
            }
        }

        if (detail.id) {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    localStorage.setItem('details_state_' + detail.id, 'open');

                    if (detail.classList.contains('main-group')) {
                        document.querySelectorAll('details.main-group').forEach(sibling => {
                            if (sibling !== detail && sibling.open && !sibling.querySelector('.active')) {
                                sibling.removeAttribute('open');
                                if (sibling.id) {
                                    localStorage.setItem('details_state_' + sibling.id, 'closed');
                                }
                            }
                        });
                    }

                    if (detail.classList.contains('feature-subgroup')) {
                        document.querySelectorAll('details.feature-subgroup').forEach(sibling => {
                            if (sibling !== detail && sibling.open && !sibling.querySelector('.active')) {
                                sibling.removeAttribute('open');
                                if (sibling.id) {
                                    localStorage.setItem('details_state_' + sibling.id, 'closed');
                                }
                            }
                        });
                    }

                } else {
                    if (detail.querySelector('.active')) {
                        detail.setAttribute('open', '');
                        localStorage.setItem('details_state_' + detail.id, 'open');
                    } else {
                        localStorage.setItem('details_state_' + detail.id, 'closed');
                    }
                }
            });
        }
    });

    document.querySelectorAll('details.main-group').forEach(detail => {
        if (detail.querySelector('.active')) {
            document.querySelectorAll('details.main-group').forEach(sibling => {
                if (sibling !== detail && !sibling.querySelector('.active')) {
                    sibling.removeAttribute('open');
                    if (sibling.id) localStorage.setItem('details_state_' + sibling.id, 'closed');
                }
            });
        }
    });

    // 全域圖片預載入與平滑切換
    preloadAllDungeonImages();
});

// 預載入所有 NPC/怪物圖片
function preloadAllDungeonImages() {
    const hoverElements = document.querySelectorAll('[onmouseover*="setHoverImg"]');
    const preloadPaths = new Set();

    hoverElements.forEach(el => {
        const mouseOverAttr = el.getAttribute('onmouseover');
        const match = mouseOverAttr.match(/setHoverImg\(['"](.*?)['"]/);
        if (match && match[1]) {
            preloadPaths.add(match[1]);
        }
    });

    // 也預載入階段圖片的 GIF 與 JPG 版本
    document.querySelectorAll('.timeline-left-panel img').forEach(img => {
        if (img.src) {
            preloadPaths.add(img.src.replace(/\.(png|jpg|jpeg|webp)$/i, '.gif'));
            preloadPaths.add(img.src.replace(/\.(gif|png|jpeg|webp)$/i, '.jpg'));
        }
    });

    preloadPaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

// 平滑切換圖片
function setHoverImg(url, imgId, name, color) {
    const img = document.getElementById(imgId);
    if (!img) return;

    // 標記正在懸停，防止被 GIF 暫動邏輯覆蓋
    img.dataset.hovering = 'true';

    // 平滑過渡：先半透明
    img.classList.add('loading');

    const newImg = new Image();
    newImg.onload = () => {
        img.src = url;
        img.classList.remove('loading');
    };
    newImg.src = url;

    const caption = document.getElementById(imgId + '-caption');
    if (caption) {
        caption.innerText = name;
        caption.style.color = color; // 只改文字顏色
        caption.style.fontWeight = '900'; // 加粗文字以突顯
    }
}

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    img.dataset.hovering = 'false';
    img.classList.add('loading');

    const num = imgId.split('-')[1];
    const originalCaption = `第${cn[num]}階段`;

    const caption = document.getElementById(imgId + '-caption');
    if (caption) {
        caption.innerText = originalCaption;
        caption.style.color = color; // 恢復白色文字
        caption.style.fontWeight = '700';
    }

    // 延時一點點恢復，配合 CSS transition
    setTimeout(() => {
        img.classList.remove('loading');
    }, 50);
}

const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

// GIF 暫動處理邏輯
setInterval(() => {
    const stageImages = document.querySelectorAll('.timeline-left-panel img');

    stageImages.forEach(img => {
        const isGif = img.src.toLowerCase().includes('.gif');
        const row = img.closest('.timeline-row');
        // 嚴格檢查進度條 (row) 是否處於 active 狀態
        const isActive = row && row.classList.contains('active');

        if (isGif && img.complete && img.naturalWidth > 0 && !img.__gifStaticParsed) {
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
                // 忽略跨域問題
            }
        }

        if (img.__gifStaticParsed && img.dataset.hovering !== 'true') {
            if (isActive) {
                // 當前階段：啟動動圖
                if (img.src !== img.__gifAnimSrc) {
                    img.src = img.__gifAnimSrc;
                }
            } else {
                // 非當前階段：切換為靜照
                if (img.src !== img.__gifStaticSrc) {
                    img.src = img.__gifStaticSrc;
                }
            }
        }
    });
}, 300);
