// ============================================================
// 1. KONFIGURASI DATA
// ============================================================

// --- FOTO (isi dengan URL Catbox) ---
const fotoUrls = [
    'https://files.catbox.moe/example1.jpg',
    'https://files.catbox.moe/example2.jpg',
    'https://files.catbox.moe/example3.jpg',
    'https://files.catbox.moe/example4.jpg',
    'https://files.catbox.moe/example5.jpg'
];

// --- TEKS TYPING (bisa custom) ---
const typingContent = `💌 Untuk Zuzana Ilona & Danny Boy tercinta...

Selamat Ulang Tahun ke-60 & 1 Year Anniversary!

"Emerald love shines bright,
through sixty years of life,
and one year of togetherness,
may your journey be blessed with light."

~ Dengan cinta, Keluarga & Sahabat ~`;

// --- LINK GOOGLE MAPS ---
const mapsLink = 'https://www.google.com/maps?q=Grand+Hotel+Jakarta';

// --- URL LAGU (upload ke Catbox) ---
const musicUrl = 'https://files.catbox.moe/example.mp3';

// ============================================================
// 2. PRELOADER
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hide');
    }, 800);
});

// ============================================================
// 3. PARTICLE SYSTEM (Background)
// ============================================================
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = 140 + Math.random() * 20;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
        ctx.shadowColor = 'rgba(80, 200, 120, 0.3)';
        ctx.shadowBlur = 12;
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ============================================================
// 4. AMPLOP
// ============================================================
const envelopeSection = document.getElementById('envelopeSection');
const envelope = document.getElementById('envelope');
const mainContent = document.getElementById('mainContent');
const typingArea = document.getElementById('typingArea');

envelopeSection.addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
        envelopeSection.classList.add('hide');
        mainContent.classList.add('active');
        startTyping();
        initGallery();
        document.getElementById('mapsBtn').href = mapsLink;
        // Mulai musik (autoplay dibatasi browser, user harus klik)
        audio.play().catch(() => {});
        // Trigger confetti
        launchConfetti();
    }, 900);
});

// ============================================================
// 5. TYPING EFFECT
// ============================================================
function startTyping() {
    const container = document.getElementById('typingText');
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
            setTimeout(typeChar, 25 + Math.random() * 20);
        } else {
            // Hapus cursor di akhir
            const cursor = document.querySelector('.cursor');
            if (cursor) cursor.remove();
        }
    }

    // Tambah cursor
    const cursorSpan = document.createElement('span');
    cursorSpan.className = 'cursor';
    container.appendChild(cursorSpan);
    typeChar();
}

// ============================================================
// 6. GALERI FOTO (Slideshow dengan kontrol)
// ============================================================
let currentIndex = 0;
let slideTimer = null;
let timerProgress = 0;
let progressInterval = null;
const TRACK_INTERVAL = 10000; // 10 detik

const track = document.getElementById('galleryTrack');
const indicators = document.getElementById('galleryIndicators');
const timerBar = document.getElementById('timerBar');

function initGallery() {
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

    // Event buttons
    document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentIndex - 1));
    document.getElementById('nextBtn').addEventListener('click', () => goToSlide(currentIndex + 1));

    // Tampilkan slide pertama
    goToSlide(0);
}

function goToSlide(index) {
    const total = fotoUrls.length;
    if (total === 0) return;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    currentIndex = index;

    // Update track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update indicators
    document.querySelectorAll('.gallery-indicators span').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
    });

    // Reset timer
    resetTimer();
}

function resetTimer() {
    if (slideTimer) clearTimeout(slideTimer);
    if (progressInterval) clearInterval(progressInterval);
    timerProgress = 0;
    timerBar.style.width = '0%';

    // Start progress
    const step = 50; // ms per step
    progressInterval = setInterval(() => {
        timerProgress += step / TRACK_INTERVAL * 100;
        if (timerProgress >= 100) {
            timerProgress = 100;
            timerBar.style.width = '100%';
            clearInterval(progressInterval);
            // Next slide
            slideTimer = setTimeout(() => {
                goToSlide(currentIndex + 1);
            }, 200);
        } else {
            timerBar.style.width = timerProgress + '%';
        }
    }, step);
}

// ============================================================
// 7. MUSIC PLAYER
// ============================================================
const audio = new Audio(musicUrl);
audio.loop = true;
let isMusicPlaying = false;

const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const musicWave = document.getElementById('musicWave');

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});

audio.addEventListener('play', () => {
    isMusicPlaying = true;
    musicIcon.className = 'fas fa-pause';
    musicWave.classList.remove('paused');
});

audio.addEventListener('pause', () => {
    isMusicPlaying = false;
    musicIcon.className = 'fas fa-play';
    musicWave.classList.add('paused');
});

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        audio.pause();
    } else {
        audio.play().catch(() => {});
    }
});

// Progress bar click untuk seek
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = pct * audio.duration;
    }
});

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

// ============================================================
// 8. CONFETTI CELEBRATION
// ============================================================
function launchConfetti() {
    const canvasConf = document.getElementById('confettiCanvas');
    const ctxConf = canvasConf.getContext('2d');
    canvasConf.width = window.innerWidth;
    canvasConf.height = window.innerHeight;

    const colors = ['#50c878', '#ffd54f', '#a5d6a7', '#f0fff0', '#ff6b6b'];
    const pieces = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
        pieces.push({
            x: Math.random() * canvasConf.width,
            y: Math.random() * canvasConf.height - canvasConf.height,
            w: Math.random() * 8 + 4,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: Math.random() * 4 + 2,
            vx: (Math.random() - 0.5) * 2,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
            opacity: 1
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctxConf.clearRect(0, 0, canvasConf.width, canvasConf.height);
        let alive = false;

        pieces.forEach(p => {
            p.y += p.vy;
            p.x += p.vx + Math.sin(frame / 30 + p.x / 50) * 0.3;
            p.rotation += p.rotSpeed;
            if (p.y > canvasConf.height + 50) {
                p.opacity -= 0.02;
            }
            if (p.opacity > 0) {
                alive = true;
                ctxConf.save();
                ctxConf.translate(p.x, p.y);
                ctxConf.rotate((p.rotation * Math.PI) / 180);
                ctxConf.globalAlpha = Math.max(0, p.opacity);
                ctxConf.fillStyle = p.color;
                ctxConf.shadowColor = 'rgba(80, 200, 120, 0.3)';
                ctxConf.shadowBlur = 10;
                ctxConf.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctxConf.restore();
            }
        });

        frame++;
        if (alive && frame < 300) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctxConf.clearRect(0, 0, canvasConf.width, canvasConf.height);
        }
    }
    animateConfetti();
}

// ============================================================
// 9. RESPONSIVE HANDLING
// ============================================================
window.addEventListener('resize', () => {
    resizeCanvas();
});

console.log('✨ Emerald Elegance Undangan siap! ✨');
console.log('🎵 Upload musik ke Catbox dan isi musicUrl');
console.log('📸 Upload foto ke Catbox dan isi fotoUrls');
