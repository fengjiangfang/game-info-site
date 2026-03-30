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

    preloadAllDungeonImages();

    document.querySelectorAll('.timeline-left-panel img').forEach(img => {
        if (!img.__originalSrc) img.__originalSrc = img.src;
        refreshStageImage(img);
    });
});

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

    document.querySelectorAll('.timeline-left-panel img').forEach(img => {
        if (img.src) {
            preloadPaths.add(img.src);
        }
    });

    preloadPaths.forEach(path => {
        const img = new Image();
        img.src = path;
    });
}

const cn = ['', 'ä¸€', 'äºŒ', 'ä¸‰', 'å››', 'äº”', 'å…­', 'ä¸ƒ', 'å…«', 'ä¹', 'å'];

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    img.dataset.hovering = 'false';
    img.classList.add('loading');

    refreshStageImage(img);

    img.style.borderColor = '';

    const num = imgId.split('-')[1];
    const caption = document.getElementById(imgId + '-caption');
    if (caption) {
        caption.innerText = `ç¬¬${cn[num]}éšŽæ®µ`;
        caption.style.color = '';
        caption.style.fontWeight = '';
    }

    setTimeout(() => {
        img.classList.remove('loading');
    }, 100);
}

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

function setHoverImg(url, imgId, name, color) {
    const img = document.getElementById(imgId);
    if (!img) return;

    img.dataset.hovering = 'true';
    img.classList.add('loading');

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

setInterval(() => {
    const stageImages = document.querySelectorAll('.timeline-left-panel img');

    stageImages.forEach(img => {
        const originalPath = img.__originalSrc || img.src;
        const isDynamic = /\.(webp|gif)$/i.test(originalPath);

        if (isDynamic && img.complete && img.naturalWidth > 0 && !img.__gifStaticParsed) {
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

/* ¢w¢w ¦æ°Êª©°¼ÃäÄæ¶}ÃöÅÞ¿è ¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w¢w */
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('mobile-open');
        });
        
        // ÂIÀ»¥~³¡¦Û°ÊÃö³¬
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target) && e.target !== mobileToggle) {
                sidebar.classList.remove('mobile-open');
            }
        });
    }
});
