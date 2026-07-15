/* =====================================================================
   MY KUCHUPUCHU ❤️ — SCRIPT
   Sections:
   1. Utilities
   2. Scene Navigation
   3. Star Field
   4. Floating Hearts
   5. Scene 1 — Teddy Wake
   6. Scene 2 — Park Walk
   7. Scene 3 — Letter Typewriter
   8. Scene 4 — Question (escaping NO / YES celebration)
   9. Confetti & Fireworks
   10. Ending / Replay
   11. Init
   ===================================================================== */

   (function () {
    'use strict';
  
    /* -------------------------------------------------------------------
       1. UTILITIES
       ------------------------------------------------------------------- */
    const $ = (selector, scope) => (scope || document).querySelector(selector);
    const $all = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));
    const randomBetween = (min, max) => Math.random() * (max - min) + min;
    const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));
    const pick = (arr) => arr[randomInt(0, arr.length - 1)];
  
    /* -------------------------------------------------------------------
       2. SCENE NAVIGATION
       ------------------------------------------------------------------- */
    const scenes = $all('.scene');
  
    function goToScene(sceneId) {
      scenes.forEach((scene) => scene.classList.remove('scene--active'));
      const target = document.getElementById(sceneId);
      if (target) {
        target.classList.add('scene--active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onSceneEnter(sceneId);
      }
    }
  
    function onSceneEnter(sceneId) {
      if (sceneId === 'scene-2') startParkStory();
      if (sceneId === 'scene-3') startLetter();
      if (sceneId === 'scene-4') resetQuestionScene();
      if (sceneId === 'scene-5') playEnding();
    }
  
    /* -------------------------------------------------------------------
       3. STAR FIELD (Scene 1)
       ------------------------------------------------------------------- */
    function buildStarField() {
      const field = $('#star-field');
      if (!field) return;
      const starCount = 60;
      const fragment = document.createDocumentFragment();
  
      for (let i = 0; i < starCount; i += 1) {
        const star = document.createElement('span');
        star.className = 'sky__star';
        star.style.top = `${randomBetween(0, 70)}%`;
        star.style.left = `${randomBetween(0, 100)}%`;
        star.style.animationDuration = `${randomBetween(1.5, 4)}s`;
        star.style.animationDelay = `${randomBetween(0, 4)}s`;
        fragment.appendChild(star);
      }
      field.appendChild(fragment);
    }
  
    /* -------------------------------------------------------------------
       4. FLOATING HEARTS (shared generator used by every scene)
       ------------------------------------------------------------------- */
    const heartEmojis = ['❤️', '💗', '💖', '💕', '💞'];
  
    function spawnHearts(containerId, count, duration) {
      const container = document.getElementById(containerId);
      if (!container) return;
  
      for (let i = 0; i < count; i += 1) {
        const heart = document.createElement('span');
        heart.className = 'floating-hearts__item';
        heart.textContent = pick(heartEmojis);
        heart.style.left = `${randomBetween(4, 96)}%`;
        heart.style.fontSize = `${randomBetween(1, 2.1)}rem`;
        heart.style.setProperty('--drift', `${randomBetween(-40, 40)}px`);
        heart.style.animationDuration = `${duration || randomBetween(4, 7)}s`;
        heart.style.animationDelay = `${randomBetween(0, 1.2)}s`;
        container.appendChild(heart);
  
        heart.addEventListener('animationend', () => heart.remove());
      }
    }
  
    function startAmbientHearts(containerId, intervalMs, batchSize) {
      spawnHearts(containerId, batchSize);
      return setInterval(() => spawnHearts(containerId, batchSize), intervalMs);
    }
  
    /* -------------------------------------------------------------------
       5. SCENE 1 — TEDDY WAKE
       ------------------------------------------------------------------- */
    function initTeddyScene() {
      const teddy = $('#teddy');
      const wakeButton = $('#btn-wake-teddy');
      if (!wakeButton) return;
  
      wakeButton.addEventListener('click', () => {
        teddy.classList.add('teddy--talking');
        spawnHearts('hearts-scene-1', 14, 5);
        wakeButton.disabled = true;
  
        setTimeout(() => {
          goToScene('scene-2');
        }, 2200);
      });
    }
  
    /* -------------------------------------------------------------------
       6. SCENE 2 — PARK WALK
       ------------------------------------------------------------------- */
    let parkStoryStarted = false;
  
    function startParkStory() {
      if (parkStoryStarted) return;
      parkStoryStarted = true;
  
      const stage = $('.park__stage');
      stage.classList.add('park__stage--walking');
  
      setTimeout(() => {
        stage.classList.remove('park__stage--walking');
        stage.classList.add('park__stage--met');
        spawnHearts('hearts-scene-2', 16, 5);
      }, 2500);
    }
  
    function initParkScene() {
      const readLetterButton = $('#btn-read-letter');
      readLetterButton.addEventListener('click', () => goToScene('scene-3'));
    }
  
    /* -------------------------------------------------------------------
       7. SCENE 3 — LETTER TYPEWRITER
       ------------------------------------------------------------------- */
    const letterMessage = `My Dear Kuchupuchu ❤️
  
  Every day feels incomplete without you.
  I miss your smile.
  I miss your laugh.
  I miss your voice.
  I miss annoying you.
  I miss every little moment we shared.
  
  No matter how far we are,
  my heart always finds yours.
  
  I love you more than words can ever explain.
  
  Forever Yours,
  Rahul ❤️`;
  
    let letterStarted = false;
  
    function startLetter() {
      if (letterStarted) return;
      letterStarted = true;
  
      const textEl = $('#letter-text');
      const cursorEl = $('#letter-cursor');
      const nextButton = $('#btn-one-more-question');
      let index = 0;
  
      function typeNextCharacter() {
        if (index < letterMessage.length) {
          textEl.textContent += letterMessage.charAt(index);
          index += 1;
          const char = letterMessage.charAt(index - 1);
          const delay = char === '\n' ? 220 : randomBetween(18, 42);
          setTimeout(typeNextCharacter, delay);
        } else {
          cursorEl.classList.add('letter__cursor--done');
          nextButton.classList.remove('btn--hidden');
          nextButton.classList.add('btn--visible');
        }
      }
  
      setTimeout(typeNextCharacter, 900);
    }
  
    function initLetterScene() {
      const nextButton = $('#btn-one-more-question');
      nextButton.addEventListener('click', () => goToScene('scene-4'));
    }
  
    /* -------------------------------------------------------------------
       8. SCENE 4 — GROW OUR LOVE (interactive flower)
       ------------------------------------------------------------------- */
    const GROW_TARGET = 6;
    const STEM_STEP_PX = 20;
    const POT_HEIGHT_PX = 46;
    const growMessages = [
      'Tap the flower to water it',
      'A little seed of love 🌱',
      "It's starting to sprout...",
      'Growing a bit taller 🌿',
      'A bud is forming 🌸',
      'Almost ready to bloom...',
      "It's blooming! 💐",
    ];
  
    let growStage = 0;
    let growCompleted = false;
  
    function clearGameState() {
      growStage = 0;
      growCompleted = false;
      applyGrowStage();
    }
  
    function resetQuestionScene() {
      clearGameState();
    }
  
    function applyGrowStage() {
      const bloom = $('#bloom');
      const stem = $('#bloom-stem');
      const head = $('#bloom-head');
      const counter = $('#grow-counter');
      const hint = $('#grow-hint');
      const waterButton = $('#btn-water');
  
      const stemHeight = growStage * STEM_STEP_PX;
      stem.style.height = `${stemHeight}px`;
      head.style.bottom = `${POT_HEIGHT_PX + stemHeight - 6}px`;
  
      bloom.classList.toggle('bloom--leaf-left', growStage >= 2);
      bloom.classList.toggle('bloom--leaf-right', growStage >= 3);
      bloom.classList.toggle('bloom--bud', growStage >= 4 && growStage < GROW_TARGET);
      bloom.classList.toggle('bloom--bloom', growStage >= GROW_TARGET);
  
      counter.textContent = `${growStage} / ${GROW_TARGET} waterings`;
      hint.textContent = growMessages[growStage];
      waterButton.disabled = growCompleted;
    }
  
    function initQuestionScene() {
      const waterButton = $('#btn-water');
  
      waterButton.addEventListener('click', () => {
        if (growCompleted || growStage >= GROW_TARGET) return;
  
        growStage += 1;
        applyGrowStage();
  
        if (growStage >= GROW_TARGET) {
          completeGrowScene();
        }
      });
    }
  
    function completeGrowScene() {
      growCompleted = true;
      $('#btn-water').disabled = true;
  
      launchConfetti();
      launchFireworks();
      spawnHearts('hearts-scene-4', 24, 6);
  
      setTimeout(() => goToScene('scene-5'), 2600);
    }
  
    /* -------------------------------------------------------------------
       9. CONFETTI & FIREWORKS
       ------------------------------------------------------------------- */
    const confettiColors = ['#ffd1e8', '#d9c8ff', '#ffe3c2', '#c7f2e3', '#ff9ec7', '#cfe8ff'];
  
    function launchConfetti() {
      const layer = $('#confetti-layer');
      const pieceCount = 60;
  
      for (let i = 0; i < pieceCount; i += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${randomBetween(0, 100)}%`;
        piece.style.background = pick(confettiColors);
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = `${randomBetween(2.4, 4.2)}s`;
        piece.style.animationDelay = `${randomBetween(0, 0.8)}s`;
        layer.appendChild(piece);
  
        piece.addEventListener('animationend', () => piece.remove());
      }
    }
  
    function launchFireworks() {
      const layer = $('#fireworks-layer');
      const burstCount = 5;
  
      for (let b = 0; b < burstCount; b += 1) {
        setTimeout(() => {
          const originX = randomBetween(15, 85);
          const originY = randomBetween(15, 55);
          const color = pick(confettiColors);
          const sparkCount = 18;
  
          for (let s = 0; s < sparkCount; s += 1) {
            const spark = document.createElement('span');
            spark.className = 'firework';
            const angle = (Math.PI * 2 * s) / sparkCount;
            const distance = randomBetween(50, 110);
            spark.style.left = `${originX}%`;
            spark.style.top = `${originY}%`;
            spark.style.background = color;
            spark.style.boxShadow = `0 0 8px 2px ${color}`;
            spark.style.setProperty('--fx', `${Math.cos(angle) * distance}px`);
            spark.style.setProperty('--fy', `${Math.sin(angle) * distance}px`);
            spark.style.animationDuration = '1s';
            layer.appendChild(spark);
  
            spark.addEventListener('animationend', () => spark.remove());
          }
        }, b * 350);
      }
    }
  
    /* -------------------------------------------------------------------
       10. ENDING / REPLAY
       ------------------------------------------------------------------- */
    let endingPlayed = false;
  
    function playEnding() {
      if (endingPlayed) return;
      endingPlayed = true;
      startAmbientHearts('hearts-scene-5', 900, 2);
    }
  
    function initEndingScene() {
      const replayButton = $('#btn-replay');
      replayButton.addEventListener('click', () => {
        resetExperience();
        goToScene('scene-1');
      });
    }
  
    function resetExperience() {
      parkStoryStarted = false;
      letterStarted = false;
      endingPlayed = false;
  
      $('.park__stage').classList.remove('park__stage--walking', 'park__stage--met');
      $('#letter-text').textContent = '';
      $('#letter-cursor').classList.remove('letter__cursor--done');
      $('#btn-one-more-question').classList.add('btn--hidden');
      $('#btn-one-more-question').classList.remove('btn--visible');
      $('#teddy').classList.remove('teddy--talking');
      $('#btn-wake-teddy').disabled = false;
      clearGameState();
    }
  
    /* -------------------------------------------------------------------
       11. INIT
       ------------------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
      buildStarField();
      startAmbientHearts('hearts-scene-1', 1400, 1);
  
      initTeddyScene();
      initParkScene();
      initLetterScene();
      initQuestionScene();
      initEndingScene();
    });
  })();
