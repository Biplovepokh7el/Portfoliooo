/* ==========================================================================
   BIPLOVE POKHREL - PORTFOLIO INTERACTION & SCROLL OBSERVER ENGINE
   ========================================================================== */

// --- Global Audio Engine Variables ---
let bgAudio = null;
let isPlaying = false;
let audioVolume = 0.5;
let sfxCtx = null;

// --- Initialize Audio Element & Web Audio API for SFX ---
function initAudio() {
  if (!bgAudio) {
    bgAudio = document.getElementById('bgAudio');
    if (!bgAudio) {
      bgAudio = new Audio('images/hahaha.mp3');
      bgAudio.loop = true;
      bgAudio.id = 'bgAudio';
    }
    bgAudio.volume = audioVolume;
  }

  if (!sfxCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      sfxCtx = new AudioContext();
    }
  }
  if (sfxCtx && sfxCtx.state === 'suspended') {
    sfxCtx.resume().catch(() => {});
  }
}

// --- Dynamic Music Player Engine (Plays images/hahaha.mp3) ---
function playMusic() {
  playClickSound();
  initAudio();
  if (!bgAudio) return;

  bgAudio.volume = audioVolume;
  bgAudio.play().then(() => {
    isPlaying = true;
    updateAudioUI();
  }).catch(err => {
    console.log("Audio playback waiting for user interaction:", err);
    isPlaying = false;
    updateAudioUI();
  });
}

function pauseMusic() {
  playClickSound();
  if (bgAudio) {
    bgAudio.pause();
  }
  isPlaying = false;
  updateAudioUI();
}

function nextTrack() {
  playClickSound();
  initAudio();
  if (bgAudio) {
    bgAudio.currentTime = 0;
    bgAudio.play().then(() => {
      isPlaying = true;
      updateAudioUI();
    }).catch(() => {});
  }
}

function startMusicEngine() {
  playMusic();
}

function stopMusicEngine() {
  pauseMusic();
}

// --- Toggle Audio ---
function toggleAudio() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function setVolume(val) {
  audioVolume = parseFloat(val);
  initAudio();
  if (bgAudio) {
    bgAudio.volume = audioVolume;
  }
  
  // Keep volume inputs in sync
  const volumeSlider = document.getElementById('volumeSlider');
  const modalVolumeSlider = document.getElementById('modalVolumeSlider');
  if (volumeSlider) volumeSlider.value = audioVolume;
  if (modalVolumeSlider) modalVolumeSlider.value = audioVolume;
}

// --- Update Audio Player UI (Symbol Buttons) ---
function updateAudioUI() {
  const playBtns = document.querySelectorAll('#playBtn');
  const pauseBtns = document.querySelectorAll('#pauseBtn');
  const optMusicBtn = document.getElementById('optMusicBtn');

  if (isPlaying) {
    playBtns.forEach(btn => btn.classList.add('active'));
    pauseBtns.forEach(btn => btn.classList.remove('active'));
    if (optMusicBtn) optMusicBtn.textContent = 'MUTE';
  } else {
    playBtns.forEach(btn => btn.classList.remove('active'));
    pauseBtns.forEach(btn => btn.classList.add('active'));
    if (optMusicBtn) optMusicBtn.textContent = 'PLAY';
  }
}

// --- Sci-Fi Click SFX ---
function playClickSound() {
  try {
    initAudio();
    if (!sfxCtx) return;
    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, sfxCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, sfxCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12 * audioVolume, sfxCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, sfxCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(sfxCtx.destination);

    osc.start();
    osc.stop(sfxCtx.currentTime + 0.08);
  } catch (e) {}
}

// --- Smooth Scroll Navigation ---
function scrollToSection(sectionId) {
  playClickSound();
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- Scroll Observer for Active Navbar Pills & Visibility ---
document.addEventListener('DOMContentLoaded', () => {
  initAudio();
  updateAudioUI();

  const sections = document.querySelectorAll('.page-section');
  const navbar = document.getElementById('navbar');
  const pills = {
    'about': document.getElementById('pill-about'),
    'projects': document.getElementById('pill-projects'),
    'contact': document.getElementById('pill-contact')
  };

  const observerOptions = {
    root: document.getElementById('scrollContainer'),
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Navbar Mode: home-mode keeps top-right music player visible while hiding pills/logo on home slide
        if (id === 'home') {
          if (navbar) navbar.classList.add('home-mode');
        } else {
          if (navbar) navbar.classList.remove('home-mode');
        }

        // Active Pill Highlight
        Object.keys(pills).forEach(key => {
          if (pills[key]) {
            if (key === id) {
              pills[key].classList.add('active');
            } else {
              pills[key].classList.remove('active');
            }
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});

// --- Modal Controls ---
function openModal(modalId) {
  playClickSound();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  playClickSound();
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}
