/* ==========================================================================
   BIPLOVE POKHREL - PORTFOLIO INTERACTION & SCROLL OBSERVER ENGINE
   ========================================================================== */

// --- Global Audio Engine Variables ---
let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let ambientOscillators = [];
let audioVolume = 0.5;

// --- Initialize Web Audio API Synth ---
function initAudio() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(audioVolume, audioCtx.currentTime);
  masterGain.connect(audioCtx.destination);
}

// --- Dynamic Ambient Synth Generator ---
function startMusicEngine() {
  initAudio();
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  if (isPlaying) return;

  // Cyber Chord Frequencies (Hz): C minor 9th Ambient Chord (C3, Eb3, G3, Bb3, D4)
  const chordFreqs = [130.81, 155.56, 196.00, 233.08, 293.66];

  chordFreqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Subtle LFO modulation for warm analog pulse
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.value = 0.2 + idx * 0.1;
    lfoGain.gain.value = 4;
    lfo.connect(osc.frequency);
    lfo.start();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450 + idx * 120, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start();
    ambientOscillators.push({ osc, lfo, gainNode });
  });

  isPlaying = true;
  updateAudioUI();
}

function stopMusicEngine() {
  ambientOscillators.forEach(({ osc, lfo }) => {
    try {
      osc.stop();
      lfo.stop();
    } catch (e) {}
  });
  ambientOscillators = [];
  isPlaying = false;
  updateAudioUI();
}

// --- Toggle Audio ---
function toggleAudio() {
  playClickSound();
  if (isPlaying) {
    stopMusicEngine();
  } else {
    startMusicEngine();
  }
}

function setVolume(val) {
  audioVolume = parseFloat(val);
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(audioVolume, audioCtx.currentTime);
  }
}

// --- Update Audio Player UI ---
function updateAudioUI() {
  const equalizer = document.getElementById('equalizer');
  const audioLabel = document.getElementById('audioLabel');
  const optMusicBtn = document.getElementById('optMusicBtn');

  if (isPlaying) {
    if (equalizer) equalizer.classList.add('playing');
    if (audioLabel) audioLabel.textContent = 'MUSIC ON';
    if (optMusicBtn) optMusicBtn.textContent = 'MUTE MUSIC';
  } else {
    if (equalizer) equalizer.classList.remove('playing');
    if (audioLabel) audioLabel.textContent = 'MUSIC OFF';
    if (optMusicBtn) optMusicBtn.textContent = 'START MUSIC';
  }
}

// --- Sci-Fi Click SFX ---
function playClickSound() {
  try {
    initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
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

        // Navbar Visibility: Hide on home slide, show on slides 2, 3, 4
        if (id === 'home') {
          if (navbar) navbar.classList.add('hidden');
        } else {
          if (navbar) navbar.classList.remove('hidden');
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
