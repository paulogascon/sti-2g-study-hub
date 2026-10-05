// ==========================================================================
// TASKS & DEADLINES MODULE - STI 2G STUDY HUB
// Handles student deliverables, lab tasks, and midterm exam countdown
// ==========================================================================

const TasksModule = {
  tasks: [],

  init() {
    const saved = localStorage.getItem('sti_2g_tasks');
    if (saved) {
      this.tasks = JSON.parse(saved);
    } else {
      // Seed default tasks for BSIT 2G Midterms
      this.tasks = [
        {
          id: 'task_1',
          title: 'HCI Defense Oral Presentation Prep (AuraPulse)',
          subjectCode: 'COSC1007',
          dueDate: '2026-10-12',
          priority: 'High',
          completed: false
        },
        {
          id: 'task_2',
          title: 'DSA Binary Search Tree Implementation Lab',
          subjectCode: 'COSC1003',
          dueDate: '2026-10-16',
          priority: 'High',
          completed: false
        },
        {
          id: 'task_3',
          title: 'Platform Tech CPU Scheduling Simulation',
          subjectCode: 'COSC1008',
          dueDate: '2026-10-18',
          priority: 'Medium',
          completed: false
        },
        {
          id: 'task_4',
          title: 'Philippine History Cavite Mutiny Reflection Paper',
          subjectCode: 'GEDC 1006',
          dueDate: '2026-10-22',
          priority: 'Low',
          completed: false
        }
      ];
      this.save();
    }

    this.render();
    this.renderCountdown();
    setInterval(() => this.renderCountdown(), 60000);
  },

  save() {
    localStorage.setItem('sti_2g_tasks', JSON.stringify(this.tasks));
  },

  addTask(task) {
    task.id = 'task_' + Date.now();
    task.completed = false;
    this.tasks.unshift(task);
    this.save();
    this.render();
  },

  toggleTask(id) {
    const t = this.tasks.find(x => x.id === id);
    if (t) {
      t.completed = !t.completed;
      this.save();
      this.render();
    }
  },

  deleteTask(id) {
    this.tasks = this.tasks.filter(x => x.id !== id);
    this.save();
    this.render();
  },

  renderCountdown() {
    const countdownEl = document.getElementById('midtermCountdown');
    if (!countdownEl) return;

    // Approximate STI Midterm Exam target: late October 2026
    const targetDate = new Date('2026-10-26T08:00:00');
    const now = new Date();
    const diffMs = targetDate - now;

    if (diffMs <= 0) {
      countdownEl.textContent = 'Midterm Examinations In Progress!';
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    countdownEl.innerHTML = `<strong>${days} Days, ${hours} Hours</strong> until Midterm Exam Week`;
  },

  render() {
    const listEl = document.getElementById('taskList');
    const countEl = document.getElementById('pendingTasksCount');
    if (!listEl) return;

    const pending = this.tasks.filter(t => !t.completed).length;
    if (countEl) countEl.textContent = pending;

    if (this.tasks.length === 0) {
      listEl.innerHTML = '<p style="color: var(--text-muted); padding: 1.5rem; text-align: center;">No academic deliverables listed! Click "+ Add Deliverable" to track one.</p>';
      return;
    }

    listEl.innerHTML = this.tasks.map(t => `
      <div class="task-item ${t.completed ? 'completed' : ''}">
        <div class="task-left">
          <input type="checkbox" class="task-checkbox" ${t.completed ? 'checked' : ''} onchange="TasksModule.toggleTask('${t.id}')">
          <div>
            <div class="task-text">${t.title}</div>
            <div class="task-due">${t.subjectCode} &bull; Due: ${t.dueDate || 'No date set'}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap: 0.75rem;">
          <span class="task-badge ${t.priority}">${t.priority}</span>
          <button class="task-del-btn" title="Delete" onclick="TasksModule.deleteTask('${t.id}')">&times;</button>
        </div>
      </div>
    `).join('');
  }
};
