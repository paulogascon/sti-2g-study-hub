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
  },

  async loadData() {
    try {
      const [subRes, handRes] = await Promise.all([
        fetch('js/data/subjects.json'),
        fetch('js/data/handouts.json')
      ]);
      this.subjects = await subRes.json();
      this.handouts = await handRes.json();
    } catch (err) {
      console.warn('Fetch fallback to embedded seed data', err);
      this.subjects = typeof DEFAULT_SUBJECTS !== 'undefined' ? DEFAULT_SUBJECTS : [];
      this.handouts = typeof DEFAULT_HANDOUTS !== 'undefined' ? DEFAULT_HANDOUTS : [];
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

  renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;

    grid.innerHTML = this.subjects.map(s => `
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
          <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.05em;">
            Midterm Core Topics:
          </div>
          <ul class="subject-topics-list">
            ${s.midtermTopics.map(t => `
              <li class="subject-topic-item">
                <span class="subject-topic-dot"></span>
                <span>${t}</span>
              </li>
            `).join('')}
          </ul>
          <div class="subject-actions">
            <button class="btn-card-action" onclick="App.openSubjectHandouts('${s.code}')">
              📂 Handouts
            </button>
            <button class="btn-card-action" onclick="App.startSubjectQuiz('${s.id}')">
              ⚡ Practice Quiz
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  startSubjectQuiz(subjectId) {
    this.switchView('view-quiz');
    QuizModule.setSubject(subjectId);
  },

  openSubjectHandouts(subjectCode) {
    const modal = document.getElementById('handoutsModal');
    const titleEl = document.getElementById('handoutsModalTitle');
    const listEl = document.getElementById('handoutsModalList');
    if (!modal || !listEl) return;

    const items = this.handouts.filter(h => h.subjectCode === subjectCode);
    const sub = this.subjects.find(s => s.code === subjectCode);

    titleEl.textContent = `${subjectCode} — ${sub ? sub.title : ''} Handouts`;

    if (items.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No study documents linked yet for ${subjectCode}.</p>
          <p style="font-size: 0.8rem; margin-top: 0.25rem;">Outputs from your Antigravity Outputs folder will appear here.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = items.map(h => `
        <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 0.75rem;">
          <div style="display:flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 0.95rem; font-weight: 600;">${h.title}</h4>
            <span style="font-size: 0.7rem; font-weight:700; background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px;">${h.format}</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0.4rem 0;">${h.summary}</p>
          ${h.localPath ? `
            <div style="font-size: 0.72rem; font-family: monospace; color: var(--text-dim); word-break: break-all; margin-top: 0.4rem;">
              📁 ${h.localPath}
            </div>
            <div style="margin-top: 0.6rem;">
              <a href="file:///${h.localPath.replace(/\\/g, '/')}" target="_blank" class="btn-secondary" style="font-size: 0.78rem; padding: 0.35rem 0.75rem; text-decoration: none;">
                📄 Open Document
              </a>
            </div>
          ` : ''}
        </div>
      `).join('');
    }

    modal.classList.add('open');
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
