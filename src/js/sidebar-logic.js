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
});

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

                const pixel = ctx.getImageData(canvas.width/2, canvas.height/2, 1, 1).data;
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
