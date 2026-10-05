// ==========================================================================
// APP CONTROLLER - STI 2G STUDY HUB
// Central router, subject card renderer, modal manager, theme toggle
// ==========================================================================

const App = {
  subjects: [],
  handouts: [],

  async init() {
    this.initClock();
    this.initTheme();
    this.initNav();
    await this.loadData();
    this.renderSubjects();
    this.initModals();

    // Initialize feature modules
    ScheduleModule.init();
    QuizModule.init();
    TasksModule.init();
    if (typeof OfflineStorageModule !== 'undefined') {
      OfflineStorageModule.init();
    }

    // Auto-sync when reconnecting or reopening app on phone
    window.addEventListener('online', () => {
      console.log('[Network] Reconnected to Internet: syncing data');
      this.syncAllData();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        this.syncAllData();
      }
    });
  },

  async loadData() {
    try {
      const timestamp = Date.now();
      const [subRes, handRes] = await Promise.all([
        fetch(`js/data/subjects.json?nocache=${timestamp}`),
        fetch(`js/data/handouts.json?nocache=${timestamp}`)
      ]);
      this.subjects = await subRes.json();
      this.handouts = await handRes.json();
      console.log('[Sync] Subjects & handouts synced from cloud');
    } catch (err) {
      console.warn('Offline mode: Using cached or embedded seed data', err);
      this.subjects = typeof DEFAULT_SUBJECTS !== 'undefined' ? DEFAULT_SUBJECTS : [];
      this.handouts = typeof DEFAULT_HANDOUTS !== 'undefined' ? DEFAULT_HANDOUTS : [];
    }
  },

  async syncAllData() {
    await this.loadData();
    this.renderSubjects();
    if (typeof ScheduleModule !== 'undefined' && ScheduleModule.refreshFromNetwork) {
      ScheduleModule.refreshFromNetwork();
    }
  },

  initClock() {
    const clockEl = document.getElementById('liveClock');
    const update = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      if (clockEl) clockEl.textContent = now.toLocaleDateString('en-PH', options);
    };
    update();
    setInterval(update, 1000);
  },

  initTheme() {
    const savedTheme = localStorage.getItem('sti_2g_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('sti_2g_theme', next);
        this.updateThemeButton(next);
      });
    }
  },

  updateThemeButton(theme) {
    const textEl = document.getElementById('themeLabel');
    if (textEl) {
      textEl.textContent = theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
  },

  initNav() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.dataset.view;
        this.switchView(targetView);

        // Close sidebar on mobile after selecting
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
      });
    });

    const mobileToggle = document.getElementById('mobileNavToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  },

  switchView(viewId) {
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.dataset.view === viewId);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });

    const activeSec = document.getElementById(viewId);
    if (activeSec) {
      activeSec.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  activeHandoutSubject: null,
  activeHandoutPeriod: 'MIDTERM',
  cardTopicPeriods: {},

  renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;

    grid.innerHTML = this.subjects.map(s => {
      const activeTopicPeriod = this.cardTopicPeriods[s.code] || 'midterm';
      const topics = activeTopicPeriod === 'midterm' 
        ? (s.midtermTopics || []) 
        : (s.prelimTopics || ['Foundational topics archived.']);

      const prelimCount = s.prelimTopics ? s.prelimTopics.length : 0;
      const midtermCount = s.midtermTopics ? s.midtermTopics.length : 0;

      return `
      <div class="subject-card">
        <div class="subject-card-top" style="background: ${s.bgGradient};">
          <div class="subject-card-code">${s.code}</div>
          <h3 class="subject-card-title">${s.title}</h3>
          <span class="subject-units-badge">${s.units} Units</span>
        </div>
        <div class="subject-card-body">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.6rem; display: flex; flex-direction: column; gap: 2px;">
            <div>👨‍🏫 <strong>Instructor:</strong> ${s.instructor || 'TBA'}</div>
            <div>🏛 <strong>Room:</strong> ${s.room || 'TBA'}</div>
          </div>
          <p class="subject-desc">${s.description}</p>

          <!-- Period Topic Switcher Inside Card -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin: 0.85rem 0 0.4rem 0;">
            <div style="display:flex; gap: 6px;">
              <button 
                class="period-badge ${activeTopicPeriod === 'midterm' ? 'midterm' : ''}" 
                style="cursor:pointer; border: 1px solid ${activeTopicPeriod === 'midterm' ? 'rgba(245, 158, 11, 0.4)' : 'var(--border-color)'}; background: ${activeTopicPeriod === 'midterm' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'};"
                onclick="App.toggleCardTopics('${s.code}', 'midterm', event)">
                🎯 Midterm (${midtermCount})
              </button>
              <button 
                class="period-badge ${activeTopicPeriod === 'prelim' ? 'prelim' : ''}" 
                style="cursor:pointer; border: 1px solid ${activeTopicPeriod === 'prelim' ? 'rgba(148, 163, 184, 0.4)' : 'var(--border-color)'}; background: ${activeTopicPeriod === 'prelim' ? 'rgba(148, 163, 184, 0.2)' : 'transparent'};"
                onclick="App.toggleCardTopics('${s.code}', 'prelim', event)">
                📁 Prelim (${prelimCount})
              </button>
            </div>
            <span style="font-size: 0.7rem; color: var(--text-dim); text-transform:uppercase; font-weight:700;">
              ${activeTopicPeriod === 'midterm' ? 'Active' : 'Archived'}
            </span>
          </div>

          <ul class="subject-topics-list">
            ${topics.map(t => `
              <li class="subject-topic-item">
                <span class="subject-topic-dot" style="background: ${activeTopicPeriod === 'midterm' ? '#f59e0b' : '#94a3b8'};"></span>
                <span>${t}</span>
              </li>
            `).join('')}
          </ul>

          <div class="subject-actions" style="display:grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn-card-action" onclick="App.openSubjectHandouts('${s.code}', 'MIDTERM')" style="font-weight:700; color:#fbbf24;">
              🎯 Midterm Files
            </button>
            <button class="btn-card-action" onclick="App.openSubjectHandouts('${s.code}', 'PRELIM')">
              📁 Prelim Files
            </button>
            <button class="btn-card-action" onclick="App.startSubjectQuiz('${s.id}')" style="grid-column: span 2; justify-content: center;">
              ⚡ Practice Exam & Flashcards
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');
  },

  toggleCardTopics(subjectCode, period, event) {
    if (event) event.stopPropagation();
    this.cardTopicPeriods[subjectCode] = period;
    this.renderSubjects();
  },

  setGlobalSubjectFilter(period) {
    this.subjects.forEach(s => {
      this.cardTopicPeriods[s.code] = (period === 'ALL' || period === 'MIDTERM') ? 'midterm' : 'prelim';
    });
    
    const allBtn = document.getElementById('filterAllPeriod');
    const midBtn = document.getElementById('filterMidtermPeriod');
    const preBtn = document.getElementById('filterPrelimPeriod');
    if (allBtn) allBtn.classList.toggle('active', period === 'ALL');
    if (midBtn) midBtn.classList.toggle('active', period === 'MIDTERM');
    if (preBtn) preBtn.classList.toggle('active', period === 'PRELIM');

    this.renderSubjects();
  },

  startSubjectQuiz(subjectId) {
    this.switchView('view-quiz');
    QuizModule.setSubject(subjectId);
  },

  openSubjectHandouts(subjectCode, initialPeriod = 'MIDTERM') {
    this.activeHandoutSubject = subjectCode;
    this.activeHandoutPeriod = initialPeriod;
    const modal = document.getElementById('handoutsModal');
    if (!modal) return;
    this.renderHandoutsModalContent();
    modal.classList.add('open');
  },

  switchHandoutPeriod(period) {
    this.activeHandoutPeriod = period;
    this.renderHandoutsModalContent();
  },

  renderHandoutsModalContent() {
    const subjectCode = this.activeHandoutSubject;
    const titleEl = document.getElementById('handoutsModalTitle');
    const listEl = document.getElementById('handoutsModalList');
    if (!subjectCode || !listEl) return;

    const sub = this.subjects.find(s => s.code === subjectCode);
    if (titleEl) {
      titleEl.innerHTML = `<span>${subjectCode} — ${sub ? sub.title : ''}</span>`;
    }

    const allSubjectItems = this.handouts.filter(h => h.subjectCode === subjectCode);
    const midtermItems = allSubjectItems.filter(h => h.period === 'MIDTERM');
    const prelimItems = allSubjectItems.filter(h => h.period === 'PRELIM');

    const activeList = this.activeHandoutPeriod === 'MIDTERM' ? midtermItems : prelimItems;

    listEl.innerHTML = `
      <!-- Segmented Control Period Switcher -->
      <div class="period-tab-group">
        <button class="period-tab-btn ${this.activeHandoutPeriod === 'MIDTERM' ? 'active' : ''}" onclick="App.switchHandoutPeriod('MIDTERM')">
          🎯 Midterm Handouts (${midtermItems.length})
        </button>
        <button class="period-tab-btn ${this.activeHandoutPeriod === 'PRELIM' ? 'active' : ''}" onclick="App.switchHandoutPeriod('PRELIM')">
          📁 Prelim Archive (${prelimItems.length})
        </button>
      </div>

      <div class="period-handouts-container">
        ${activeList.length === 0 ? `
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted); background: var(--bg-subtle); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📂</div>
            <p style="font-weight: 600;">No ${this.activeHandoutPeriod.toLowerCase()} documents found for ${subjectCode}.</p>
            <p style="font-size: 0.8rem; margin-top: 0.25rem;">Outputs from your ${this.activeHandoutPeriod} folder will synchronize automatically.</p>
          </div>
        ` : activeList.map(h => {
          const isOffline = typeof OfflineStorageModule !== 'undefined' && OfflineStorageModule.isFileSavedOffline(h.id);
          const isMidterm = h.period === 'MIDTERM';
          const fileUrl = h.downloadUrl || '#';
          return `
          <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.15rem; margin-bottom: 0.85rem;">
            <div style="display:flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
              <div>
                <span class="period-badge ${isMidterm ? 'midterm' : 'prelim'}" style="margin-bottom: 0.35rem;">
                  ${isMidterm ? '🎯 MIDTERM' : '📁 PRELIM'}
                </span>
                <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-top: 2px;">${h.title}</h4>
              </div>
              <span style="font-size: 0.72rem; font-weight:700; background: var(--bg-subtle); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 6px;">${h.format}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0;">${h.summary}</p>
            
            <div style="font-size: 0.75rem; color: var(--text-dim); display:flex; gap:0.75rem; align-items:center; margin: 0.4rem 0;">
              <span>📦 <strong>Size:</strong> ${h.fileSize || 'Standard'}</span>
              <span>📑 <strong>Type:</strong> ${h.type || 'Reviewer'}</span>
            </div>

            <div style="margin-top: 0.85rem; display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap;">
              <a href="${fileUrl}" target="_blank" download class="btn-primary" style="font-size: 0.82rem; padding: 0.45rem 1rem; text-decoration: none;">
                📥 Download Document
              </a>
              <button class="btn-offline ${isOffline ? 'saved-offline' : ''}" onclick="OfflineStorageModule.toggleOfflineSave('${h.id}', '${fileUrl}', this)">
                ${isOffline ? '✅ Available Offline' : '📶 Save for Offline'}
              </button>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  },

  initModals() {
    // Handouts modal close
    const handoutsModal = document.getElementById('handoutsModal');
    const closeHandoutsBtn = document.getElementById('closeHandoutsModalBtn');
    if (closeHandoutsBtn && handoutsModal) {
      closeHandoutsBtn.addEventListener('click', () => handoutsModal.classList.remove('open'));
    }

    // Add Sched Modal
    const addSchedModal = document.getElementById('addScheduleModal');
    const openAddSchedBtn = document.getElementById('openAddSchedBtn');
    const closeAddSchedBtn = document.getElementById('closeAddSchedBtn');
    const addSchedForm = document.getElementById('addScheduleForm');

    if (openAddSchedBtn && addSchedModal) {
      openAddSchedBtn.addEventListener('click', () => addSchedModal.classList.add('open'));
    }
    if (closeAddSchedBtn && addSchedModal) {
      closeAddSchedBtn.addEventListener('click', () => addSchedModal.classList.remove('open'));
    }
    if (addSchedForm) {
      addSchedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const slot = {
          day: document.getElementById('schedDayInput').value,
          startTime: document.getElementById('schedStartTimeInput').value,
          endTime: document.getElementById('schedEndTimeInput').value,
          subjectCode: document.getElementById('schedCodeInput').value,
          subjectTitle: document.getElementById('schedTitleInput').value,
          room: document.getElementById('schedRoomInput').value,
          type: document.getElementById('schedTypeInput').value,
          instructor: document.getElementById('schedInstructorInput').value
        };
        ScheduleModule.addSlot(slot);
        addSchedForm.reset();
        addSchedModal.classList.remove('open');
      });
    }

    // Add Task Modal
    const addTaskModal = document.getElementById('addTaskModal');
    const openAddTaskBtn = document.getElementById('openAddTaskBtn');
    const closeAddTaskBtn = document.getElementById('closeAddTaskBtn');
    const addTaskForm = document.getElementById('addTaskForm');

    if (openAddTaskBtn && addTaskModal) {
      openAddTaskBtn.addEventListener('click', () => addTaskModal.classList.add('open'));
    }
    if (closeAddTaskBtn && addTaskModal) {
      closeAddTaskBtn.addEventListener('click', () => addTaskModal.classList.remove('open'));
    }
    if (addTaskForm) {
      addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
          title: document.getElementById('taskTitleInput').value,
          subjectCode: document.getElementById('taskSubjectInput').value,
          dueDate: document.getElementById('taskDueDateInput').value,
          priority: document.getElementById('taskPriorityInput').value
        };
        TasksModule.addTask(task);
        addTaskForm.reset();
        addTaskModal.classList.remove('open');
      });
    }

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });
  }
};

// Launch Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => App.init());
