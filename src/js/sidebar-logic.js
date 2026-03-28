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

const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    img.dataset.hovering = 'false';
    img.classList.add('loading');

    // 立刻執行還原邏輯
    refreshStageImage(img);
    
    // 恢復外框顏色為預設 (橘色)
    img.style.borderColor = '';

    const num = imgId.split('-')[1];
    const originalCaption = `第${cn[num]}階段`;
    
    const caption = document.getElementById(imgId + '-caption');
    if (caption) {
        caption.innerText = originalCaption;
        // 移除內嵌樣式，讓它恢復到 CSS 定義的顏色
        caption.style.color = ''; 
        caption.style.fontWeight = '';
    }
    
    setTimeout(() => {
        img.classList.remove('loading');
    }, 100);
}

// 更新單張階段圖片的顯示狀態
function refreshStageImage(img) {
    if (!img.__originalSrc) {
        img.__originalSrc = img.src;
    }
    
    if (img.dataset.hovering === 'true') return;

    const row = img.closest('.timeline-row');
    const isActive = row && row.classList.contains('active');

    if (img.__gifStaticParsed) {
        if (isActive) {
            if (img.src !== img.__gifAnimSrc) img.src = img.__gifAnimSrc;
        } else {
            if (img.src !== img.__gifStaticSrc) img.src = img.__gifStaticSrc;
        }
    } else {
        if (img.__originalSrc && img.src !== img.__originalSrc) {
            img.src = img.__originalSrc;
        }
    }
}

// 記錄進入頁面時的原始來源
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.timeline-left-panel img').forEach(img => {
        img.__originalSrc = img.src;
        if (img.src.toLowerCase().includes('.gif')) {
            refreshStageImage(img);
        }
    });
});

// 平滑切換圖片
function setHoverImg(url, imgId, name, color) {
    const img = document.getElementById(imgId);
    if (!img) return;

    img.dataset.hovering = 'true';
    img.classList.add('loading');
    
    // 變更圖片外框顏色以符合文字顏色
    img.style.borderColor = color;

    const newImg = new Image();
    newImg.onload = () => {
        img.src = url;
        img.classList.remove('loading');
    };
    newImg.src = url;

    const caption = document.getElementById(imgId + '-caption');
    if (caption) {
        caption.innerText = name;
        caption.style.color = color;
        caption.style.fontWeight = '900';
    }
}

// GIF 全域處理輪詢
setInterval(() => {
    const stageImages = document.querySelectorAll('.timeline-left-panel img');

    stageImages.forEach(img => {
        const originalPath = img.__originalSrc || img.src;
        const isGif = originalPath.toLowerCase().includes('.gif');

        if (isGif && img.complete && img.naturalWidth > 0 && !img.__gifStaticParsed) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data;
                if (pixel[3] > 0) {
                    img.__gifAnimSrc = originalPath;
                    img.__gifStaticSrc = canvas.toDataURL('image/png');
                    img.__gifStaticParsed = true;
                }
            } catch (err) { }
        }

        refreshStageImage(img);
    });
}, 300);
