// ============================================================
// 1. KONFIGURASI DATA
// ============================================================

// --- FOTO (isi dengan URL Catbox) ---
const fotoUrls = [
    'https://files.catbox.moe/75feyi.jpg',
    'https://files.catbox.moe/gd7xgu.jpg',
    'https://files.catbox.moe/cdj92f.jpg',
    'https://files.catbox.moe/okfjsl.jpg',
    'https://files.catbox.moe/rn76te.jpg'
];

// --- TEKS TYPING ---
const typingContent = `💌 From Zuzana Ilona and Dany Boy

Please join us in celebration

Zuzana Ilona Birthday
        and 
1ˢᵗ Wedding Anniversary

~ your presence is our joy.`;

// --- LINK GOOGLE MAPS ---
const mapsLink = 'https://maps.app.goo.gl/FqYoiup89cz4tsjY7?g_st=ic';

// --- URL LAGU (upload ke Catbox) ---
const musicUrl = 'https://videotourl.com/audio/1788390872048-51bf9026-7b70-44ae-b41b-a88ecaf69118.mp3';

// ============================================================
// 2. PRELOADER
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hide');
    }, 1000);
});

// ============================================================
// 3. BACKGROUND BLUR SLIDESHOW
// ============================================================
let bgIndex = 0;
const bgElement = document.getElementById('bgSlideshow');

function changeBackground() {
    if (!bgElement || fotoUrls.length === 0) return;
    bgElement.style.backgroundImage = `url(${fotoUrls[bgIndex]})`;
    bgIndex = (bgIndex + 1) % fotoUrls.length;
}

// Set initial background
changeBackground();
// Change every 10 seconds
setInterval(changeBackground, 10000);

// ============================================================
// 4. AMPLOP - IMPROVED
// ============================================================
const envelopeSection = document.getElementById('envelopeSection');
const envelopeBody = document.getElementById('envelopeBody');
const mainContent = document.getElementById('mainContent');

let isEnvelopeOpen = false;

if (envelopeSection) {
    envelopeSection.addEventListener('click', () => {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;
        
        // Buka amplop dengan animasi
        if (envelopeBody) envelopeBody.classList.add('open');
        
        // Efek shadow
        const shadow = document.querySelector('.envelope-shadow');
        if (shadow) {
            shadow.style.width = '60%';
            shadow.style.opacity = '0.4';
        }
        
        // Sembunyikan hint
        const hint = document.querySelector('.envelope-hint');
        if (hint) hint.style.opacity = '0';
        
        setTimeout(() => {
            if (envelopeSection) envelopeSection.classList.add('hide');
            if (mainContent) mainContent.classList.add('active');
            startTyping();
            initGallery();
            
            const mapsBtn = document.getElementById('mapsBtn');
            if (mapsBtn) mapsBtn.href = mapsLink;
            
            // Mulai musik dengan handling error
            if (audio) {
                audio.play().catch(() => {
                    console.log('ℹ️ Klik tombol play untuk memutar musik');
                });
            }
            
            // Confetti
            launchConfetti();
        }, 1200);
    });
}

// ============================================================
// 5. TYPING EFFECT
// ============================================================
function startTyping() {
    const container = document.getElementById('typingText');
    if (!container) return;
    
    let index = 0;
    container.innerHTML = '';

    function typeChar() {
        if (index < typingContent.length) {
            const char = typingContent.charAt(index);
            if (char === '\n') {
                container.innerHTML += '<br>';
            } else {
                container.innerHTML += char;
            }
            index++;
            setTimeout(typeChar, 20 + Math.random() * 25);
        } else {
            const cursor = document.querySelector('.cursor');
            if (cursor) cursor.remove();
        }
    }

    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    container.appendChild(cursorSpan);
    typeChar();
}

// ============================================================
// 6. GALERI FOTO
// ============================================================
let currentIndex = 0;
let slideTimer = null;
let timerProgress = 0;
let progressInterval = null;
const TRACK_INTERVAL = 10000;

const track = document.getElementById('galleryTrack');
const indicators = document.getElementById('galleryIndicators');
const timerBar = document.getElementById('timerBar');

function initGallery() {
    if (!track || !indicators || fotoUrls.length === 0) return;
    
    // Render foto
    track.innerHTML = '';
    fotoUrls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Foto Acara';
        img.loading = 'lazy';
        track.appendChild(img);
    });

    // Render indicators
    indicators.innerHTML = '';
    fotoUrls.forEach((_, i) => {
        const dot = document.createElement('span');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        indicators.appendChild(dot);
    });

    // Tampilkan slide pertama
    goToSlide(0);
}

function goToSlide(index) {
    const total = fotoUrls.length;
    if (total === 0 || !track) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentIndex = index;

    // Update track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update indicators
    const dots = document.querySelectorAll('.gallery-indicators span');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });

    resetTimer();
}

function resetTimer() {
    if (slideTimer) clearTimeout(slideTimer);
    if (progressInterval) clearInterval(progressInterval);
    if (!timerBar) return;
    
    timerProgress = 0;
    timerBar.style.width = '0%';

    const step = 50;
    progressInterval = setInterval(() => {
        timerProgress += step / TRACK_INTERVAL * 100;
        if (timerProgress >= 100) {
            timerProgress = 100;
            timerBar.style.width = '100%';
            clearInterval(progressInterval);
            slideTimer = setTimeout(() => {
                goToSlide(currentIndex + 1);
            }, 300);
        } else {
            timerBar.style.width = timerProgress + '%';
        }
    }, step);
}

// ============================================================
// 7. MUSIC PLAYER - FIXED
// ============================================================
let audio = null;
let isMusicPlaying = false;

const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const musicWave = document.getElementById('musicWave');
const musicTitle = document.getElementById('musicTitle');
const musicArtist = document.getElementById('musicArtist');

// Inisialisasi audio
function initAudio() {
    try {
        audio = new Audio(musicUrl);
        audio.loop = true;
        
        audio.addEventListener('canplaythrough', () => {
            console.log('✅ Audio siap diputar!');
            if (musicTitle) musicTitle.textContent = '🎵 Beautiful And White';
            if (musicArtist) musicArtist.textContent = '~ For Zuzana & Danny ~';
        });
        
        audio.addEventListener('loadedmetadata', () => {
            if (totalTimeEl) {
                totalTimeEl.textContent = formatTime(audio.duration);
            }
        });
        
        audio.addEventListener('timeupdate', () => {
            if (audio.duration && progressFill && currentTimeEl) {
                const pct = (audio.currentTime / audio.duration) * 100;
                progressFill.style.width = pct + '%';
                currentTimeEl.textContent = formatTime(audio.currentTime);
            }
        });
        
        audio.addEventListener('play', () => {
            isMusicPlaying = true;
            if (musicIcon) musicIcon.className = 'fas fa-pause';
            if (musicWave) musicWave.classList.remove('paused');
        });
        
        audio.addEventListener('pause', () => {
            isMusicPlaying = false;
            if (musicIcon) musicIcon.className = 'fas fa-play';
            if (musicWave) musicWave.classList.add('paused');
        });
        
        audio.addEventListener('error', (e) => {
            console.error('❌ Error loading audio:', e);
            if (musicTitle) musicTitle.textContent = '⚠️ Gagal memuat lagu';
            if (musicArtist) musicArtist.textContent = 'Cek URL di script.js';
        });
        
    } catch (error) {
        console.error('❌ Gagal membuat audio:', error);
    }
}

// Panggil init
initAudio();

// Tombol Play/Pause
if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (!audio) return;
        
        if (isMusicPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => {
                console.log('ℹ️ Klik lagi untuk memutar');
            });
        }
    });
}

// Progress bar click
const progressBar = document.querySelector('.progress-bar');
if (progressBar) {
    progressBar.addEventListener('click', (e) => {
        if (!audio || !audio.duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
    });
}

// Format time
function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

// ============================================================
// 8. REFRESH MUSIK
// ============================================================
const refreshBtn = document.getElementById('refreshMusicBtn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        console.log('🔄 Merefresh musik...');
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.src = musicUrl;
            audio.load();
            
            setTimeout(() => {
                audio.play().then(() => {
                    isMusicPlaying = true;
                    if (musicIcon) musicIcon.className = 'fas fa-pause';
                    if (musicWave) musicWave.classList.remove('paused');
                    if (musicTitle) musicTitle.textContent = '🎵 Beautiful And White';
                    console.log('✅ Musik berhasil di-refresh!');
                }).catch(() => {
                    console.log('ℹ️ Klik tombol play untuk memutar');
                });
            }, 500);
        }
    });
}

// ============================================================
// 9. CONFETTI CELEBRATION
// ============================================================
function launchConfetti() {
    const canvasConf = document.getElementById('confettiCanvas');
    if (!canvasConf) return;
    
    const ctxConf = canvasConf.getContext('2d');
    canvasConf.width = window.innerWidth;
    canvasConf.height = window.innerHeight;

    const colors = ['#3BA6C7', '#ffd54f', '#7EC8E3', '#f0f8ff', '#ff6b6b', '#1A6B8A'];
    const pieces = [];
    const count = 150;

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvasConf.width,
            y: Math.random() * canvasConf.height - canvasConf.height,
            w: Math.random() * 10 + 4,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 5 + 2,
            vx: (Math.random() - 0.5) * 3,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 8,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctxConf.clearRect(0, 0, canvasConf.width, canvasConf.height);
        let alive = false;

        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx + Math.sin(frame / 30 + p.x / 50) * 0.4;
            p.rotation += p.rotSpeed;
            if (p.y > canvasConf.height + 50) {
                p.opacity -= 0.015;
            }
            if (p.opacity > 0) {
                alive = true;
                ctxConf.save();
                ctxConf.translate(p.x, p.y);
                ctxConf.rotate((p.rotation * Math.PI) / 180);
                ctxConf.globalAlpha = Math.max(0, p.opacity);
                ctxConf.fillStyle = p.color;
                ctxConf.shadowColor = 'rgba(59, 166, 199, 0.3)';
                ctxConf.shadowBlur = 12;
                if (p.shape === 'rect') {
                    ctxConf.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                } else {
                    ctxConf.beginPath();
                    ctxConf.arc(0, 0, p.w / 2, 0, Math.PI * 2);
                    ctxConf.fill();
                }
                ctxConf.restore();
            }
        });

        frame++;
        if (alive && frame < 400) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctxConf.clearRect(0, 0, canvasConf.width, canvasConf.height);
        }
    }
    animateConfetti();
}

// ============================================================
// 10. TOMBOL NEXT - Scroll ke Galeri
// ============================================================
const btnNext = document.getElementById('btnNext');
if (btnNext) {
    btnNext.addEventListener('click', () => {
        const gallery = document.querySelector('.gallery-card');
        if (gallery) {
            gallery.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    });
}

// ============================================================
// 11. RESIZE HANDLER
// ============================================================
window.addEventListener('resize', () => {
    const canvasConf = document.getElementById('confettiCanvas');
    if (canvasConf) {
        canvasConf.width = window.innerWidth;
        canvasConf.height = window.innerHeight;
    }
});

// ============================================================
// 12. LOG
// ============================================================
console.log('💎 Emerald Blue Elegance v2.0 - FINAL');
console.log('📸 Foto: ' + fotoUrls.length + ' foto siap');
console.log('🎵 Musik: ' + musicUrl);
console.log('📍 Maps: ' + mapsLink);
console.log('✨ Semua bug telah diperbaiki!');
