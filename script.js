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
function startMusicEngine() {
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

function stopMusicEngine() {
  if (bgAudio) {
    bgAudio.pause();
  }
  isPlaying = false;
  updateAudioUI();
}

// --- Toggle Audio ---
function toggleAudio() {
  playClickSound();
  initAudio();
  if (isPlaying) {
    stopMusicEngine();
  } else {
    startMusicEngine();
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

// --- Update Audio Player UI ---
function updateAudioUI() {
  const equalizer = document.getElementById('equalizer');
  const audioLabel = document.getElementById('audioLabel');
  const optMusicBtn = document.getElementById('optMusicBtn');
  const playIcon = document.getElementById('playIcon');
  const musicIcon = document.getElementById('musicIcon');

  if (isPlaying) {
    if (equalizer) equalizer.classList.add('playing');
    if (audioLabel) {
      audioLabel.textContent = 'NOW PLAYING';
      audioLabel.style.color = '#00f0ff';
    }
    if (optMusicBtn) optMusicBtn.textContent = 'MUTE MUSIC';
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
    if (musicIcon) musicIcon.classList.add('spinning');
  } else {
    if (equalizer) equalizer.classList.remove('playing');
    if (audioLabel) {
      audioLabel.textContent = 'MUSIC OFF';
      audioLabel.style.color = 'var(--text-muted)';
    }
    if (optMusicBtn) optMusicBtn.textContent = 'START MUSIC';
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (musicIcon) musicIcon.classList.remove('spinning');
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
