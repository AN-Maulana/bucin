/**
 * ==========================================================================
 * ROMANTIC JAVASCRIPT LOGIC — INDRISARI ISMAIL ❤️
 * Vanilla JS — Interactive, Real-Time Counter, Canvas Particles, Lightbox,
 * Love Letter, Mini Game & Audio Controller
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     ⚙️ KONFIGURASI UTAMA (MUDAH DIEDIT)
     ========================================================================== */
  const CONFIG = {
    // GANTI TANGGAL JADIAN DI SINI (Format: YYYY-MM-DDTHH:mm:ss)
    anniversaryDate: new Date('2020-08-25T00:00:00'),
    
    // GANTI NAMA PACAR DI SINI
    girlfriendName: 'Indrisari Ismail',
    girlfriendNickname: 'Kiki',
    
    // GANTI PESAN TYPING DI HERO SECTION
    typingMessages: [
      'Untuk syg (kiki), bidadari tercantik Lana ❤️',
      'Senyum manis kiki adalah bahagia Lana ✨',
      'Terima kasih sudah hadir di hidup Lana 🌹',
      'Lana sayang kiki hari ini, esok, & selamanya 💖'
    ]
  };

  /* ==========================================================================
     1. BACKGROUND CANVAS PARTICLES (FLOATING HEARTS & SPARKLES)
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class RomanticParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 12 + 6;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.6 - 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.type = Math.random() > 0.4 ? 'heart' : 'circle';
      this.color = ['#ff758f', '#ff4d6d', '#cd9cf2', '#ffccd5'][Math.floor(Math.random() * 4)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const s = this.size * 0.6;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-s, -s, -s * 1.5, s * 0.5, 0, s * 1.4);
        ctx.bezierCurveTo(s * 1.5, s * 0.5, s, -s, 0, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Generate initial particles
  const particleCount = window.innerWidth < 600 ? 25 : 50;
  for (let i = 0; i < particleCount; i++) {
    const p = new RomanticParticle();
    p.y = Math.random() * height; // scatter vertically
    particles.push(p);
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  /* ==========================================================================
     2. CLICK / TOUCH BURST OF HEARTS EVERYWHERE
     ========================================================================== */
  document.addEventListener('click', (e) => {
    // Avoid triggering if clicked on specific modals
    if (e.target.closest('#modal-close') || e.target.closest('.modal-nav-btn')) return;
    createClickHeartBurst(e.clientX, e.clientY);
  });

  function createClickHeartBurst(x, y) {
    const emojis = ['💖', '❤️', '💕', '✨', '🌸', '🥰'];
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('span');
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.position = 'fixed';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.fontSize = `${Math.random() * 14 + 16}px`;
      el.style.pointerEvents = 'none';
      el.style.zIndex = '99999';
      el.style.transition = 'all 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(el);

      const angle = (Math.PI * 2 / 6) * i + (Math.random() * 0.4);
      const distance = Math.random() * 60 + 30;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - 40;

      requestAnimationFrame(() => {
        el.style.transform = `translate(${destX}px, ${destY}px) scale(0)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 950);
    }
  }

  /* ==========================================================================
     3. AUDIO CONTROLLER & SYNTHESIZER FALLBACK
     ========================================================================== */
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isMusicPlaying = false;
  let synthAudioCtx = null;
  let synthInterval = null;

  // Romantic ambient music melody fallback (Web Audio API)
  function playRomanticSynth() {
    if (synthAudioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      synthAudioCtx = new AudioContext();
      
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C Major
        [220.00, 261.63, 329.63, 440.00], // A Minor
        [174.61, 220.00, 261.63, 349.23], // F Major
        [196.00, 246.94, 293.66, 392.00]  // G Major
      ];
      let chordIndex = 0;

      function playChord() {
        if (!synthAudioCtx || synthAudioCtx.state === 'suspended') return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          setTimeout(() => {
            if (!synthAudioCtx) return;
            const osc = synthAudioCtx.createOscillator();
            const gain = synthAudioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, synthAudioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.04, synthAudioCtx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioCtx.currentTime + 2.5);

            osc.connect(gain);
            gain.connect(synthAudioCtx.destination);

            osc.start();
            osc.stop(synthAudioCtx.currentTime + 2.6);
          }, idx * 220);
        });
      }

      playChord();
      synthInterval = setInterval(playChord, 3600);
    } catch (e) {
      console.log('Web Audio not available', e);
    }
  }

  function stopRomanticSynth() {
    if (synthInterval) clearInterval(synthInterval);
    if (synthAudioCtx) {
      synthAudioCtx.close();
      synthAudioCtx = null;
    }
  }

  function startMusic() {
    isMusicPlaying = true;
    musicToggle.classList.add('playing');
    
    // Try to play mp3 file first
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to soft generative romantic synth
        playRomanticSynth();
      });
    }
  }

  function pauseMusic() {
    isMusicPlaying = false;
    musicToggle.classList.remove('playing');
    bgMusic.pause();
    stopRomanticSynth();
  }

  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  });

  /* ==========================================================================
     4. OPENING SCREEN LOGIC
     ========================================================================== */
  const openingScreen = document.getElementById('opening-screen');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const mainContent = document.getElementById('main-content');

  btnOpenGift.addEventListener('click', (e) => {
    // Confetti effect
    triggerConfettiBurst();

    // Start music smoothly
    startMusic();

    // Fade out opening screen
    openingScreen.classList.add('fade-out');
    mainContent.classList.remove('hidden');

    setTimeout(() => {
      openingScreen.style.display = 'none';
      initScrollReveal();
    }, 800);
  });

  /* ==========================================================================
     5. HERO TYPING ANIMATION
     ========================================================================== */
  const typingElement = document.getElementById('typing-text');
  let messageIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentMessage = CONFIG.typingMessages[messageIndex];

    if (isDeleting) {
      typingElement.textContent = currentMessage.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentMessage.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentMessage.length) {
      typeSpeed = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      messageIndex = (messageIndex + 1) % CONFIG.typingMessages.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  /* ==========================================================================
     6. LOVE COUNTER REAL-TIME
     ========================================================================== */
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateLoveCounter() {
    const now = new Date();
    const diff = now - CONFIG.anniversaryDate;

    if (diff < 0) {
      // If date is in future
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    daysEl.textContent = days;
    hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateLoveCounter, 1000);
  updateLoveCounter();

  /* ==========================================================================
     7. SCROLL PROGRESS BAR & SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => observer.observe(item));
  }
  initScrollReveal();

  /* ==========================================================================
     8. LOVE LETTER ENVELOPE INTERACTION
     ========================================================================== */
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSeal = document.getElementById('wax-seal');
  const letterCloseBtn = document.getElementById('letter-close-btn');

  function openLetter() {
    if (!envelopeWrapper.classList.contains('open')) {
      envelopeWrapper.classList.add('open');
      triggerConfettiBurst();
    }
  }

  function closeLetter(e) {
    e.stopPropagation();
    envelopeWrapper.classList.remove('open');
  }

  waxSeal.addEventListener('click', openLetter);
  envelopeWrapper.addEventListener('click', (e) => {
    if (!envelopeWrapper.classList.contains('open')) {
      openLetter();
    }
  });
  letterCloseBtn.addEventListener('click', closeLetter);

  /* ==========================================================================
     9. PHOTO MEMORY LIGHTBOX MODAL
     ========================================================================== */
  const polaroids = document.querySelectorAll('.polaroid-card');
  const photoModal = document.getElementById('photo-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalClose = document.getElementById('modal-close');
  const modalPrev = document.getElementById('modal-prev');
  const modalNext = document.getElementById('modal-next');

  let currentPhotoIndex = 0;
  const photoData = [];

  polaroids.forEach((card, index) => {
    const imgSrc = card.dataset.imgSrc;
    const fallback = card.dataset.fallback;
    const caption = card.dataset.caption;
    photoData.push({ imgSrc, fallback, caption });

    card.addEventListener('click', () => {
      openPhotoModal(index);
    });
  });

  function openPhotoModal(index) {
    currentPhotoIndex = index;
    const data = photoData[index];
    modalImg.src = data.imgSrc;
    modalImg.onerror = () => {
      modalImg.src = data.fallback;
    };
    modalCaption.textContent = data.caption;
    photoModal.classList.add('active');
    photoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closePhotoModal() {
    photoModal.classList.remove('active');
    photoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closePhotoModal);
  photoModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closePhotoModal();
    }
  });

  modalPrev.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoData.length) % photoData.length;
    openPhotoModal(currentPhotoIndex);
  });

  modalNext.addEventListener('click', () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoData.length;
    openPhotoModal(currentPhotoIndex);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoModal();
      closeSpecialPopup();
      closeSecretModal();
    }
    if (photoModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') modalPrev.click();
      if (e.key === 'ArrowRight') modalNext.click();
    }
  });

  /* ==========================================================================
     10. SPECIAL BUTTON ("JANGAN KLIK INI ❤️")
     ========================================================================== */
  const btnSpecial = document.getElementById('btn-special');
  const prankCounterText = document.getElementById('prank-counter-text');
  const specialPopupModal = document.getElementById('special-popup-modal');
  const btnCloseSpecialPopup = document.getElementById('btn-close-special-popup');
  let prankClickCount = 0;

  const prankSteps = [
    'Yakin mau klik? 🥺',
    'Serius nih? 🙈',
    'Terakhir nih... jangan nyesel yaa! 😜',
    'Yaudah... Lana mau bilang sesuatu... 🥰'
  ];

  btnSpecial.addEventListener('click', () => {
    prankClickCount++;

    if (prankClickCount <= prankSteps.length) {
      btnSpecial.querySelector('.btn-text').textContent = prankSteps[prankClickCount - 1];
      prankCounterText.textContent = `(Tingkat penasaran Kiki: ${prankClickCount * 25}%)`;
    }

    if (prankClickCount >= 4) {
      setTimeout(() => {
        openSpecialPopup();
      }, 400);
    }
  });

  function openSpecialPopup() {
    specialPopupModal.classList.add('active');
    specialPopupModal.setAttribute('aria-hidden', 'false');
    triggerConfettiBurst();
  }

  function closeSpecialPopup() {
    specialPopupModal.classList.remove('active');
    specialPopupModal.setAttribute('aria-hidden', 'true');
    // Reset prank button
    prankClickCount = 0;
    btnSpecial.querySelector('.btn-text').textContent = 'Jangan Klik Ini ❤️';
    prankCounterText.textContent = '';
  }

  btnCloseSpecialPopup.addEventListener('click', closeSpecialPopup);
  specialPopupModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeSpecialPopup();
    }
  });

  /* ==========================================================================
     11. MINI LOVE GAME ("SEBERAPA KENAL KAMU SAMA AKU? 😆")
     ========================================================================== */
  const quizQuestions = [
    {
      q: '1. Siapa yang paling bucin di antara kita berdua? 🙈',
      options: ['Lana dong pastinya!', 'Kiki yang paling bucin!', 'Dua-duanya bucin parah! 💕']
    },
    {
      q: '2. Siapa yang lebih sering kangen duluan? 🥺',
      options: ['Lana tiap detik kangen', 'Kiki diam-diam kangen', 'Sama-sama gak bisa jauh! 🥰']
    },
    {
      q: '3. Siapa yang lebih dulu jatuh cinta? 💘',
      options: ['Lana dari pandangan pertama', 'Kiki yang kepincut duluan', 'Takdir manis kita berdua! 🌹']
    },
    {
      q: '4. Siapa yang lebih susah bilang "nggak apa-apa" padahal ada apa-apa? 🤭',
      options: ['Kiki kalau lagi gemas', 'Lana kalau lagi overthinking', 'Saling kode-kodean manis! 💌']
    },
    {
      q: '5. Siapa yang paling sering bikin kangen setiap hari? 💖',
      options: ['Senyum manis Kiki', 'Tawa gemas Kiki', 'Semua hal tentang Kiki! ✨']
    }
  ];

  let currentQuizIndex = 0;
  const quizScreen = document.getElementById('quiz-screen');
  const quizResultScreen = document.getElementById('quiz-result-screen');
  const quizQuestionEl = document.getElementById('quiz-question');
  const quizOptionsEl = document.getElementById('quiz-options');
  const quizNumberBadge = document.getElementById('quiz-number');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const btnReplayQuiz = document.getElementById('btn-replay-quiz');

  function renderQuizQuestion() {
    const qData = quizQuestions[currentQuizIndex];
    quizQuestionEl.textContent = qData.q;
    quizNumberBadge.textContent = `Pertanyaan ${currentQuizIndex + 1} dari ${quizQuestions.length}`;
    quizProgressBar.style.width = `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%`;

    quizOptionsEl.innerHTML = '';
    qData.options.forEach(optionText => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optionText;
      btn.addEventListener('click', () => {
        handleQuizAnswer();
      });
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleQuizAnswer() {
    triggerConfettiBurst(20);
    if (currentQuizIndex < quizQuestions.length - 1) {
      currentQuizIndex++;
      renderQuizQuestion();
    } else {
      // Finish quiz
      quizScreen.classList.add('hidden');
      quizScreen.style.display = 'none';
      quizResultScreen.classList.remove('hidden');
      triggerConfettiBurst(60);
    }
  }

  btnReplayQuiz.addEventListener('click', () => {
    currentQuizIndex = 0;
    quizResultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.style.display = 'block';
    renderQuizQuestion();
  });

  renderQuizQuestion();

  /* ==========================================================================
     12. FUTURE WISHES TOGGLE
     ========================================================================== */
  const wishCards = document.querySelectorAll('.wish-card');
  wishCards.forEach(card => {
    const checkBtn = card.querySelector('.wish-check');
    checkBtn.addEventListener('click', () => {
      checkBtn.classList.toggle('checked');
      if (checkBtn.classList.contains('checked')) {
        checkBtn.textContent = '✨ Terwujud Bareng ❤️';
        triggerConfettiBurst(15);
      } else {
        checkBtn.textContent = '❤️ Wishlist';
      }
    });
  });

  /* ==========================================================================
     13. SECRET MESSAGE MODAL
     ========================================================================== */
  const btnSecretMsg = document.getElementById('btn-secret-msg');
  const secretModal = document.getElementById('secret-modal');
  const btnCloseSecret = document.getElementById('btn-close-secret');
  const btnSecretAck = document.getElementById('btn-secret-ack');

  function openSecretModal() {
    secretModal.classList.add('active');
    secretModal.setAttribute('aria-hidden', 'false');
    triggerConfettiBurst();
  }

  function closeSecretModal() {
    secretModal.classList.remove('active');
    secretModal.setAttribute('aria-hidden', 'true');
  }

  btnSecretMsg.addEventListener('click', openSecretModal);
  btnCloseSecret.addEventListener('click', closeSecretModal);
  btnSecretAck.addEventListener('click', closeSecretModal);
  secretModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeSecretModal();
    }
  });

  /* ==========================================================================
     14. CONFETTI BURST ANIMATION
     ========================================================================== */
  function triggerConfettiBurst(count = 45) {
    const colors = ['#ff758f', '#ff4d6d', '#ffd166', '#06d6a0', '#118ab2', '#cd9cf2'];
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = '50vw';
      confetti.style.top = '50vh';
      confetti.style.width = `${Math.random() * 10 + 6}px`;
      confetti.style.height = `${Math.random() * 8 + 6}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '100000';
      confetti.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(confetti);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * window.innerWidth * 0.45;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance - Math.random() * 150;
      const rot = Math.random() * 720 - 360;

      requestAnimationFrame(() => {
        confetti.style.transform = `translate(${destX}px, ${destY}px) rotate(${rot}deg) scale(0.5)`;
        confetti.style.opacity = '0';
      });

      setTimeout(() => confetti.remove(), 1300);
    }
  }

});
