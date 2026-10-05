// ==========================================================================
// SCHEDULE MODULE - STI 2G STUDY HUB
// Handles timetable rendering, day filtering, and live class detection
// ==========================================================================

const ScheduleModule = {
  data: [],
  currentFilterDay: 'All',

  async init() {
    const saved = localStorage.getItem('sti_2g_schedule');
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      try {
        const res = await fetch('js/data/schedule.json');
        this.data = await res.json();
      } catch (err) {
        console.warn('Fetch fallback to DEFAULT_SCHEDULE', err);
        this.data = typeof DEFAULT_SCHEDULE !== 'undefined' ? DEFAULT_SCHEDULE : [];
      }
      this.save();
    }
    this.render();
    this.updateLiveClassTicker();
    // Refresh live status every minute
    setInterval(() => this.updateLiveClassTicker(), 60000);
  },

  save() {
    localStorage.setItem('sti_2g_schedule', JSON.stringify(this.data));
  },

  setDayFilter(day) {
    this.currentFilterDay = day;
    document.querySelectorAll('.day-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.day === day);
    });
    this.render();
  },

  getClassesForCurrentDay() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return this.data.filter(item => item.day.toLowerCase() === today.toLowerCase());
  },

  updateLiveClassTicker() {
    const tickerStatus = document.getElementById('tickerStatusText');
    const tickerBadge = document.getElementById('tickerBadge');
    if (!tickerStatus) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayClasses = this.data.filter(c => c.day.toLowerCase() === currentDay.toLowerCase());

    let ongoing = null;
    let upNext = null;

    todayClasses.forEach(c => {
      const [startH, startM] = c.startTime.split(':').map(Number);
      const [endH, endM] = c.endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      if (currentMinutes >= startTotal && currentMinutes < endTotal) {
        ongoing = c;
      } else if (currentMinutes < startTotal && (!upNext || startTotal < upNext.startTotal)) {
        upNext = { ...c, startTotal };
      }
    });

    if (ongoing) {
      tickerStatus.innerHTML = `<strong>Ongoing:</strong> ${ongoing.subjectTitle} (${ongoing.room}) &bull; Ends at ${ongoing.endTime}`;
      tickerBadge.style.display = 'inline-flex';
      tickerBadge.className = 'live-badge';
      tickerBadge.innerHTML = '<span class="live-pulse"></span> IN CLASS';
    } else if (upNext) {
      tickerStatus.innerHTML = `<strong>Up Next:</strong> ${upNext.subjectTitle} at ${upNext.startTime} (${upNext.room})`;
      tickerBadge.style.display = 'inline-flex';
      tickerBadge.className = 'live-badge';
      tickerBadge.style.background = 'rgba(56, 189, 248, 0.15)';
      tickerBadge.style.color = '#38bdf8';
      tickerBadge.innerHTML = 'UP NEXT';
    } else {
      tickerStatus.innerHTML = `No classes active right now &bull; Section 2G`;
      tickerBadge.style.display = 'none';
    }
  },

  render() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    let items = this.data;
    if (this.currentFilterDay !== 'All') {
      items = items.filter(i => i.day === this.currentFilterDay);
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-color);">
          <p style="font-size: 1.1rem; font-weight: 600;">No scheduled classes for ${this.currentFilterDay}</p>
          <p style="font-size: 0.85rem; margin-top: 0.25rem;">Enjoy your study time or review handouts!</p>
        </div>
      `;
      return;
    }

    // Sort chronologically by day and startTime
    const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
    items.sort((a, b) => {
      if (dayOrder[a.day] !== dayOrder[b.day]) {
        return dayOrder[a.day] - dayOrder[b.day];
      }
      return a.startTime.localeCompare(b.startTime);
    });

    container.innerHTML = items.map(c => `
      <div class="schedule-card">
        <div class="schedule-card-header">
          <span class="schedule-time-badge">${c.day} &bull; ${c.startTime} – ${c.endTime}</span>
          <span class="schedule-type-badge ${c.type}">${c.type}</span>
        </div>
        <h4 class="schedule-title">${c.subjectTitle}</h4>
        <span class="schedule-code">${c.subjectCode}</span>
        <div class="schedule-meta-row">
          <span>🏛 ${c.room}</span>
          <span>👨‍🏫 ${c.instructor || 'Instructor'}</span>
        </div>
      </div>
    `).join('');
  },

  addSlot(slot) {
    slot.id = 'sched_' + Date.now();
    this.data.push(slot);
    this.save();
    this.render();
    this.updateLiveClassTicker();
  }
};
