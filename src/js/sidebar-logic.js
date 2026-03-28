// 圖片預載緩存池
const imageCache = {};

// 預載函數：給予路徑，預先加載到記憶體
function preloadImage(url) {
    if (!url || imageCache[url]) return;
    const img = new Image();
    img.src = url;
    imageCache[url] = img;
}

// 懸停切換函數：滑鼠碰觸時觸發
window.setHoverImg = function(imgUrl, targetId, title, color) {
    const targetImg = document.getElementById(targetId);
    if (!targetImg) return;

    if (!targetImg._originalSrc) {
        targetImg._originalSrc = targetImg.src;
    }

    targetImg.dataset.hovering = 'true';
    targetImg.src = imgUrl;

    const captionId = targetId + '-caption';
    const caption = document.getElementById(captionId);
    if (caption) {
        caption.innerText = title;
        caption.style.color = color;
        caption.style.fontWeight = '900';
    }
};

// 還原函數：滑鼠離開時觸發
window.resetHoverImg = function(targetId) {
    const targetImg = document.getElementById(targetId);
    if (!targetImg) return;

    if (targetImg._originalSrc) {
        targetImg.src = targetImg._originalSrc;
    }

    targetImg.dataset.hovering = 'false';

    const captionId = targetId + '-caption';
    const caption = document.getElementById(captionId);
    if (caption) {
        const row = targetImg.closest('.timeline-row');
        const badge = row ? row.querySelector('.stage-badge') : null;
        caption.innerText = badge ? badge.innerText : '第x階段';
        caption.style.color = '';
        caption.style.fontWeight = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 智慧預載
    setTimeout(() => {
        const hoverElements = document.querySelectorAll('.npc-hover, .mob-hover');
        hoverElements.forEach(el => {
            const attr = el.getAttribute('onmouseover');
            if (attr) {
                const match = attr.match(/setHoverImg\(['"](.*?)['"]/);
                if (match && match[1]) {
                    preloadImage(match[1]);
                }
            }
        });
        console.log(`[SmartCache] 已預載 ${Object.keys(imageCache).length} 張切換圖`);
    }, 1000);

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
});

// GIF 靜放處理邏輯
setInterval(() => {
    const stageImages = document.querySelectorAll('.timeline-left-panel img');

    stageImages.forEach(img => {
        const isGif = img.src.toLowerCase().includes('.gif');
        const row = img.closest('.timeline-row');
        const isActive = row && row.classList.contains('active');

        if (isGif && img.complete && img.naturalWidth > 0 && !img.__gifStaticParsed) {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth || 600;
                canvas.height = img.naturalHeight || 450;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const pixel = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1).data;
                if (pixel[3] > 0) {
                    img.__gifAnimSrc = img.src;
                    img.__gifStaticSrc = canvas.toDataURL('image/png');
                    img.__gifStaticParsed = true;
                }
            } catch (err) {}
        }

        if (img.__gifStaticParsed && img.dataset.hovering !== 'true') {
            if (isActive) {
                if (img.src !== img.__gifAnimSrc) img.src = img.__gifAnimSrc;
            } else {
                if (img.src !== img.__gifStaticSrc) img.src = img.__gifStaticSrc;
            }
        }
    });
}, 300);
