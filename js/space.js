// Константы для анимации
const STAR_CONFIG = {
    layer1: { count: 200, size: 2, color: 'white', depth: [-1000, 1000] },
    layer2: { count: 150, size: 3, color: '#E8F6FF', depth: [-800, 800] },
    layer3: { count: 100, size: 2.5, color: '#FFF4E8', depth: [-600, 600] }
};

function initSpace() {
    generateStars();
    initScrollAnimations();
    initMusicControl();
}

function generateStars() {
    const root = document.documentElement;
    
    Object.entries(STAR_CONFIG).forEach(([layer, config]) => {
        const shadows = generateStarShadows(config);
        root.style.setProperty(`--star-shadows${layer === 'layer1' ? '' : '-' + layer.slice(-1)}`, shadows);
    });
}

function generateStarShadows({ count, size, color, depth: [minZ, maxZ] }) {
    return Array.from({ length: count }, () => {
        const x = (Math.random() * 2000) - 1000;
        const y = (Math.random() * 2000) - 1000;
        const z = Math.floor(Math.random() * (maxZ - minZ)) + minZ;
        const perspective = Math.max(0.1, (1000 + z) / 2000);
        const adjustedSize = (Math.random() * size * perspective).toFixed(1);
        
        return `${x}px ${y}px ${adjustedSize}px ${color}`;
    }).join(', ');
}

function createComet() {
    const comet = document.createElement('div');
    comet.className = 'comet';
    
    // Случайная начальная позиция и угол
    const startY = Math.random() * window.innerHeight;
    const angle = Math.random() * 30 - 15; // случайный угол от -15 до 15 градусов
    
    comet.style.cssText = `
        top: ${startY}px;
        transform: rotate(${angle}deg);
    `;
    
    document.querySelector('.space-background').appendChild(comet);
    
    comet.addEventListener('animationend', () => {
        comet.remove();
    });
}

function startCometGeneration() {
    const minDelay = 4000;
    const maxDelay = 10000;
    
    function scheduleNextComet() {
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        setTimeout(() => {
            if (Math.random() > 0.5) { // 50% шанс создания кометы
                createComet();
            }
            scheduleNextComet();
        }, delay);
    }
    
    scheduleNextComet();
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.hero-section, .skill-card, .contact-section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        { threshold: 0.15 }
    );
    
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
}

function initMusicControl() {
    const musicControl = document.getElementById('musicControl');
    const musicIcon = document.getElementById('musicIcon');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    bgMusic.volume = 0.3;

    const toggleMusic = async () => {
        try {
            if (!isPlaying) {
                await bgMusic.play();
                musicIcon.className = 'fas fa-pause';
                musicControl.classList.add('playing');
            } else {
                bgMusic.pause();
                musicIcon.className = 'fas fa-play';
                musicControl.classList.remove('playing');
            }
            isPlaying = !isPlaying;
        } catch (error) {
            console.error("Music playback error:", error);
        }
    };

    musicControl.addEventListener('click', toggleMusic);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            toggleMusic();
        }
    });
}

// Оптимизированная инициализация с debounce для resize
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

document.addEventListener('DOMContentLoaded', initSpace);
window.addEventListener('resize', debounce(generateStars, 250)); 