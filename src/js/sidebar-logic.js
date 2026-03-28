// 圖片預載與換圖邏輯 (優化 GitHub 遲鈍感)
function preloadImages() {
    const hoverElements = document.querySelectorAll('.npc-hover, .mob-hover');
    hoverElements.forEach(el => {
        const mouseOverAttr = el.getAttribute('onmouseover');
        if (mouseOverAttr) {
            const match = mouseOverAttr.match(/'([^']+)'/);
            if (match && match[1]) {
                const img = new Image();
                img.src = match[1];
            }
        }
    });

    // 預載原始背景圖
    document.querySelectorAll('.timeline-left-panel img').forEach(img => {
        img.__originalSrc = img.src;
    });
}

window.setHoverImg = function(url, imgId, name, color) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if (img) {
        img.dataset.hovering = 'true';
        img.src = url;
        img.style.borderColor = color;
        img.style.boxShadow = `0 0 20px ${color}44`;
    }
    if (caption) {
        caption.innerText = name;
        caption.style.background = color;
    }
};

window.resetHoverImg = function(imgId) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if (img) {
        img.dataset.hovering = 'false';
        // 恢復原始圖片 (如果是 GIF，由 setInterval 處理)
        img.src = img.__originalSrc || img.src;
        img.style.borderColor = 'transparent';
        img.style.boxShadow = 'none';
    }
    if (caption) {
        const stageNumStr = imgId.split('-')[1];
        const cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        caption.innerText = '第' + cn[parseInt(stageNumStr)] + '階段';
        caption.style.background = 'rgba(0, 0, 0, 0.6)';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    
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

// GIF 暫動與顯示處理邏輯 (優化頻率)
setInterval(() => {
    const stageImages = document.querySelectorAll('.timeline-left-panel img');

    stageImages.forEach(img => {
        // 如果正在懸停切換圖，暫時跳過 GIF 處理邏輯，避免閃爍
        if (img.dataset.hovering === 'true') return;

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
            } catch (err) { }
        }

        if (img.__gifStaticParsed) {
            if (isActive) {
                if (img.src !== img.__gifAnimSrc) img.src = img.__gifAnimSrc;
            } else {
                if (img.src !== img.__gifStaticSrc) img.src = img.__gifStaticSrc;
            }
        }
    });
}, 350);

