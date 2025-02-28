function initSpace() {
    const spaceBackground = document.querySelector('.space-background');

    // Create comets periodically
    setInterval(() => {
        const comet = document.createElement('div');
        comet.className = 'comet';
        
        // Random position and size
        const startY = Math.random() * window.innerHeight;
        const width = Math.random() * 150 + 50;
        
        comet.style.cssText = `
            top: ${startY}px;
            left: -100px;
            width: ${width}px;
        `;
        
        spaceBackground.appendChild(comet);
        
        // Remove comet after animation
        setTimeout(() => comet.remove(), 6000);
    }, 10000);

    // Initialize scroll animations
    initScrollAnimations();

    // Initialize music control
    initMusicControl();
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.hero-section, .skill-card, .contact-section');
    
    sections.forEach(section => {
        section.classList.add('fade-in-section');
    });

    function checkSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.85) {
                section.classList.add('is-visible');
            }
        });
    }

    // Check positions on load
    checkSections();

    // Check positions on scroll
    window.addEventListener('scroll', checkSections);
}

function initMusicControl() {
    const musicControl = document.getElementById('musicControl');
    const musicIcon = document.getElementById('musicIcon');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    // Set initial volume
    bgMusic.volume = 0.3;

    musicControl.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play()
                .then(() => {
                    musicIcon.className = 'fas fa-pause';
                    musicControl.classList.add('playing');
                    isPlaying = true;
                })
                .catch(error => {
                    console.log("Playback failed:", error);
                });
        } else {
            bgMusic.pause();
            musicIcon.className = 'fas fa-play';
            musicControl.classList.remove('playing');
            isPlaying = false;
        }
    });

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying) {
            bgMusic.pause();
            musicIcon.className = 'fas fa-play';
            musicControl.classList.remove('playing');
            isPlaying = false;
        }
    });
}

// Start space effects when page loads
document.addEventListener('DOMContentLoaded', initSpace); 