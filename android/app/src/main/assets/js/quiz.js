// ==========================================================================
// QUIZ & REVIEWER MODULE - STI 2G STUDY HUB
// Handles flashcards and practice test exam engine
// ==========================================================================

const QuizModule = {
  data: {},
  currentSubject: 'COSC1003',
  currentMode: 'flashcards', // 'flashcards' | 'exam'
  
  // Flashcard state
  currentFcIndex: 0,
  isFlipped: false,
  _flipping: false, // debounce guard

  // Exam state
  currentQIndex: 0,
  score: 0,
  hasAnswered: false,

  async init() {
    try {
      const res = await fetch('js/data/quizzes.json');
      this.data = await res.json();
    } catch (err) {
      console.warn('Fetch fallback to DEFAULT_QUIZZES', err);
      this.data = typeof DEFAULT_QUIZZES !== 'undefined' ? DEFAULT_QUIZZES : {};
    }
    this.renderSubjectSelector();
    this.render();
    this._initCelebrationOverlay();
  },

  setSubject(subjectCode) {
    this.currentSubject = subjectCode;
    this.currentFcIndex = 0;
    this.currentQIndex = 0;
    this.score = 0;
    this.isFlipped = false;
    this.hasAnswered = false;
    this.renderSubjectSelector();
    this.render();
  },

  setMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    this.render();
  },

  toggleSubjectDropdown() {
    const wrap = document.getElementById('quizSubjectDropdown');
    const menu = document.getElementById('quizSelectMenu');
    if (!wrap || !menu) return;

    if (menu.classList.contains('open')) {
      this.closeSubjectDropdown();
    } else {
      this.openSubjectDropdown();
    }
  },

  openSubjectDropdown() {
    const wrap = document.getElementById('quizSubjectDropdown');
    const menu = document.getElementById('quizSelectMenu');
    const trigger = document.getElementById('quizSelectTrigger');
    if (!wrap || !menu) return;

    menu.classList.add('open');
    if (trigger) trigger.classList.add('active');

    // Smooth staggered animation on items
    const items = menu.querySelectorAll('.custom-select-option');
    items.forEach((item, idx) => {
      item.style.setProperty('--idx', idx);
    });

    const handleOutsideClick = (e) => {
      if (!wrap.contains(e.target)) {
        this.closeSubjectDropdown();
        document.removeEventListener('click', handleOutsideClick);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick);
    }, 10);
  },

  closeSubjectDropdown() {
    const menu = document.getElementById('quizSelectMenu');
    const trigger = document.getElementById('quizSelectTrigger');
    if (menu) menu.classList.remove('open');
    if (trigger) trigger.classList.remove('active');
  },

  selectSubject(code) {
    this.closeSubjectDropdown();
    this.setSubject(code);
  },

  renderSubjectSelector() {
    const keys = Object.keys(this.data);
    if (keys.length === 0) return;

    // Update active trigger display
    const activeSub = this.data[this.currentSubject] || this.data[keys[0]];
    const codeEl = document.getElementById('quizSelectCode');
    const titleEl = document.getElementById('quizSelectTitle');
    if (codeEl) codeEl.textContent = this.currentSubject;
    if (titleEl && activeSub) titleEl.textContent = activeSub.subjectTitle;

    // Render custom options with smooth staggered list
    const menu = document.getElementById('quizSelectMenu');
    if (menu) {
      menu.innerHTML = keys.map((k, idx) => {
        const item = this.data[k];
        const isSelected = k === this.currentSubject;
        return `
          <div class="custom-select-option ${isSelected ? 'selected' : ''}" 
               style="--idx: ${idx};"
               onclick="QuizModule.selectSubject('${k}')">
            <span class="custom-option-code">${k}</span>
            <span class="custom-option-title">${item.subjectTitle}</span>
            ${isSelected ? '<span class="custom-option-check">✓</span>' : ''}
          </div>
        `;
      }).join('');
    }

    // Keep hidden select in sync
    const select = document.getElementById('quizSubjectSelect');
    if (select) {
      select.innerHTML = keys.map(k => `
        <option value="${k}">${k} - ${this.data[k].subjectTitle}</option>
      `).join('');
      select.value = this.currentSubject;
    }
  },

  render() {
    const flashcardView = document.getElementById('flashcardView');
    const examView = document.getElementById('examView');
    if (!flashcardView || !examView) return;

    if (this.currentMode === 'flashcards') {
      flashcardView.style.display = 'block';
      examView.style.display = 'none';
      this.renderFlashcard();
    } else {
      flashcardView.style.display = 'none';
      examView.style.display = 'block';
      this.renderExam();
    }
  },

  // -------------------------------------------------------------
  // FLASHCARD ENGINE
  // -------------------------------------------------------------
  renderFlashcard() {
    const sub = this.data[this.currentSubject];
    const cardEl = document.getElementById('activeFlashcard');
    const counterEl = document.getElementById('fcCounter');
    if (!sub || !sub.flashcards || sub.flashcards.length === 0) {
      if (cardEl) cardEl.innerHTML = '<div class="card-face card-front"><p>No flashcards loaded for this subject yet.</p></div>';
      return;
    }

    const fc = sub.flashcards[this.currentFcIndex];
    if (counterEl) counterEl.textContent = `Card ${this.currentFcIndex + 1} of ${sub.flashcards.length}`;

    // Reset flipped state
    this.isFlipped = false;
    this._flipping = false;
    if (cardEl) {
      cardEl.classList.remove('flipped', 'flip-shine');
      cardEl.innerHTML = `
        <div class="card-face card-front">
          <span class="card-tag">${fc.topic}</span>
          <p class="card-text">${fc.front}</p>
          <span class="card-hint">Tap card to reveal answer</span>
        </div>
        <div class="card-face card-back">
          <span class="card-tag">Explanation / Answer</span>
          <p class="card-text" style="font-size: 1.05rem;">${fc.back}</p>
          <span class="card-hint">Tap card to flip back</span>
        </div>
      `;
    }
  },

  flipCard() {
    const cardEl = document.getElementById('activeFlashcard');
    if (!cardEl || this._flipping) return;

    // Debounce: block during animation
    this._flipping = true;
    setTimeout(() => { this._flipping = false; }, 600);

    // Trigger shine sweep briefly
    cardEl.classList.add('flip-shine');
    setTimeout(() => cardEl.classList.remove('flip-shine'), 250);

    this.isFlipped = !this.isFlipped;
    cardEl.classList.toggle('flipped', this.isFlipped);
  },

  nextFlashcard() {
    const sub = this.data[this.currentSubject];
    if (!sub || !sub.flashcards) return;
    if (this.currentFcIndex < sub.flashcards.length - 1) {
      this.currentFcIndex++;
      this.renderFlashcard();
    }
  },

  prevFlashcard() {
    if (this.currentFcIndex > 0) {
      this.currentFcIndex--;
      this.renderFlashcard();
    }
  },

  // -------------------------------------------------------------
  // EXAM ENGINE
  // -------------------------------------------------------------
  renderExam() {
    const sub = this.data[this.currentSubject];
    const container = document.getElementById('examQuestionContainer');
    if (!container) return;

    if (!sub || !sub.questions || sub.questions.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding: 2rem; color: var(--text-muted);">No quiz questions loaded for this subject yet.</p>';
      return;
    }

    const q = sub.questions[this.currentQIndex];
    this.hasAnswered = false;

    container.innerHTML = `
      <div class="question-header">
        <span>Question ${this.currentQIndex + 1} of ${sub.questions.length}</span>
        <span>Score: ${this.score} / ${this.currentQIndex}</span>
      </div>
      <h3 class="question-title">${q.question}</h3>
      <div class="options-list">
        ${q.options.map((opt, i) => `
          <button class="option-btn" data-index="${i}" onclick="QuizModule.handleAnswer(${i})">
            <span style="display:inline-block; width: 24px; font-weight:700;">${String.fromCharCode(65 + i)}.</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
      <div id="quizExplanation" class="explanation-box">
        <strong>Rationale:</strong> ${q.explanation}
      </div>
      <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
        <button id="nextQuestionBtn" class="btn-primary" style="display: none;" onclick="QuizModule.nextQuestion()">
          Next Question &rarr;
        </button>
      </div>
    `;
  },

  handleAnswer(selectedIndex) {
    if (this.hasAnswered) return;
    this.hasAnswered = true;

    const sub = this.data[this.currentSubject];
    const q = sub.questions[this.currentQIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const explBox = document.getElementById('quizExplanation');
    const nextBtn = document.getElementById('nextQuestionBtn');

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctIndex) {
        btn.classList.add('correct');
      } else if (i === selectedIndex) {
        btn.classList.add('wrong');
      }
    });

    if (selectedIndex === q.correctIndex) {
      this.score++;
    }

    if (explBox) explBox.classList.add('visible');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  },

  nextQuestion() {
    const sub = this.data[this.currentSubject];
    if (this.currentQIndex < sub.questions.length - 1) {
      this.currentQIndex++;
      this.renderExam();
    } else {
      // Quiz complete
      const isPerfect = this.score === sub.questions.length;
      const percentage = Math.round((this.score / sub.questions.length) * 100);

      if (isPerfect) {
        // 🎉 Perfect score — show celebration!
        this._showCelebration(this.score, sub.questions.length);
      } else {
        // Normal result screen
        const container = document.getElementById('examQuestionContainer');
        const emoji = percentage >= 80 ? '🎯' : percentage >= 60 ? '📚' : '💪';
        container.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
            <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Quiz Complete!</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You scored <strong>${this.score} out of ${sub.questions.length}</strong> (${percentage}%)</p>
            <button class="btn-primary" onclick="QuizModule.resetQuiz()">Retry Subject Quiz</button>
          </div>
        `;
      }
    }
  },

  resetQuiz() {
    this.currentQIndex = 0;
    this.score = 0;
    this.hasAnswered = false;
    this.renderExam();
    this._hideCelebration();
  },

  // -------------------------------------------------------------
  // CELEBRATION ENGINE
  // -------------------------------------------------------------
  _initCelebrationOverlay() {
    if (document.getElementById('celebrationOverlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'celebrationOverlay';
    overlay.innerHTML = `
      <div class="celebration-card">
        <span class="celebration-emoji">🏆</span>
        <div class="celebration-title">Perfect Score!</div>
        <div class="celebration-score" id="celebScoreText">10 / 10</div>
        <div class="celebration-sub">You nailed every single question. Amazing work! 🔥</div>
        <button class="celebration-btn" onclick="QuizModule.resetQuiz()">
          🔄 Play Again
        </button>
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this._hideCelebration();
    });
    document.body.appendChild(overlay);
  },

  _showCelebration(score, total) {
    this._initCelebrationOverlay();
    const overlay = document.getElementById('celebrationOverlay');
    const scoreText = document.getElementById('celebScoreText');
    if (scoreText) scoreText.textContent = `${score} / ${total}`;

    overlay.classList.add('active');
    this._playVictorySound();
    this._launchRibbonBoom();
  },

  _hideCelebration() {
    const overlay = document.getElementById('celebrationOverlay');
    if (overlay) overlay.classList.remove('active');
    // Remove stray confetti pieces and ribbons
    document.querySelectorAll('.confetti-piece, .ribbon-streamer, .celebration-shockwave').forEach(el => el.remove());
  },

  _playVictorySound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio fanfare
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.5);
      });
    } catch (e) {
      // Audio optional fallback
    }
  },

  _launchRibbonBoom() {
    // 1. Shockwave ring pop
    const shockwave = document.createElement('div');
    shockwave.className = 'celebration-shockwave';
    document.body.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 1100);

    const colors = [
      'linear-gradient(135deg, #38bdf8, #0284c7)',
      'linear-gradient(135deg, #f472b6, #ec4899)',
      'linear-gradient(135deg, #facc15, #f59e0b)',
      'linear-gradient(135deg, #34d399, #10b981)',
      'linear-gradient(135deg, #a78bfa, #8b5cf6)',
      'linear-gradient(135deg, #fb923c, #ea580c)',
      '#38bdf8', '#facc15', '#f472b6', '#34d399', '#a78bfa'
    ];

    // 2. Ribbons burst (42 curling ribbon streamers)
    for (let i = 0; i < 42; i++) {
      const el = document.createElement('div');
      el.className = 'ribbon-streamer';
      const color = colors[i % colors.length];
      const angle = (Math.PI * 2 * (i / 42)) + ((Math.random() - 0.5) * 0.4);
      const distance = 160 + Math.random() * 260; // radius of burst
      const burstX = Math.cos(angle) * distance;
      const burstY = Math.sin(angle) * distance * 0.85 - 60; // slight upward bias
      const width = 6 + Math.floor(Math.random() * 5); // 6-10px
      const height = 35 + Math.floor(Math.random() * 32); // 35-67px
      const rot = Math.floor(Math.random() * 360);

      el.style.cssText = `
        --burst-x: ${burstX}px;
        --burst-y: ${burstY}px;
        --rot-initial: ${rot}deg;
        width: ${width}px;
        height: ${height}px;
        background: ${color};
        animation-duration: ${2.6 + Math.random() * 1.2}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4200);
    }

    // 3. Micro confetti glitter (55 pieces)
    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const color = colors[i % colors.length];
      const angle = Math.random() * Math.PI * 2;
      const distance = 90 + Math.random() * 240;
      const burstX = Math.cos(angle) * distance;
      const burstY = Math.sin(angle) * distance * 0.85 - 40;
      const size = 6 + Math.floor(Math.random() * 7); // 6-12px
      const isCircle = Math.random() > 0.5;
      const rot = Math.floor(Math.random() * 360);

      el.style.cssText = `
        --burst-x: ${burstX}px;
        --burst-y: ${burstY}px;
        --rot-initial: ${rot}deg;
        width: ${size}px;
        height: ${size}px;
        border-radius: ${isCircle ? '50%' : '2px'};
        background: ${color};
        animation-duration: ${2.2 + Math.random() * 1.2}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3800);
    }
  }
};
