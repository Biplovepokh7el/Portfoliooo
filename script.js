/* ==========================================================================
   BIPLOVE POKHREL - PORTFOLIO INTERACTION, AUDIO ENGINE & MODAL SYSTEM
   ========================================================================== */

// --- Global Audio Engine Variables ---
let bgAudio = null;
let isAudioPlaying = false;
let isMuted = false;
let audioVolume = 0.5;
let sfxCtx = null;
let userInteracted = false;

// --- Initialize Audio Element & Web Audio API for Sci-Fi SFX ---
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

// --- Autoplay Music Engine ---
function attemptAutoplay() {
  initAudio();
  if (!bgAudio) return;

  bgAudio.volume = audioVolume;
  const playPromise = bgAudio.play();

  if (playPromise !== undefined) {
    playPromise.then(() => {
      isAudioPlaying = true;
      isMuted = false;
      updateAudioUI();
    }).catch(err => {
      console.log("Autoplay waiting for first visitor gesture:", err.message);
      isAudioPlaying = false;
      updateAudioUI();
      // Setup global gesture listener for instant play on first tap/scroll/click
      setupFirstGestureAutoplay();
    });
  }
}

// --- First Gesture Audio Trigger (Fallback for Browser Autoplay Restrictions) ---
function setupFirstGestureAutoplay() {
  const handleFirstGesture = () => {
    if (userInteracted) return;
    userInteracted = true;
    initAudio();
    if (bgAudio && bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        isMuted = false;
        updateAudioUI();
      }).catch(() => {});
    }
    // Remove listeners once triggered
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
      window.removeEventListener(evt, handleFirstGesture);
    });
  };

  ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
    window.addEventListener(evt, handleFirstGesture, { once: true });
  });
}

// --- Toggle Mute / Unmute (Single Button Control) ---
function toggleMute() {
  playClickSound();
  initAudio();
  if (!bgAudio) return;

  if (bgAudio.paused) {
    // If currently paused, play and unmute
    bgAudio.muted = false;
    bgAudio.play().then(() => {
      isAudioPlaying = true;
      isMuted = false;
      updateAudioUI();
    }).catch(() => {});
  } else if (bgAudio.muted) {
    // Unmute
    bgAudio.muted = false;
    isMuted = false;
    updateAudioUI();
  } else {
    // Mute
    bgAudio.muted = true;
    isMuted = true;
    updateAudioUI();
  }
}

function setVolume(val) {
  audioVolume = parseFloat(val);
  initAudio();
  if (bgAudio) {
    bgAudio.volume = audioVolume;
  }
  const modalVolumeSlider = document.getElementById('modalVolumeSlider');
  if (modalVolumeSlider) modalVolumeSlider.value = audioVolume;
}

// --- Update Audio UI State ---
function updateAudioUI() {
  const muteBtn = document.getElementById('muteToggleBtn');
  const muteIcon = document.getElementById('muteIcon');
  const muteBtnText = document.getElementById('muteBtnText');
  const optMusicBtn = document.getElementById('optMusicBtn');

  const currentlyMuted = !bgAudio || bgAudio.paused || bgAudio.muted;

  if (!currentlyMuted) {
    if (muteIcon) muteIcon.className = 'fa-solid fa-volume-high';
    if (muteBtnText) muteBtnText.textContent = 'MUTE';
    if (muteBtn) muteBtn.classList.add('playing');
    if (optMusicBtn) optMusicBtn.textContent = 'MUTE';
  } else {
    if (muteIcon) muteIcon.className = 'fa-solid fa-volume-xmark';
    if (muteBtnText) muteBtnText.textContent = 'UNMUTE';
    if (muteBtn) muteBtn.classList.remove('playing');
    if (optMusicBtn) optMusicBtn.textContent = 'UNMUTE';
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

    gain.gain.setValueAtTime(0.1 * audioVolume, sfxCtx.currentTime);
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

// --- Projects Portfolio Data ---
const projectsData = {
  project1: {
    title: "CYBERPUNK BRANDING & VISUAL IDENTITY",
    category: "Graphic Design / Brand Identity",
    image: "images/project1.jpg",
    description: "A comprehensive brand identity design featuring glowing neon aesthetics, sleek typography, and high-impact cybernetic visuals tailored for futuristic digital media.",
    tools: ["Photoshop", "Lightroom", "Illustrator"]
  },
  project2: {
    title: "FUTURISTIC USER INTERFACE CONCEPT",
    category: "UI/UX & Web Development",
    image: "images/project2.jpg",
    description: "A dark-mode cyberpunk dashboard interface designed for modern web applications. Focuses on intuitive user experience, glow effects, and responsive visual hierarchy.",
    tools: ["VS Code", "Photoshop", "HTML/CSS"]
  },
  project3: {
    title: "3D CYBERNETIC VISUAL RENDER",
    category: "Digital Art & Editing",
    image: "images/project3.jpg",
    description: "An intricate abstract 3D visual composition showcasing advanced lighting, reflections, color grading, and dynamic contrast effects.",
    tools: ["DaVinci Resolve", "Photoshop", "Alight Motion"]
  },
  project4: {
    title: "VENOM - CHARACTER ARTWORK POSTER",
    category: "Poster Design / Digital Graphic",
    image: "images/project4.jpg",
    description: "High-octane character poster art incorporating dramatic lighting effects, custom typography, and deep crimson contrast for maximum visual drama.",
    tools: ["Photoshop", "Lightroom", "PicsArt"]
  },
  project5: {
    title: "NEON CITY VISUAL CONCEPT",
    category: "Graphic Design & Concept Art",
    image: "images/project5.jpg",
    description: "A vibrant atmospheric visual composition capturing futuristic urban landscapes with cyan and magenta neon highlights.",
    tools: ["Photoshop", "CapCut", "Lightroom"]
  },
  project6: {
    title: "STORY 'C - EDITORIAL TYPOGRAPHY",
    category: "Typography & Portrait Art",
    image: "images/project6.jpg",
    description: "Featured portrait editorial poster emphasizing bold layout composition, high-contrast monochrome portraiture, and clean modern typographic hierarchy.",
    tools: ["Photoshop", "Lightroom", "VS Code"]
  },
  project7: {
    title: "VALIR - ACTION HERO CONCEPT POSTER",
    category: "Game Art & Banner Design",
    image: "images/project7.jpg",
    description: "An energetic action-themed visual poster featuring explosive color palettes, particle glow effects, and custom hero branding.",
    tools: ["Photoshop", "PicsArt", "Illustrator"]
  }
};

// Current active project image URL for full-size viewing
let currentActiveProjectImg = '';

// --- Project Modal Lightbox Controls ---
function openProjectModal(projectId) {
  playClickSound();
  const data = projectsData[projectId];
  if (!data) return;

  currentActiveProjectImg = data.image;

  const modal = document.getElementById('projectModal');
  const titleElem = document.getElementById('modalProjectTitle');
  const imgElem = document.getElementById('modalProjectImg');
  const tagsElem = document.getElementById('modalProjectTags');
  const descElem = document.getElementById('modalProjectDesc');
  const toolsElem = document.getElementById('modalProjectTools');
  const fullResBtn = document.getElementById('modalFullResBtn');

  if (titleElem) titleElem.innerHTML = `<i class="fa-solid fa-eye"></i> ${data.title}`;
  if (imgElem) {
    imgElem.src = data.image;
    imgElem.alt = data.title;
  }
  if (tagsElem) {
    tagsElem.innerHTML = `<span class="project-category-badge"><i class="fa-solid fa-tag"></i> ${data.category}</span>`;
  }
  if (descElem) descElem.textContent = data.description;
  if (toolsElem) {
    toolsElem.innerHTML = data.tools.map(tool => `<span class="tool-badge">${tool}</span>`).join('');
  }
  if (fullResBtn) {
    fullResBtn.href = data.image;
  }

  if (modal) modal.classList.add('active');
}

// Open Full-Size Uncompressed Lightbox Viewer
function openFullImageFromModal() {
  if (currentActiveProjectImg) {
    openFullImage(currentActiveProjectImg);
  }
}

function openFullImage(imgUrl) {
  playClickSound();
  const fullModal = document.getElementById('fullImageModal');
  const fullImg = document.getElementById('fullSizeImg');
  if (fullImg) {
    fullImg.src = imgUrl;
  }
  if (fullModal) {
    fullModal.classList.add('active');
  }
}

// --- Generic Modal Controls ---
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

// Close active modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
    });
  }
});

// Close modal when clicking backdrop outside modal card
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});

// --- Window Scroll Observer for Sticky Navbar & Active Pills ---
document.addEventListener('DOMContentLoaded', () => {
  attemptAutoplay();

  const sections = document.querySelectorAll('.page-section');
  const navbar = document.getElementById('navbar');
  const pills = {
    'about': document.getElementById('pill-about'),
    'projects': document.getElementById('pill-projects'),
    'contact': document.getElementById('pill-contact')
  };

  const observerOptions = {
    root: null,
    threshold: 0.4
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Navbar Mode: home slide
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

