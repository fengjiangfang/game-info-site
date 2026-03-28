function setHoverImg(src, imgId, captionText, captionColor) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if(img) {
        img.dataset.hovering = 'true';

        if(img.dataset.resetTid) {
            clearTimeout(parseInt(img.dataset.resetTid));
            img.dataset.resetTid = '';
        }

        img.dataset.triedGif = '';
        img.dataset.triedJpg = '';
        img.onerror = function() { window.globalImageErrorFallback(this); };

        if(!img.dataset.defaultSrc) {
            img.dataset.defaultSrc = img.getAttribute('src');
            if(caption) {
                caption.dataset.defaultText = caption.innerText;
                caption.dataset.defaultColor = caption.style.color;
            }
        }

        img.style.transition = 'none';
        if(caption) caption.style.transition = 'none';

        img.src = src;
        img.style.opacity = '1';
        if(caption && captionText) {
            caption.innerText = captionText;
            caption.style.color = captionColor || '#ff9f43';
            caption.style.opacity = '1';
            img.style.borderColor = captionColor || '#fff';
        }

        setTimeout(() => {
            img.style.transition = '';
            if(caption) caption.style.transition = '';
        }, 50);
    }
}

function resetHoverImg(imgId) {
    const img = document.getElementById(imgId);
    const caption = document.getElementById(imgId + '-caption');
    if(img && img.dataset.defaultSrc) {
        img.dataset.hovering = 'false';
        if(img.dataset.resetTid) {
            clearTimeout(parseInt(img.dataset.resetTid));
        }

        img.dataset.triedGif = '';
        img.dataset.triedJpg = '';
        img.onerror = function() { window.globalImageErrorFallback(this); };

        img.style.borderColor = '#fff';

        img.style.opacity = '0';
        if(caption) caption.style.opacity = '0';
        const tid = setTimeout(() => {
            img.src = img.dataset.defaultSrc;
            img.style.opacity = '1';
            if(caption && caption.dataset.defaultText) {
                caption.innerText = caption.dataset.defaultText;
                caption.style.color = caption.dataset.defaultColor;
                caption.style.opacity = '1';
            }
        }, 150);
        img.dataset.resetTid = tid;
    }
}

let dungeonSwitchTimeout;
let currentDungeonIndex = 0;

function setActiveDungeon(wrapper, containerId, imgSrc, newIndex) {
    const container = document.getElementById(containerId);
    let oldImg = container.querySelector('.active-img');
    if (!oldImg) {
        oldImg = container.querySelector('img');
        if (oldImg) oldImg.classList.add('active-img');
    }
    if (oldImg && oldImg.getAttribute('src') === imgSrc) return;

    clearTimeout(dungeonSwitchTimeout);

    dungeonSwitchTimeout = setTimeout(() => {
        if (oldImg && oldImg.getAttribute('src') === imgSrc) return;
        const isScrollingDown = newIndex > currentDungeonIndex;
        currentDungeonIndex = newIndex;

        const newImg = document.createElement('img');
        newImg.src = imgSrc;
        newImg.alt = "副本圖影";
        newImg.style.position = 'absolute';
        newImg.style.top = '0';
        newImg.style.left = '0';
        newImg.style.width = '100%';
        newImg.style.height = '100%';
        newImg.style.objectFit = 'cover';
        const initialY = isScrollingDown ? '100%' : '-100%';
        newImg.style.transform = 'translateY(' + initialY + ')';
        newImg.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        newImg.onerror = function() { this.src='https://placehold.co/600x450/fff4e6/ff9f43?text=NO+IMAGE&font=Oswald'; };
        newImg.classList.add('active-img');
        container.appendChild(newImg);

        void newImg.offsetWidth;

        if (oldImg) {
            const exitY = isScrollingDown ? '-100%' : '100%';
            oldImg.style.transform = 'translateY(' + exitY + ')';
            oldImg.classList.remove('active-img');
            setTimeout(() => { if (oldImg.parentNode) oldImg.remove(); }, 500);
        }
        newImg.style.transform = 'translateY(0%)';

        document.querySelectorAll('.timeline-item').forEach(el => el.classList.remove('active'));
        wrapper.closest('.timeline-item').classList.add('active');
    }, 40);
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.timeline-row');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                rows.forEach(r => r.classList.remove('active'));
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    });

    rows.forEach(row => observer.observe(row));
});
