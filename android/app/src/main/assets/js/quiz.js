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
  },

  setSubject(subjectCode) {
    this.currentSubject = subjectCode;
    this.currentFcIndex = 0;
    this.currentQIndex = 0;
    this.score = 0;
    this.isFlipped = false;
    this.hasAnswered = false;
    this.render();
  },

  setMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });
    this.render();
  },

  renderSubjectSelector() {
    const select = document.getElementById('quizSubjectSelect');
    if (!select) return;
    const keys = Object.keys(this.data);
    select.innerHTML = keys.map(k => `
      <option value="${k}">${k} - ${this.data[k].subjectTitle}</option>
    `).join('');
    select.value = this.currentSubject;
    select.addEventListener('change', (e) => this.setSubject(e.target.value));
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
    if (cardEl) {
      cardEl.classList.remove('flipped');
      cardEl.innerHTML = `
        <div class="card-face card-front">
          <span class="card-tag">${fc.topic}</span>
          <p class="card-text">${fc.front}</p>
          <span class="card-hint">Click card to reveal answer</span>
        </div>
        <div class="card-face card-back">
          <span class="card-tag">Explanation / Answer</span>
          <p class="card-text" style="font-size: 1.05rem;">${fc.back}</p>
          <span class="card-hint">Click card to flip back</span>
        </div>
      `;
    }
  },

  flipCard() {
    const cardEl = document.getElementById('activeFlashcard');
    if (!cardEl) return;
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
      // Show Final Score Summary
      const container = document.getElementById('examQuestionContainer');
      const percentage = Math.round((this.score / sub.questions.length) * 100);
      container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎯</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Quiz Complete!</h2>
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You scored <strong>${this.score} out of ${sub.questions.length}</strong> (${percentage}%)</p>
          <button class="btn-primary" onclick="QuizModule.resetQuiz()">Retry Subject Quiz</button>
        </div>
      `;
    }
  },

  resetQuiz() {
    this.currentQIndex = 0;
    this.score = 0;
    this.hasAnswered = false;
    this.renderExam();
  }
};
