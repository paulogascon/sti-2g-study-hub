// ==========================================================================
// SCHEDULE MODULE - STI 2G STUDY HUB
// Handles timetable rendering, live class detection, and class warning alerts
// ==========================================================================

const ScheduleModule = {
  data: [],
  currentFilterDay: 'All',
  notifiedAlerts: new Set(),
  dismissedBannerSlot: null,
  _lastTickerSig: null,
  _lastWarningSig: null,

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

    // Instant foreground update when user switches back to app
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateLiveClassTicker();
        this.checkClassWarnings();
      }
    });
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
      if (!this._audioCtx || this._audioCtx.state === 'closed') {
        this._audioCtx = new AudioCtx();
      }
      const ctx = this._audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
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
      if (window.App && typeof App.showToast === 'function') {
        App.showToast('Browser does not support system notifications.', 'warning');
      }
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

    const warningSig = upcomingWarning
      ? `warn_${upcomingWarning.id}_${upcomingWarning.minsUntil}`
      : ongoingClass
        ? `ongoing_${ongoingClass.id}`
        : 'none';

    if (this._lastWarningSig === warningSig) return;
    this._lastWarningSig = warningSig;

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
      const alertKey5  = `5m_${upcomingWarning.id}`;

      if (upcomingWarning.minsUntil <= 5 && !this.notifiedAlerts.has(alertKey5)) {
        this.notifiedAlerts.add(alertKey5);
        this.playChime();
        this.sendSystemNotification(
          `🚨 5-Minute Final Call: ${upcomingWarning.subjectCode}`,
          `Class starts in 5 minutes! Proceed to room ${upcomingWarning.room} immediately (${upcomingWarning.subjectTitle}).`
        );
      } else if (upcomingWarning.minsUntil <= 10 && !this.notifiedAlerts.has(alertKey10)) {
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

      const alertKeyStart = `start_${ongoingClass.id}`;
      if (!this.notifiedAlerts.has(alertKeyStart)) {
        this.notifiedAlerts.add(alertKeyStart);
        this.playChime();
        this.sendSystemNotification(
          `🔔 Class In Session: ${ongoingClass.subjectCode}`,
          `${ongoingClass.subjectTitle} has started in room ${ongoingClass.room}!`
        );
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
    this._lastWarningSig = null;
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
  // TIME & COUNTDOWN HELPERS
  // -------------------------------------------------------------
  formatTime12h(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    const minStr = m < 10 ? `0${m}` : `${m}`;
    return `${hour12}:${minStr} ${period}`;
  },

  formatCountdown(mins) {
    if (mins <= 0) return 'Starts now';
    if (mins < 60) return `in ${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `in ${hrs}h ${remMins}m` : `in ${hrs}h`;
  },

  getNextUpcomingClass(currentDayIndex) {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let offset = 1; offset <= 7; offset++) {
      const targetDayIndex = (currentDayIndex + offset) % 7;
      const targetDayName = daysOrder[targetDayIndex];
      const dayClasses = this.data
        .filter(c => c.day && c.day.toLowerCase() === targetDayName.toLowerCase())
        .sort((a, b) => {
          const [aH, aM] = a.startTime.split(':').map(Number);
          const [bH, bM] = b.startTime.split(':').map(Number);
          return (aH * 60 + aM) - (bH * 60 + bM);
        });
      if (dayClasses.length > 0) {
        return {
          ...dayClasses[0],
          dayName: targetDayName,
          isTomorrow: offset === 1
        };
      }
    }
    return null;
  },

  // -------------------------------------------------------------
  // LIVE HEADER TICKER (DYNAMIC ISLAND / LIQUID GLASS CAPSULE)
  // -------------------------------------------------------------
  updateLiveClassTicker() {
    const tickerStatus = document.getElementById('tickerStatusText');
    const tickerBadge = document.getElementById('tickerBadge');
    const tickerCountdown = document.getElementById('tickerCountdown');
    const tickerSubject = document.getElementById('tickerSubject');
    const tickerRoom = document.getElementById('tickerRoom');
    const tickerTime = document.getElementById('tickerTime');

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

    const minsRemaining = upNext ? (upNext.startTotal - currentMinutes) : 0;
    const tickerSig = ongoing
      ? `ongoing_${ongoing.id}`
      : upNext
        ? `upnext_${upNext.id}_${minsRemaining}`
        : `none_${now.getDay()}`;

    if (this._lastTickerSig === tickerSig) return;
    this._lastTickerSig = tickerSig;

    if (ongoing) {
      if (tickerBadge) {
        tickerBadge.className = 'capsule-status-pill live';
        tickerBadge.innerHTML = '<span class="pulse-dot"></span> IN CLASS NOW';
      }
      if (tickerCountdown) {
        tickerCountdown.className = 'capsule-countdown-pill live';
        tickerCountdown.textContent = `Ends at ${this.formatTime12h(ongoing.endTime)}`;
        tickerCountdown.style.display = 'inline-block';
      }
      if (tickerSubject) {
        tickerSubject.textContent = `${ongoing.subjectCode} — ${ongoing.subjectTitle}`;
      }
      if (tickerRoom) {
        tickerRoom.innerHTML = `📍 <strong>${ongoing.room}</strong>`;
        tickerRoom.style.display = 'inline-flex';
      }
      if (tickerTime) {
        tickerTime.innerHTML = `🕒 ${this.formatTime12h(ongoing.startTime)} – ${this.formatTime12h(ongoing.endTime)}`;
        tickerTime.style.display = 'inline-flex';
      }
      if (tickerStatus) {
        tickerStatus.innerHTML = `<strong>Ongoing:</strong> ${ongoing.subjectTitle} (${ongoing.room}) &bull; Ends at ${this.formatTime12h(ongoing.endTime)}`;
      }
    } else if (upNext) {
      const minsRemaining = upNext.startTotal - currentMinutes;
      const isUrgent = minsRemaining <= 15;

      if (tickerBadge) {
        tickerBadge.className = `capsule-status-pill ${isUrgent ? 'urgent' : 'upcoming'}`;
        tickerBadge.innerHTML = isUrgent ? '🚨 STARTING SOON' : '⚡ UP NEXT';
      }
      if (tickerCountdown) {
        tickerCountdown.className = `capsule-countdown-pill ${isUrgent ? 'urgent' : 'upcoming'}`;
        tickerCountdown.textContent = this.formatCountdown(minsRemaining);
        tickerCountdown.style.display = 'inline-block';
      }
      if (tickerSubject) {
        tickerSubject.textContent = `${upNext.subjectCode} — ${upNext.subjectTitle}`;
      }
      if (tickerRoom) {
        tickerRoom.innerHTML = `📍 <strong>${upNext.room}</strong>`;
        tickerRoom.style.display = 'inline-flex';
      }
      if (tickerTime) {
        tickerTime.innerHTML = `🕒 Starts at ${this.formatTime12h(upNext.startTime)}`;
        tickerTime.style.display = 'inline-flex';
      }
      if (tickerStatus) {
        tickerStatus.innerHTML = `<strong>Up Next (${this.formatCountdown(minsRemaining)}):</strong> ${upNext.subjectTitle} at ${this.formatTime12h(upNext.startTime)} (${upNext.room})`;
      }
    } else {
      const nextFuture = this.getNextUpcomingClass(now.getDay());
      if (nextFuture) {
        if (tickerBadge) {
          tickerBadge.className = 'capsule-status-pill clear';
          tickerBadge.innerHTML = '✨ ALL CLEAR TODAY';
        }
        if (tickerCountdown) {
          tickerCountdown.className = 'capsule-countdown-pill clear';
          tickerCountdown.textContent = nextFuture.isTomorrow ? 'Next class tomorrow' : `Next on ${nextFuture.dayName}`;
          tickerCountdown.style.display = 'inline-block';
        }
        if (tickerSubject) {
          tickerSubject.textContent = `${nextFuture.subjectCode} — ${nextFuture.subjectTitle}`;
        }
        if (tickerRoom) {
          tickerRoom.innerHTML = `📍 <strong>${nextFuture.room}</strong>`;
          tickerRoom.style.display = 'inline-flex';
        }
        if (tickerTime) {
          tickerTime.innerHTML = `🕒 ${this.formatTime12h(nextFuture.startTime)}`;
          tickerTime.style.display = 'inline-flex';
        }
        if (tickerStatus) {
          tickerStatus.innerHTML = `All classes done for today &bull; Next: ${nextFuture.subjectTitle}`;
        }
      } else {
        if (tickerBadge) {
          tickerBadge.className = 'capsule-status-pill clear';
          tickerBadge.innerHTML = '✨ ALL CLEAR';
        }
        if (tickerCountdown) tickerCountdown.style.display = 'none';
        if (tickerSubject) tickerSubject.textContent = 'No classes scheduled right now • BSIT 2G';
        if (tickerRoom) tickerRoom.style.display = 'none';
        if (tickerTime) tickerTime.style.display = 'none';
        if (tickerStatus) tickerStatus.innerHTML = 'No classes active right now &bull; Section 2G';
      }
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
          <div class="schedule-meta-chip room-chip" title="Classroom / Laboratory: ${c.room}">
            <div class="meta-chip-orb room-orb">
              <svg class="meta-chip-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18M5 21V7l8-4v18M13 7l6 3v11M9 9v1M9 13v1M9 17v1M17 13v1M17 17v1"/>
              </svg>
            </div>
            <div class="meta-chip-content">
              <span class="meta-chip-label">Room</span>
              <span class="meta-chip-value">${c.room}</span>
            </div>
          </div>

          <div class="schedule-meta-chip instructor-chip" title="Instructor: ${c.instructor || 'Professor'}">
            <div class="meta-chip-orb instructor-orb">
              <svg class="meta-chip-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div class="meta-chip-content">
              <span class="meta-chip-label">Instructor</span>
              <span class="meta-chip-value">${c.instructor || 'Instructor'}</span>
            </div>
          </div>
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
