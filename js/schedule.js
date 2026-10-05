// ==========================================================================
// SCHEDULE MODULE - STI 2G STUDY HUB
// Handles timetable rendering, live class detection, and class warning alerts
// ==========================================================================

const ScheduleModule = {
  data: [],
  currentFilterDay: 'All',
  notifiedAlerts: new Set(),
  dismissedBannerSlot: null,

  async init() {
    // 1. Instantly load cached/saved data for zero-latency startup
    const saved = localStorage.getItem('sti_2g_schedule');
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        this.data = typeof DEFAULT_SCHEDULE !== 'undefined' ? DEFAULT_SCHEDULE : [];
      }
    } else {
      this.data = typeof DEFAULT_SCHEDULE !== 'undefined' ? DEFAULT_SCHEDULE : [];
    }

    this.render();
    this.updateLiveClassTicker();
    this.checkClassWarnings();
    this.initNotificationControls();

    // 2. Background cloud synchronization: fetch latest schedule if online
    this.refreshFromNetwork();

    // Check every 10 seconds for real-time alerts
    setInterval(() => {
      this.updateLiveClassTicker();
      this.checkClassWarnings();
    }, 10000);
  },

  async refreshFromNetwork() {
    try {
      const res = await fetch('js/data/schedule.json?nocache=' + Date.now());
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && Array.isArray(fresh) && fresh.length) {
          this.data = fresh;
          this.save();
          this.render();
          this.updateLiveClassTicker();
          this.checkClassWarnings();
          console.log('[Schedule] Synced latest class schedule from cloud');
        }
      }
    } catch (err) {
      // Offline mode: silently keep cached schedule
    }
  },

  save() {
    localStorage.setItem('sti_2g_schedule', JSON.stringify(this.data));
  },

  // -------------------------------------------------------------
  // AUDIO SYNTHESIZER CHIME (Web Audio API)
  // -------------------------------------------------------------
  playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: E5 (659.25 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now + 0.16);
      gain2.gain.setValueAtTime(0.25, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio chime interaction deferred', e);
    }
  },

  // -------------------------------------------------------------
  // NOTIFICATION PERMISSIONS & HARDWARE INTEGRATION
  // -------------------------------------------------------------
  initNotificationControls() {
    const notifBtn = document.getElementById('enableNotifBtn');
    const testBtn = document.getElementById('testAlertBtn');

    if (notifBtn) {
      this.updateNotifButtonLabel();
      notifBtn.addEventListener('click', () => this.requestNotificationPermission());
    }

    if (testBtn) {
      testBtn.addEventListener('click', () => this.triggerTestAlert());
    }
  },

  updateNotifButtonLabel() {
    const notifBtn = document.getElementById('enableNotifBtn');
    if (!notifBtn) return;
    if (!('Notification' in window)) {
      notifBtn.textContent = '🔕 Alerts Unavailable';
      notifBtn.disabled = true;
    } else if (Notification.permission === 'granted') {
      notifBtn.classList.add('active');
      notifBtn.innerHTML = '🔔 Alerts: Active';
    } else {
      notifBtn.classList.remove('active');
      notifBtn.innerHTML = '🔔 Enable Alerts';
    }
  },

  requestNotificationPermission() {
    if (!('Notification' in window)) {
      alert('Your browser does not support desktop notifications.');
      return;
    }
    Notification.requestPermission().then(perm => {
      this.updateNotifButtonLabel();
      if (perm === 'granted') {
        this.playChime();
        this.sendSystemNotification('STI 2G Class Alerts Activated 🎓', 'You will receive warnings 30m and 10m before each class begins.');
      }
    });
  },

  sendSystemNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎓</text></svg>'
        });
      } catch (err) {
        console.warn('Native notification suppressed', err);
      }
    }
  },

  // -------------------------------------------------------------
  // WARNING & COUNTDOWN DETECTOR
  // -------------------------------------------------------------
  checkClassWarnings() {
    const banner = document.getElementById('activeClassAlertBanner');
    if (!banner) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayClasses = this.data.filter(c => c.day.toLowerCase() === currentDay.toLowerCase());

    let upcomingWarning = null;
    let ongoingClass = null;

    todayClasses.forEach(c => {
      const [startH, startM] = c.startTime.split(':').map(Number);
      const [endH, endM] = c.endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      const minsUntil = startTotal - currentMinutes;

      if (currentMinutes >= startTotal && currentMinutes < endTotal) {
        ongoingClass = c;
      } else if (minsUntil > 0 && minsUntil <= 30) {
        if (!upcomingWarning || minsUntil < upcomingWarning.minsUntil) {
          upcomingWarning = { ...c, minsUntil };
        }
      }
    });

    // 1. Check Upcoming Class Warning (Highest priority alert)
    if (upcomingWarning) {
      if (this.dismissedBannerSlot === upcomingWarning.id) {
        banner.style.display = 'none';
        return;
      }

      const isUrgent = upcomingWarning.minsUntil <= 10;
      banner.className = `class-alert-banner ${isUrgent ? 'urgent' : 'warning'}`;
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="alert-content-left">
          <div class="alert-icon-box" style="background: ${isUrgent ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};">
            ${isUrgent ? '🚨' : '⏰'}
          </div>
          <div class="alert-text-wrap">
            <h4>
              <span>${isUrgent ? 'URGENT: Class Starting Soon!' : 'Upcoming Class Warning'}</span>
              <span class="alert-countdown-badge">${upcomingWarning.minsUntil} min${upcomingWarning.minsUntil > 1 ? 's' : ''} left</span>
            </h4>
            <p>
              <strong>${upcomingWarning.subjectCode} — ${upcomingWarning.subjectTitle}</strong> (${upcomingWarning.type})
              &bull; 🏛 Room: <strong>${upcomingWarning.room}</strong> &bull; Starts at ${upcomingWarning.startTime}
            </p>
          </div>
        </div>
        <button class="alert-dismiss-btn" onclick="ScheduleModule.dismissAlert('${upcomingWarning.id}')">Dismiss</button>
      `;

      // Trigger alerts once per threshold
      const alertKey30 = `30m_${upcomingWarning.id}`;
      const alertKey10 = `10m_${upcomingWarning.id}`;

      if (upcomingWarning.minsUntil <= 10 && !this.notifiedAlerts.has(alertKey10)) {
        this.notifiedAlerts.add(alertKey10);
        this.playChime();
        this.sendSystemNotification(
          `🚨 10-Minute Warning: ${upcomingWarning.subjectCode}`,
          `Head to ${upcomingWarning.room} now! ${upcomingWarning.subjectTitle} starts at ${upcomingWarning.startTime}.`
        );
      } else if (upcomingWarning.minsUntil <= 30 && !this.notifiedAlerts.has(alertKey30)) {
        this.notifiedAlerts.add(alertKey30);
        this.playChime();
        this.sendSystemNotification(
          `⏰ Class in ${upcomingWarning.minsUntil} mins: ${upcomingWarning.subjectCode}`,
          `${upcomingWarning.subjectTitle} starts at ${upcomingWarning.startTime} in ${upcomingWarning.room}.`
        );
      }
      return;
    }

    // 2. Check Ongoing Class
    if (ongoingClass) {
      if (this.dismissedBannerSlot === ongoingClass.id) {
        banner.style.display = 'none';
        return;
      }

      banner.className = 'class-alert-banner ongoing';
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="alert-content-left">
          <div class="alert-icon-box" style="background: rgba(16, 185, 129, 0.2);">
            🟢
          </div>
          <div class="alert-text-wrap">
            <h4>
              <span>Active Class In Session</span>
              <span class="alert-countdown-badge" style="background: rgba(16, 185, 129, 0.25); color: #34d399;">ONGOING</span>
            </h4>
            <p>
              <strong>${ongoingClass.subjectCode} — ${ongoingClass.subjectTitle}</strong>
              &bull; 🏛 ${ongoingClass.room} &bull; Ends at ${ongoingClass.endTime} &bull; 👨‍🏫 ${ongoingClass.instructor || ''}
            </p>
          </div>
        </div>
        <button class="alert-dismiss-btn" onclick="ScheduleModule.dismissAlert('${ongoingClass.id}')">Dismiss</button>
      `;
      return;
    }

    // No warning or ongoing class
    banner.style.display = 'none';
  },

  dismissAlert(slotId) {
    this.dismissedBannerSlot = slotId;
    const banner = document.getElementById('activeClassAlertBanner');
    if (banner) banner.style.display = 'none';
  },

  triggerTestAlert() {
    this.playChime();
    this.sendSystemNotification(
      '🚨 [TEST WARNING] Class Starting Soon!',
      'COSC1007 — Human-Computer Interaction begins in 10 minutes in MN307 (Lab 4)!'
    );

    const banner = document.getElementById('activeClassAlertBanner');
    if (banner) {
      banner.className = 'class-alert-banner urgent';
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="alert-content-left">
          <div class="alert-icon-box" style="background: rgba(239, 68, 68, 0.2);">🚨</div>
          <div class="alert-text-wrap">
            <h4>
              <span>[TEST WARNING] Class Starting Soon!</span>
              <span class="alert-countdown-badge">10 mins left</span>
            </h4>
            <p><strong>COSC1007 — Human-Computer Interaction</strong> (Laboratory) &bull; 🏛 Room: <strong>MN307 (Lab 4)</strong> &bull; Prof. Pasion, Charis B.</p>
          </div>
        </div>
        <button class="alert-dismiss-btn" onclick="ScheduleModule.dismissAlert('test')">Dismiss</button>
      `;
    }
  },

  // -------------------------------------------------------------
  // LIVE HEADER TICKER
  // -------------------------------------------------------------
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
      const minsRemaining = upNext.startTotal - currentMinutes;
      tickerStatus.innerHTML = `<strong>Up Next in ${minsRemaining}m:</strong> ${upNext.subjectTitle} at ${upNext.startTime} (${upNext.room})`;
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

  setDayFilter(day) {
    this.currentFilterDay = day;
    document.querySelectorAll('.day-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.day === day);
    });
    this.render();
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
    this.checkClassWarnings();
  }
};
