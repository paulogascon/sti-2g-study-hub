// ==========================================================================
// APP CONTROLLER - STI 2G STUDY HUB
// Central router, subject card renderer, modal manager, theme toggle
// ==========================================================================

const App = {
  subjects: [],
  handouts: [],
  currentView: 'view-dashboard',
  previousView: 'view-dashboard',
  viewScrollPositions: {},

  async init() {
    const initialActive = document.querySelector('.view-section.active');
    if (initialActive && initialActive.id) {
      this.currentView = initialActive.id;
    }
    try { this.initClock(); } catch (e) { console.warn('Clock init:', e); }
    try { this.initMidtermCountdown(); } catch (e) { console.warn('Countdown init:', e); }
    try { this.initTheme(); } catch (e) { console.warn('Theme init:', e); }
    try { this.initNav(); } catch (e) { console.warn('Nav init:', e); }
    try { this.initUserProfile(); } catch (e) { console.warn('Profile init:', e); }
    try { await this.loadData(); } catch (e) { console.warn('LoadData init:', e); }
    try { this.renderSubjects(); } catch (e) { console.warn('RenderSubjects init:', e); }
    try { this.renderHomeSubjectsCarousel(); } catch (e) { console.warn('Home carousel init:', e); }
    try { this.checkAppDownloadedState(); } catch (e) { console.warn('App downloaded check:', e); }
    try { this.initSearchModal(); } catch (e) { console.warn('Search modal init:', e); }
    try { this.initModals(); } catch (e) { console.warn('Modals init:', e); }
    try { this.initTouchGestures(); } catch (e) { console.warn('Gestures init:', e); }

    // Initialize feature modules
    try { ScheduleModule.init(); } catch (e) { console.warn('Schedule init:', e); }
    try { this.updateHomeClassRadar(); } catch (e) { console.warn('Home class radar init:', e); }
    try { QuizModule.init(); } catch (e) { console.warn('Quiz init:', e); }
    if (typeof OfflineStorageModule !== 'undefined') {
      try { OfflineStorageModule.init(); } catch (e) { console.warn('Storage init:', e); }
    }

    // Check Onboarding & Terms on initial app load
    try { this.checkOnboardingTerms(); } catch (e) { console.warn('Onboarding init:', e); }

    // Auto-sync when reconnecting or reopening app on phone
    window.addEventListener('online', () => {
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
      if (!subRes.ok || !handRes.ok) {
        throw new Error('HTTP fetch status not ok');
      }
      this.subjects = await subRes.json();
      this.handouts = await handRes.json();
      console.log('[Sync] Subjects & handouts synced from cloud');
    } catch (err) {
      console.warn('Offline mode: Using cached or embedded seed data', err);
      this.subjects = (typeof DEFAULT_SUBJECTS !== 'undefined' && Array.isArray(DEFAULT_SUBJECTS) && DEFAULT_SUBJECTS.length > 0)
        ? DEFAULT_SUBJECTS
        : [];
      this.handouts = (typeof DEFAULT_HANDOUTS !== 'undefined' && Array.isArray(DEFAULT_HANDOUTS) && DEFAULT_HANDOUTS.length > 0)
        ? DEFAULT_HANDOUTS
        : [];
    }

    if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
      if (typeof DEFAULT_SUBJECTS !== 'undefined' && Array.isArray(DEFAULT_SUBJECTS)) {
        this.subjects = DEFAULT_SUBJECTS;
      }
    }
    if (!Array.isArray(this.handouts) || this.handouts.length === 0) {
      if (typeof DEFAULT_HANDOUTS !== 'undefined' && Array.isArray(DEFAULT_HANDOUTS)) {
        this.handouts = DEFAULT_HANDOUTS;
      }
    }
  },

  async syncAllData() {
    await this.loadData();
    this.renderSubjects();
    this.renderHomeSubjectsCarousel();
    this.updateHomeClassRadar();
    if (typeof ScheduleModule !== 'undefined' && ScheduleModule.refreshFromNetwork) {
      ScheduleModule.refreshFromNetwork();
    }
  },

  initClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const update = () => {
      const formatted = new Date().toLocaleDateString('en-PH', options);
      if (clockEl.textContent !== formatted) {
        clockEl.textContent = formatted;
      }
    };
    update();
    setInterval(update, 10000);
  },

  initMidtermCountdown() {
    const countdownEl = document.getElementById('midtermCountdown');
    const descEl = document.getElementById('midtermCountdownDesc');
    if (!countdownEl) return;

    // STI 1st Semester Midterm Examination Target: Oct 22-28, 2026
    const targetDate = new Date('2026-10-22T08:00:00');

    const update = () => {
      const now = new Date();
      const diffMs = targetDate - now;

      if (diffMs <= 0) {
        countdownEl.textContent = 'Exam Week Active!';
        if (descEl) descEl.textContent = 'Midterm Examinations in progress';
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (days > 0) {
        countdownEl.textContent = `${days} Days Left`;
        if (descEl) descEl.textContent = `${hours}h left • Exam Target: Oct 22–28`;
      } else {
        countdownEl.textContent = `${hours} Hours Left`;
        if (descEl) descEl.textContent = 'Midterm Exam Target: Today!';
      }
    };

    update();
    setInterval(update, 60000);
  },

  initTheme() {
    const savedTheme = localStorage.getItem('sti_2g_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    const toggleBtn = document.getElementById('themeToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => this.toggleTheme(e));
    }
  },

  toggleTheme(event) {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setThemeWithTransition(next, event);
  },

  setThemeWithTransition(next) {
    const applyTheme = () => {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('sti_2g_theme', next);
      this.updateThemeButton(next);
    };

    // Silky smooth, hardware-accelerated theme transition (zero frame drop / zero lag)
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => {
        applyTheme();
      });
    } else {
      applyTheme();
    }
  },

  updateThemeButton(theme) {
    const iconSlot = document.getElementById('themeIconSlot');
    const toggleBtn = document.getElementById('themeToggleBtn');

    if (toggleBtn) {
      toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Current theme: Dark. Click to switch to Light mode' : 'Current theme: Light. Click to switch to Dark mode');
    }
    if (iconSlot) {
      iconSlot.classList.remove('theme-icon-spin');
      void iconSlot.offsetWidth; // Trigger reflow for spin animation
      iconSlot.classList.add('theme-icon-spin');

      if (theme === 'dark') {
        iconSlot.innerHTML = `
          <svg class="theme-svg moon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        `;
      } else {
        iconSlot.innerHTML = `
          <svg class="theme-svg sun-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        `;
      }
    }
  },

  initNav() {
    // Navigation is wired with handleNavClick and handleFabClick
  },

  handleNavClick(buttonEl, viewId, customAction) {
    if (!buttonEl) return;

    // 1. Tactile haptic vibration if supported on Android/Mobile
    if (navigator.vibrate) {
      try { navigator.vibrate(12); } catch (e) {}
    }

    // 2. Play tactile spring bounce animation
    buttonEl.classList.remove('nav-tap-pop');
    void buttonEl.offsetWidth; // Force reflow
    buttonEl.classList.add('nav-tap-pop');

    // 3. Spawn liquid glass tap ripple radiating from center
    const ripple = document.createElement('span');
    ripple.className = 'nav-glass-ripple';
    buttonEl.appendChild(ripple);
    setTimeout(() => ripple.remove(), 420);

    // 4. View switch or custom action
    if (customAction) {
      customAction();
    } else if (viewId) {
      this.switchView(viewId);
    }
  },

  handleFabClick(fabEl) {
    if (!fabEl) return;

    if (navigator.vibrate) {
      try { navigator.vibrate([15, 30, 20]); } catch (e) {}
    }

    fabEl.classList.remove('fab-tap-bounce');
    void fabEl.offsetWidth;
    fabEl.classList.add('fab-tap-bounce');

    // Toggle: if currently on Midterm Hub, close it and return to previous screen
    if (this.currentView === 'view-subjects') {
      const returnTarget = (this.previousView && this.previousView !== 'view-subjects')
        ? this.previousView
        : 'view-dashboard';
      this.switchView(returnTarget, { isBack: true });
    } else {
      // Otherwise open Midterm Hub
      this.goToMidtermSubjects();
    }
  },

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (sidebar.classList.contains('open')) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  },

  openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;

    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.classList.add('sidebar-open');

    // Notify Android native bridge if running in APK
    if (window.AndroidBridge && typeof window.AndroidBridge.setDrawerState === 'function') {
      try {
        window.AndroidBridge.setDrawerState(true);
      } catch (e) {}
    }

    // Push history state so Android hardware back button & swipe-back gesture works
    if (window.history && window.history.pushState) {
      try {
        window.history.pushState({ drawerOpen: true }, '');
      } catch (e) {}
    }
  },

  closeSidebar(syncHistory = true) {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;

    const wasOpen = sidebar.classList.contains('open');
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.classList.remove('sidebar-open');

    // Notify Android native bridge
    if (window.AndroidBridge && typeof window.AndroidBridge.setDrawerState === 'function') {
      try {
        window.AndroidBridge.setDrawerState(false);
      } catch (e) {}
    }

    // Pop dirty history entry if closed via touch/swipe/click
    if (wasOpen && syncHistory && window.history && window.history.state && window.history.state.drawerOpen) {
      try {
        window.history.back();
      } catch (e) {}
    }
  },

  handleHardwareBack() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      this.closeSidebar(false);
      return true;
    }
    const openModal = document.querySelector('.modal-overlay.open');
    if (openModal) {
      openModal.classList.remove('open');
      return true;
    }
    if (this.currentView && this.currentView !== 'view-dashboard') {
      return this.navigateBack();
    }
    return false;
  },

  navigateBack() {
    // 1. If sidebar drawer is open, close it
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      this.closeSidebar(false);
      return true;
    }

    // 2. If any modal is open, close it
    const openModal = document.querySelector('.modal-overlay.open');
    if (openModal) {
      openModal.classList.remove('open');
      return true;
    }

    // 3. Return to previous view or dashboard
    if (this.currentView && this.currentView !== 'view-dashboard') {
      const returnTarget = (this.previousView && this.previousView !== this.currentView)
        ? this.previousView
        : 'view-dashboard';
      this.switchView(returnTarget, { isBack: true });
      return true;
    }

    return false;
  },

  initTouchGestures() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!sidebar) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let tracking = false;
    let isEdgeSwipe = false;
    let isSwipeBack = false;

    // 1. Touch start on window
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = startX;
      currentY = startY;

      const isOpen = sidebar.classList.contains('open');
      if (isOpen) {
        // When drawer is open, any touch can swipe left to close
        tracking = true;
        isEdgeSwipe = false;
        isSwipeBack = false;
      } else if (startX <= 32 && App.currentView === 'view-dashboard') {
        // Edge swipe on Home/Dashboard to open sidebar
        tracking = true;
        isEdgeSwipe = true;
        isSwipeBack = false;
      } else if (startX < Math.max(window.innerWidth * 0.45, 180) && (App.currentView !== 'view-dashboard' || document.querySelector('.modal-overlay.open'))) {
        // Left-to-right swipe-back zone when away from Home or inside an open modal
        tracking = true;
        isEdgeSwipe = false;
        isSwipeBack = true;
      } else {
        tracking = false;
        isEdgeSwipe = false;
        isSwipeBack = false;
      }
    }, { passive: true });

    // 2. Touch move
    window.addEventListener('touchmove', (e) => {
      if (!tracking || e.touches.length !== 1) return;
      const touch = e.touches[0];
      currentX = touch.clientX;
      currentY = touch.clientY;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // If user is clearly scrolling vertically, cancel horizontal gesture tracking
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 20) {
        tracking = false;
      }
    }, { passive: true });

    // 3. Touch end
    window.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Predominantly horizontal gesture
      if (Math.abs(diffX) > Math.abs(diffY) * 1.25) {
        const isOpen = sidebar.classList.contains('open');

        // Case A: Sidebar is open -> swipe left (<--) closes sidebar
        if (isOpen && diffX < -32) {
          App.closeSidebar();
          return;
        }

        // Case B: Edge swipe right (-->) on Dashboard opens sidebar
        if (!isOpen && isEdgeSwipe && diffX > 40) {
          App.openSidebar();
          return;
        }

        // Case C: Mobile Swipe-Back gesture (-->) returns to previous screen or closes modal
        if (!isOpen && isSwipeBack && diffX > 45) {
          App.navigateBack();
          return;
        }
      }
    }, { passive: true });

    // 4. Click / tap on backdrop overlay (the right side of screen)
    const dismissOverlay = (e) => {
      if (sidebar.classList.contains('open')) {
        e.preventDefault();
        e.stopPropagation();
        App.closeSidebar();
      }
    };

    if (overlay) {
      overlay.addEventListener('click', dismissOverlay);
      overlay.addEventListener('touchend', dismissOverlay);
      overlay.addEventListener('pointerdown', dismissOverlay);
    }

    // 5. Fallback: tap anywhere outside sidebar on right screen area
    document.addEventListener('pointerdown', (e) => {
      if (!sidebar.classList.contains('open')) return;
      const toggleBtn = document.getElementById('mobileNavToggle');
      if (!sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
        App.closeSidebar();
      }
    });

    // 6. Browser / Android back navigation (popstate)
    window.addEventListener('popstate', (e) => {
      if (sidebar.classList.contains('open')) {
        App.closeSidebar(false);
        return;
      }
      const openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        openModal.classList.remove('open');
        return;
      }
      if (e.state && e.state.viewId) {
        App.switchView(e.state.viewId, { isBack: true, fromPopState: true });
      } else if (App.currentView && App.currentView !== 'view-dashboard') {
        const target = App.previousView || 'view-dashboard';
        App.switchView(target, { isBack: true, fromPopState: true });
      }
    });
  },

  switchView(rawViewId, options = {}) {
    if (!rawViewId) return;

    // Normalize view IDs
    let viewId = rawViewId;
    if (!viewId.startsWith('view-')) {
      viewId = 'view-' + viewId;
    }

    const currentId = this.currentView || 'view-dashboard';
    const isBack = options.isBack === true || (currentId !== 'view-dashboard' && viewId === 'view-dashboard' && options.isBack !== false);

    // If switching to the exact same view and not forced, scroll instantly to top if requested
    if (currentId === viewId && !options.force) {
      if (options.scrollTop !== undefined) {
        window.scrollTo({ top: options.scrollTop, left: 0, behavior: 'instant' });
      }
      return;
    }

    // 1. Record current view's vertical scroll position before navigating away
    this.viewScrollPositions[currentId] = window.scrollY || window.pageYOffset || 0;

    // 2. Track previous view
    if (!isBack && currentId !== viewId) {
      this.previousView = currentId;
    }

    this.currentView = viewId;

    // 3. Update bottom nav item active pills
    document.querySelectorAll('.bottom-nav-item').forEach(l => {
      l.classList.toggle('active', l.dataset.view === viewId);
    });

    // 4. Update FAB Active State (Midterm Hub) & Sublabel
    const fab = document.getElementById('bottomNavFab');
    const fabSublabel = document.querySelector('.fab-sublabel');
    const isMidtermView = (viewId === 'view-subjects');

    if (fab) {
      fab.classList.toggle('active', isMidtermView);
      const titleText = isMidtermView ? 'Close Midterm Hub (Return)' : 'Open Midterm Hub';
      fab.setAttribute('title', titleText);
      fab.setAttribute('aria-label', titleText);
    }
    if (fabSublabel) {
      fabSublabel.textContent = isMidtermView ? 'Close' : 'Midterm';
    }

    // 5. Deactivate other views & clean old slide animation classes
    document.querySelectorAll('.view-section').forEach(sec => {
      if (sec.id !== viewId) {
        sec.classList.remove('active', 'view-slide-forward', 'view-slide-back');
      }
    });

    // 6. Activate new view section
    const activeSec = document.getElementById(viewId);
    if (activeSec) {
      // Determine target scroll position:
      // If returning back, restore saved scroll position; if moving forward, land at top (0)
      const targetScroll = isBack 
        ? (this.viewScrollPositions[viewId] || 0) 
        : (options.scrollTop !== undefined ? options.scrollTop : 0);

      // INSTANT scroll placement (Zero jitter, zero animated jump to top)
      window.scrollTo({ top: targetScroll, left: 0, behavior: 'instant' });

      // Hardware accelerated slide animation
      activeSec.classList.remove('view-slide-forward', 'view-slide-back');
      void activeSec.offsetWidth; // Force reflow so animation always replays
      activeSec.classList.add('active', isBack ? 'view-slide-back' : 'view-slide-forward');
    }

    // 7. Sync browser history
    if (!options.fromPopState && window.history && window.history.pushState) {
      try {
        window.history.pushState({ viewId }, '', `#${viewId}`);
      } catch (e) {}
    }
  },

  goToMidtermSubjects() {
    this.switchView('view-subjects', { isBack: false, scrollTop: 0 });
    this.setGlobalSubjectFilter('MIDTERM');
  },

  activeHandoutSubject: null,
  activeHandoutPeriod: 'MIDTERM',
  handoutCategoryFilter: 'ALL',
  cardTopicPeriods: {},

  isStudyGuideHandout(h) {
    if (h.isStudyGuide === true) return true;
    const type = (h.type || '').toLowerCase();
    const title = (h.title || '').toLowerCase();
    const summary = (h.summary || '').toLowerCase();
    if (type.includes('study guide') || type.includes('reviewer') || type.includes('defense prep')) return true;
    if (title.includes('study guide') || title.includes('reviewer') || title.includes('combined') || title.includes('master guide') || title.includes('qa master')) return true;
    if (summary.includes('study guide') || summary.includes('reviewer') || summary.includes('master reviewer') || summary.includes('combined reviewer')) return true;
    return false;
  },

  setHandoutCategoryFilter(category) {
    this.handoutCategoryFilter = category;
    this.renderHandoutsModalContent();
  },

  renderSubjects() {
    const grid = document.getElementById('subjectsGrid');
    if (!grid) return;

    if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
      if (typeof DEFAULT_SUBJECTS !== 'undefined' && Array.isArray(DEFAULT_SUBJECTS)) {
        this.subjects = DEFAULT_SUBJECTS;
      }
    }

    if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.1rem; margin-bottom: 0.8rem;">📚 Refreshing subject curriculum...</p>
          <button class="btn-card-action btn-midterm-highlight" style="display:inline-flex; width:auto; padding:0.6rem 1.4rem;" onclick="App.init()">
            🔄 Reload Subjects
          </button>
        </div>
      `;
      return;
    }

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
          <div class="subject-meta-chips-row">
            <div class="schedule-meta-chip room-chip" title="Classroom / Laboratory: ${s.room || 'TBA'}">
              <div class="meta-chip-orb room-orb">
                <svg class="meta-chip-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 21h18M5 21V7l8-4v18M13 7l6 3v11M9 9v1M9 13v1M9 17v1M17 13v1M17 17v1"/>
                </svg>
              </div>
              <div class="meta-chip-content">
                <span class="meta-chip-label">Room / Lab</span>
                <span class="meta-chip-value">${s.room || 'TBA'}</span>
              </div>
            </div>

            <div class="schedule-meta-chip instructor-chip" title="Instructor: ${s.instructor || 'TBA'}">
              <div class="meta-chip-orb instructor-orb">
                <svg class="meta-chip-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div class="meta-chip-content">
                <span class="meta-chip-label">Instructor</span>
                <span class="meta-chip-value">${s.instructor || 'TBA'}</span>
              </div>
            </div>
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

          <!-- Prominent Dedicated Midterm Files Button -->
          <div class="subject-card-midterm-cta">
            <button class="btn-card-action btn-midterm-highlight" onclick="App.openSubjectHandouts('${s.code}', 'MIDTERM')" title="Open Midterm Study Guides & Raw Handouts">
              <span class="btn-pulse-dot"></span>
              <span class="btn-cta-text">
                <span class="btn-cta-title">🎯 Open Midterm Files &amp; Reviewers</span>
                <span class="btn-cta-subtitle">Study Guides &bull; Raw Handouts &bull; Active &rarr;</span>
              </span>
            </button>
          </div>

          <div class="subject-actions-row">
            <button class="btn-card-action btn-secondary-glass" onclick="App.openSubjectHandouts('${s.code}', 'PRELIM')">
              📁 Prelim Archive
            </button>
            <button class="btn-card-action btn-secondary-glass" onclick="App.startSubjectQuiz('${s.id}')">
              ⚡ Flashcards &amp; Quiz
            </button>
          </div>
        </div>
      </div>
      `;
    }).join('');

    this.renderHomeSubjectsCarousel();
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
    this.handoutCategoryFilter = 'ALL';
    const modal = document.getElementById('handoutsModal');
    if (!modal) return;
    this.renderHandoutsModalContent();
    modal.classList.add('open');
  },

  switchHandoutPeriod(period) {
    this.activeHandoutPeriod = period;
    this.handoutCategoryFilter = 'ALL';
    this.renderHandoutsModalContent();
  },

  renderHandoutsModalContent() {
    const subjectCode = this.activeHandoutSubject;
    const titleEl = document.getElementById('handoutsModalTitle');
    const listEl = document.getElementById('handoutsModalList');
    if (!subjectCode || !listEl) return;

    const sub = this.subjects.find(s => s.code === subjectCode);
    if (titleEl) {
      titleEl.innerHTML = `<span>${subjectCode} &mdash; ${sub ? sub.title : ''}</span>`;
    }

    const allSubjectItems = this.handouts.filter(h => h.subjectCode === subjectCode);
    const midtermItems = allSubjectItems.filter(h => h.period === 'MIDTERM');
    const prelimItems = allSubjectItems.filter(h => h.period === 'PRELIM');

    const activeList = this.activeHandoutPeriod === 'MIDTERM' ? midtermItems : prelimItems;
    const studyGuides = activeList.filter(h => this.isStudyGuideHandout(h));
    const rawHandouts = activeList.filter(h => !this.isStudyGuideHandout(h));

    const renderCard = (h, isGuide) => {
      const isOffline = typeof OfflineStorageModule !== 'undefined' && OfflineStorageModule.isFileSavedOffline(h.id);
      const isMidterm = h.period === 'MIDTERM';
      const fileUrl = h.downloadUrl || '#';
      const cardClass = isGuide ? 'handout-card study-guide-card' : 'handout-card raw-handout-card';
      const typeBadge = isGuide 
        ? '<span class="doc-badge doc-badge-guide">✨ GENERATED STUDY GUIDE</span>' 
        : '<span class="doc-badge doc-badge-raw">📖 RAW LECTURE MODULE</span>';

      return `
        <div class="${cardClass}">
          <div style="display:flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
            <div style="display:flex; align-items:center; gap: 6px; flex-wrap: wrap;">
              <span class="period-badge ${isMidterm ? 'midterm' : 'prelim'}">
                ${isMidterm ? '🎯 MIDTERM' : '📁 PRELIM'}
              </span>
              ${typeBadge}
            </div>
            <span class="doc-format-pill">${h.format}</span>
          </div>

          <h4 class="doc-card-title">${h.title}</h4>
          <p class="doc-card-summary">${h.summary}</p>
          
          <div class="doc-card-meta">
            <span>📦 <strong>Size:</strong> ${h.fileSize || 'Standard'}</span>
            <span>📑 <strong>Type:</strong> ${h.type || (isGuide ? 'Study Guide' : 'Handout')}</span>
            ${isGuide ? '<span class="doc-source-note">⚡ Based on Raw Handouts</span>' : ''}
          </div>

          <div class="doc-card-actions">
            <a href="${fileUrl}" target="_blank" download class="btn-primary doc-btn-download">
              📥 Download Document
            </a>
            <button class="btn-offline ${isOffline ? 'saved-offline' : ''}" onclick="OfflineStorageModule.toggleOfflineSave('${h.id}', '${fileUrl}', this)">
              ${isOffline ? '✅ Available Offline' : '📶 Save for Offline'}
            </button>
          </div>
        </div>
      `;
    };

    listEl.innerHTML = `
      <!-- Segmented Control Period Switcher (Midterm vs Prelim) -->
      <div class="period-tab-group">
        <button class="period-tab-btn ${this.activeHandoutPeriod === 'MIDTERM' ? 'active' : ''}" onclick="App.switchHandoutPeriod('MIDTERM')">
          🎯 Midterm Materials (${midtermItems.length})
        </button>
        <button class="period-tab-btn ${this.activeHandoutPeriod === 'PRELIM' ? 'active' : ''}" onclick="App.switchHandoutPeriod('PRELIM')">
          📁 Prelim Archive (${prelimItems.length})
        </button>
      </div>

      <!-- Quick Sub-Category Filter -->
      <div class="handout-category-tabs">
        <button class="handout-cat-tab ${this.handoutCategoryFilter === 'ALL' ? 'active' : ''}" onclick="App.setHandoutCategoryFilter('ALL')">
          All Materials (${activeList.length})
        </button>
        <button class="handout-cat-tab ${this.handoutCategoryFilter === 'GUIDE' ? 'active' : ''}" onclick="App.setHandoutCategoryFilter('GUIDE')">
          ✨ Study Guides &amp; Reviewers (${studyGuides.length})
        </button>
        <button class="handout-cat-tab ${this.handoutCategoryFilter === 'RAW' ? 'active' : ''}" onclick="App.setHandoutCategoryFilter('RAW')">
          📖 Raw Handouts &amp; Modules (${rawHandouts.length})
        </button>
      </div>

      <div class="period-handouts-container">
        ${activeList.length === 0 ? `
          <div class="empty-handouts-box">
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">📂</div>
            <p style="font-weight: 700; font-size: 1rem; color: var(--text-main);">No ${this.activeHandoutPeriod.toLowerCase()} documents found for ${subjectCode}.</p>
            <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.25rem;">Outputs from your ${this.activeHandoutPeriod} folder will synchronize automatically.</p>
          </div>
        ` : `
          <!-- SECTION 1: GENERATED STUDY GUIDES & COMBINED REVIEWERS -->
          ${(this.handoutCategoryFilter === 'ALL' || this.handoutCategoryFilter === 'GUIDE') ? `
            <div class="handout-category-section">
              <div class="handout-section-banner guide-banner">
                <div class="banner-title-box">
                  <span class="banner-badge-orb gold-orb">✨</span>
                  <div>
                    <h4 class="banner-heading">Generated Study Guides &amp; Master Reviewers</h4>
                    <p class="banner-caption">Consolidated study guides synthesized directly from raw lecture handouts</p>
                  </div>
                </div>
                <span class="banner-count-tag gold-tag">${studyGuides.length} Available</span>
              </div>

              ${studyGuides.length > 0 ? `
                <div class="handout-cards-grid">
                  ${studyGuides.map(h => renderCard(h, true)).join('')}
                </div>
              ` : `
                <div class="empty-category-note">
                  <span>ℹ️ No standalone study guide yet for this period. Review raw handouts below or practice in Quiz Mode!</span>
                </div>
              `}
            </div>
          ` : ''}

          <!-- SECTION 2: RAW LECTURE HANDOUTS & COURSE MODULES -->
          ${(this.handoutCategoryFilter === 'ALL' || this.handoutCategoryFilter === 'RAW') ? `
            <div class="handout-category-section" style="margin-top: 1.5rem;">
              <div class="handout-section-banner raw-banner">
                <div class="banner-title-box">
                  <span class="banner-badge-orb blue-orb">📖</span>
                  <div>
                    <h4 class="banner-heading">Raw Lecture Handouts &amp; Course Materials</h4>
                    <p class="banner-caption">Original professor slides, syllabus modules, activities &amp; seatwork files</p>
                  </div>
                </div>
                <span class="banner-count-tag blue-tag">${rawHandouts.length} Available</span>
              </div>

              ${rawHandouts.length > 0 ? `
                <div class="handout-cards-grid">
                  ${rawHandouts.map(h => renderCard(h, false)).join('')}
                </div>
              ` : `
                <div class="empty-category-note">
                  <span>ℹ️ No separate raw lecture modules attached. All materials are consolidated in the study guide above.</span>
                </div>
              `}
            </div>
          ` : ''}
        `}
      </div>
    `;
  },

  openDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
      modal.classList.add('open');
      this.switchDownloadTab('android');
    }
  },

  closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) {
      modal.classList.remove('open');
    }
  },

  switchDownloadTab(tab) {
    const androidTab = document.getElementById('tabDownloadAndroid');
    const iosTab = document.getElementById('tabDownloadIos');
    const pwaTab = document.getElementById('tabDownloadPwa');

    const btnAndroid = document.getElementById('btnTabAndroid');
    const btnIos = document.getElementById('btnTabIos');
    const btnPwa = document.getElementById('btnTabPwa');

    if (androidTab) androidTab.style.display = tab === 'android' ? 'block' : 'none';
    if (iosTab) iosTab.style.display = tab === 'ios' ? 'block' : 'none';
    if (pwaTab) pwaTab.style.display = tab === 'pwa' ? 'block' : 'none';

    if (btnAndroid) btnAndroid.classList.toggle('active', tab === 'android');
    if (btnIos) btnIos.classList.toggle('active', tab === 'ios');
    if (btnPwa) btnPwa.classList.toggle('active', tab === 'pwa');
  },

  currentSearchCategory: 'all',
  activeSearchResults: [],

  initSearchModal() {
    const input = document.getElementById('globalSearchInput');
    const modal = document.getElementById('searchModal');
    if (input) {
      input.addEventListener('input', (e) => this.handleSearchInput(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeSearchModal();
      });
    }

    // Global keyboard shortcuts: Ctrl+K, Cmd+K, or "/"
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === '/' && !['input', 'textarea'].includes(document.activeElement?.tagName?.toLowerCase())) {
        e.preventDefault();
        this.openSearchModal();
      }
    });

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeSearchModal();
      });
    }
  },

  openSearchModal() {
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('globalSearchInput');
    if (modal) {
      modal.classList.add('open');
      if (input) {
        setTimeout(() => input.focus(), 80);
        this.handleSearchInput(input.value || '');
      }
    }
  },

  closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
      modal.classList.remove('open');
    }
  },

  clearSearchInput() {
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (input) {
      input.value = '';
      input.focus();
      this.handleSearchInput('');
    }
    if (clearBtn) clearBtn.style.display = 'none';
  },

  setSearchCategory(cat) {
    this.currentSearchCategory = cat;
    document.querySelectorAll('.search-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    const input = document.getElementById('globalSearchInput');
    this.handleSearchInput(input ? input.value : '');
  },

  handleSearchInput(query) {
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
      clearBtn.style.display = query.trim() ? 'block' : 'none';
    }
    this.renderSearchResults(query.trim().toLowerCase());
  },

  renderSearchResults(q) {
    const container = document.getElementById('searchResultsList');
    if (!container) return;

    const cat = this.currentSearchCategory;
    const results = [];

    // 1. Search Subjects
    if (cat === 'all' || cat === 'subjects') {
      const subs = this.subjects || [];
      subs.forEach(s => {
        const titleStr = s.title || s.name || '';
        const codeStr = s.code || s.id || '';
        const descStr = s.description || '';
        const titleMatch = titleStr.toLowerCase().includes(q) || codeStr.toLowerCase().includes(q) || descStr.toLowerCase().includes(q);
        if (!q || titleMatch) {
          results.push({
            type: 'subject',
            icon: '📚',
            title: titleStr,
            sub: `${codeStr} • ${s.instructor || 'Prof'} • Room ${s.room || 'TBA'}`,
            badge: `${(s.midtermTopics || s.topics || []).length} Topics`,
            action: () => {
              this.closeSearchModal();
              this.switchView('subjects');
            }
          });
        }
      });
    }

    // 2. Search Handouts & Reviewers
    if (cat === 'all' || cat === 'handouts') {
      const hands = this.handouts || [];
      hands.forEach(h => {
        const titleMatch = h.title.toLowerCase().includes(q) || (h.subject && h.subject.toLowerCase().includes(q)) || (h.term && h.term.toLowerCase().includes(q));
        if (!q || titleMatch) {
          results.push({
            type: 'handout',
            icon: '📄',
            title: h.title,
            sub: `${h.subject || 'STI 2G'} • ${h.term || 'Midterm'} Reviewer (${h.fileType || 'Doc'})`,
            badge: h.term || 'Handout',
            action: () => {
              this.closeSearchModal();
              if (h.downloadUrl) {
                window.open(h.downloadUrl, '_blank');
              } else {
                this.switchView('subjects');
              }
            }
          });
        }
      });
    }

    // 3. Search Schedule & Rooms
    if (cat === 'all' || cat === 'schedule') {
      const schedule = (typeof ScheduleModule !== 'undefined' && ScheduleModule.classes) ? ScheduleModule.classes : [];
      schedule.forEach(c => {
        const subStr = c.subject || '';
        const roomStr = c.room || '';
        const profStr = c.instructor || '';
        const dayStr = c.day || '';
        const match = subStr.toLowerCase().includes(q) || roomStr.toLowerCase().includes(q) || profStr.toLowerCase().includes(q) || dayStr.toLowerCase().includes(q);
        if (!q || match) {
          results.push({
            type: 'schedule',
            icon: '🕒',
            title: `${subStr} (${c.type || 'Lec'})`,
            sub: `${dayStr} ${c.startTime || ''}-${c.endTime || ''} • Room ${roomStr} • ${profStr}`,
            badge: roomStr || 'Class',
            action: () => {
              this.closeSearchModal();
              this.switchView('schedule');
            }
          });
        }
      });
    }

    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-empty-state">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">🔍</div>
          <div>No results found for "<strong>${q}</strong>"</div>
          <div style="font-size: 0.75rem; margin-top: 0.25rem; opacity: 0.8;">Try searching for a subject code (e.g. COSC1001), handout, or room (B305).</div>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map((r, idx) => `
      <div class="search-result-item" onclick="App.triggerSearchResult(${idx})">
        <div class="search-result-left">
          <div class="search-result-icon">${r.icon}</div>
          <div class="search-result-info">
            <div class="search-result-title">${r.title}</div>
            <div class="search-result-sub">${r.sub}</div>
          </div>
        </div>
        <span class="search-result-badge">${r.badge}</span>
      </div>
    `).join('');

    this.activeSearchResults = results;
  },

  triggerSearchResult(index) {
    if (this.activeSearchResults && this.activeSearchResults[index]) {
      this.activeSearchResults[index].action();
    }
  },

  checkAppDownloadedState() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isAppProtocol = window.location.protocol === 'file:' || window.isAndroidApp || navigator.userAgent.includes('wv') || (window.location.hostname === 'localhost' && window.location.port !== '3000');
    const isDownloaded = localStorage.getItem('sti2g_app_downloaded') === 'true';
    const inSim = document.documentElement.classList.contains('in-simulator') || new URLSearchParams(window.location.search).get('sim') === 'iphone' || window.self !== window.top;

    if (isStandalone || isAppProtocol || isDownloaded || inSim) {
      document.documentElement.classList.add('app-downloaded');
      document.body.classList.add('app-downloaded');
      document.querySelectorAll('.app-download-hero-card, .web-only-control').forEach(el => {
        el.style.display = 'none';
      });
    }
  },

  markAppDownloaded() {
    localStorage.setItem('sti2g_app_downloaded', 'true');
    document.documentElement.classList.add('app-downloaded');
    document.body.classList.add('app-downloaded');
    document.querySelectorAll('.app-download-hero-card, .web-only-control').forEach(el => {
      el.style.display = 'none';
    });
  },

  initModals() {
    // Handouts modal close
    const handoutsModal = document.getElementById('handoutsModal');
    const closeHandoutsBtn = document.getElementById('closeHandoutsModalBtn');
    if (closeHandoutsBtn && handoutsModal) {
      closeHandoutsBtn.addEventListener('click', () => handoutsModal.classList.remove('open'));
    }

    // App Download modal close
    const downloadModal = document.getElementById('downloadModal');
    const closeDownloadBtn = document.getElementById('closeDownloadModalBtn');
    if (closeDownloadBtn && downloadModal) {
      closeDownloadBtn.addEventListener('click', () => downloadModal.classList.remove('open'));
    }

    // Onboarding Terms & Permissions modal close
    const onboardingModal = document.getElementById('onboardingModal');
    const closeOnboardingBtn = document.getElementById('closeOnboardingModalBtn');
    if (closeOnboardingBtn && onboardingModal) {
      closeOnboardingBtn.addEventListener('click', () => onboardingModal.classList.remove('open'));
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


    // Delegated modal backdrop click & Escape key dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
        App.closeSidebar();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('open');
      }
    });
  },

  // -------------------------------------------------------------
  // STUDENT PROFILE PERSONALIZATION (100% Client-Side Offline)
  // -------------------------------------------------------------
  initUserProfile() {
    this.updateProfileDisplay();
  },

  getStudentName() {
    return localStorage.getItem('sti_2g_student_name') || '';
  },

  updateProfileDisplay() {
    const savedName = this.getStudentName();
    const nameEl = document.getElementById('userNameDisplay');
    const avatarEl = document.getElementById('userAvatarInitials');
    const homeAvatarEl = document.getElementById('homeAvatarInitials');
    const welcomeEl = document.getElementById('homeWelcomeHeading');

    if (savedName) {
      if (nameEl) nameEl.textContent = savedName;
      const parts = savedName.trim().split(/\s+/);
      const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : savedName.slice(0, 2).toUpperCase();
      if (avatarEl) avatarEl.textContent = initials;
      if (homeAvatarEl) homeAvatarEl.textContent = initials;
      if (welcomeEl) {
        welcomeEl.textContent = `Hello, ${savedName}! 👋`;
      }
    } else {
      if (nameEl) nameEl.textContent = 'JP';
      if (avatarEl) avatarEl.textContent = 'JP';
      if (homeAvatarEl) homeAvatarEl.textContent = 'JP';
      if (welcomeEl) {
        welcomeEl.textContent = 'Hello, JP! 👋';
      }
    }
  },

  openProfileModal() {
    const modal = document.getElementById('profileModal');
    const input = document.getElementById('studentNameInput');
    if (input) {
      input.value = this.getStudentName();
      setTimeout(() => input.focus(), 100);
    }
    if (modal) modal.classList.add('open');
  },

  closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('open');
  },

  saveStudentProfile(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('studentNameInput');
    const val = input ? input.value.trim() : '';
    if (val) {
      localStorage.setItem('sti_2g_student_name', val);
    } else {
      localStorage.removeItem('sti_2g_student_name');
    }
    this.updateProfileDisplay();
    this.closeProfileModal();
  },

  resetStudentProfile() {
    localStorage.removeItem('sti_2g_student_name');
    const input = document.getElementById('studentNameInput');
    if (input) input.value = '';
    this.updateProfileDisplay();
    this.closeProfileModal();
  },

  // -------------------------------------------------------------
  // ONBOARDING, TERMS & CONDITIONS & APP PERMISSIONS
  // -------------------------------------------------------------
  checkOnboardingTerms() {
    const accepted = localStorage.getItem('sti_2g_terms_accepted');
    if (!accepted) {
      setTimeout(() => {
        this.openOnboardingModal();
      }, 400);
    }
  },

  openOnboardingModal() {
    const modal = document.getElementById('onboardingModal');
    if (modal) {
      this.updatePermissionBadges();
      modal.classList.add('open');
    }
  },

  closeOnboardingModal() {
    const modal = document.getElementById('onboardingModal');
    if (modal) {
      modal.classList.remove('open');
    }
  },

  async acceptTermsAndPermissions(enableNotifs = true) {
    localStorage.setItem('sti_2g_terms_accepted', 'true');
    localStorage.setItem('sti_2g_terms_accepted_date', new Date().toISOString());

    // Unlock Web Audio context on user gesture so campus chimes can ring automatically
    if (typeof ScheduleModule !== 'undefined' && ScheduleModule.playChime) {
      ScheduleModule.playChime();
    }

    if (enableNotifs) {
      if (window.AndroidBridge && typeof window.AndroidBridge.requestNotificationPermission === 'function') {
        try {
          window.AndroidBridge.requestNotificationPermission();
          if (typeof ScheduleModule !== 'undefined' && ScheduleModule.sendSystemNotification) {
            ScheduleModule.sendSystemNotification(
              'STI Omni Class Warnings Activated 🎓',
              'You will receive automatic alerts 30m, 10m, and 5m before each class begins!'
            );
          }
        } catch (e) {
          console.warn('AndroidBridge error', e);
        }
      } else if ('Notification' in window) {
        try {
          const perm = await Notification.requestPermission();
          if (typeof ScheduleModule !== 'undefined') {
            ScheduleModule.updateNotifButtonLabel();
            if (perm === 'granted') {
              ScheduleModule.sendSystemNotification(
                'STI Omni Class Warnings Activated 🎓',
                'You will receive automatic alerts 30m, 10m, and 5m before each class begins!'
              );
            }
          }
        } catch (err) {
          console.warn('Notification permission error', err);
        }
      }
    }

    this.updatePermissionBadges();
    this.closeOnboardingModal();
  },

  updatePermissionBadges() {
    const notifBadge = document.getElementById('permNotifStatus');
    const audioBadge = document.getElementById('permAudioStatus');
    const storageBadge = document.getElementById('permStorageStatus');

    if (notifBadge) {
      if (window.AndroidBridge) {
        const hasPerm = typeof window.AndroidBridge.hasNotificationPermission === 'function' ? window.AndroidBridge.hasNotificationPermission() : true;
        if (hasPerm) {
          notifBadge.textContent = 'Active 🔔';
          notifBadge.className = 'permission-status-pill granted';
        } else {
          notifBadge.textContent = 'Required ⚠️';
          notifBadge.className = 'permission-status-pill pending';
        }
      } else if (!('Notification' in window)) {
        notifBadge.textContent = 'In-App Ready 🔔';
        notifBadge.className = 'permission-status-pill granted';
      } else if (Notification.permission === 'granted') {
        notifBadge.textContent = 'Active 🔔';
        notifBadge.className = 'permission-status-pill granted';
      } else if (Notification.permission === 'denied') {
        notifBadge.textContent = 'Blocked 🔕';
        notifBadge.className = 'permission-status-pill denied';
      } else {
        notifBadge.textContent = 'Required ⚠️';
        notifBadge.className = 'permission-status-pill pending';
      }
    }

    if (audioBadge) {
      audioBadge.textContent = 'Ready 🔊';
      audioBadge.className = 'permission-status-pill granted';
    }

    if (storageBadge) {
      storageBadge.textContent = 'Offline Ready 💾';
      storageBadge.className = 'permission-status-pill granted';
    }
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('appToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'appToastContainer';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `app-toast-pill ${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  },

  // -------------------------------------------------------------
  // HOMEPAGE CONTROLLER METHODS (ENGAGING UI)
  // -------------------------------------------------------------
  renderHomeSubjectsCarousel() {
    const container = document.getElementById('homeSubjectsCarousel');
    if (!container) return;

    if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
      if (typeof DEFAULT_SUBJECTS !== 'undefined' && Array.isArray(DEFAULT_SUBJECTS)) {
        this.subjects = DEFAULT_SUBJECTS;
      }
    }

    if (!Array.isArray(this.subjects) || this.subjects.length === 0) {
      container.innerHTML = '<div style="padding:1rem;color:var(--text-muted);font-size:0.8rem;">Loading subjects...</div>';
      return;
    }

    container.innerHTML = this.subjects.map(s => {
      const code = s.code || s.id;
      const title = s.title || s.name || 'Subject';
      const units = s.units ? `${s.units} Units` : '3 Units';
      const midtermTopicsCount = (s.midtermTopics && s.midtermTopics.length) || 0;
      const color = s.accentColor || '#38bdf8';

      return `
        <div class="home-subject-chip-card" onclick="App.openSubjectHandouts('${code}', 'MIDTERM')" title="Open ${title} Study Guides">
          <div class="subject-chip-top">
            <span class="subject-chip-code" style="color: ${color}; border-color: ${color}40; background: ${color}1a;">${code}</span>
            <span class="subject-chip-units">${units}</span>
          </div>
          <div class="subject-chip-title">${title}</div>
          <div class="subject-chip-footer">
            <span>${midtermTopicsCount} Midterm Topics</span>
            <span class="subject-chip-handouts-link">&rarr;</span>
          </div>
        </div>
      `;
    }).join('');
  },

  updateHomeClassRadar() {
    if (typeof ScheduleModule === 'undefined' || !ScheduleModule.data || !ScheduleModule.data.length) return;

    const radarStatusLabel = document.getElementById('radarStatusLabel');
    const radarCountdownBadge = document.getElementById('radarCountdownBadge');
    const radarSubjectTitle = document.getElementById('radarSubjectTitle');
    const radarRoomChip = document.getElementById('radarRoomChip');
    const radarTimeChip = document.getElementById('radarTimeChip');
    const radarProfChip = document.getElementById('radarProfChip');
    if (!radarSubjectTitle) return;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayClasses = ScheduleModule.data.filter(c => c.day && c.day.toLowerCase() === currentDay.toLowerCase());

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
      if (radarStatusLabel) radarStatusLabel.textContent = 'IN CLASS NOW';
      if (radarCountdownBadge) radarCountdownBadge.textContent = `Ends at ${ScheduleModule.formatTime12h(ongoing.endTime)}`;
      radarSubjectTitle.textContent = `${ongoing.subjectCode} — ${ongoing.subjectTitle}`;
      if (radarRoomChip) radarRoomChip.textContent = `📍 ${ongoing.room || 'TBA'}`;
      if (radarTimeChip) radarTimeChip.textContent = `🕒 ${ScheduleModule.formatTime12h(ongoing.startTime)} – ${ScheduleModule.formatTime12h(ongoing.endTime)}`;
      if (radarProfChip) radarProfChip.textContent = `👤 ${ongoing.instructor || 'BSIT 2G Faculty'}`;
    } else if (upNext) {
      const mins = upNext.startTotal - currentMinutes;
      if (radarStatusLabel) radarStatusLabel.textContent = mins <= 20 ? 'STARTING SOON' : 'UP NEXT CLASS';
      if (radarCountdownBadge) radarCountdownBadge.textContent = ScheduleModule.formatCountdown(mins);
      radarSubjectTitle.textContent = `${upNext.subjectCode} — ${upNext.subjectTitle}`;
      if (radarRoomChip) radarRoomChip.textContent = `📍 ${upNext.room || 'TBA'}`;
      if (radarTimeChip) radarTimeChip.textContent = `🕒 ${ScheduleModule.formatTime12h(upNext.startTime)} – ${ScheduleModule.formatTime12h(upNext.endTime)}`;
      if (radarProfChip) radarProfChip.textContent = `👤 ${upNext.instructor || 'BSIT 2G Faculty'}`;
    } else {
      const nextFuture = ScheduleModule.getNextUpcomingClass(now.getDay());
      if (nextFuture) {
        if (radarStatusLabel) radarStatusLabel.textContent = nextFuture.isTomorrow ? 'TOMORROW’S CLASS' : `UPCOMING ON ${nextFuture.dayName.toUpperCase()}`;
        if (radarCountdownBadge) radarCountdownBadge.textContent = nextFuture.isTomorrow ? 'Tomorrow' : nextFuture.dayName;
        radarSubjectTitle.textContent = `${nextFuture.subjectCode} — ${nextFuture.subjectTitle}`;
        if (radarRoomChip) radarRoomChip.textContent = `📍 ${nextFuture.room || 'TBA'}`;
        if (radarTimeChip) radarTimeChip.textContent = `🕒 ${ScheduleModule.formatTime12h(nextFuture.startTime)} – ${ScheduleModule.formatTime12h(nextFuture.endTime)}`;
        if (radarProfChip) radarProfChip.textContent = `👤 ${nextFuture.instructor || 'BSIT 2G Faculty'}`;
      } else {
        if (radarStatusLabel) radarStatusLabel.textContent = 'SEMESTER BREAK / NO CLASSES';
        if (radarCountdownBadge) radarCountdownBadge.textContent = 'All Clear';
        radarSubjectTitle.textContent = 'No classes scheduled right now';
        if (radarRoomChip) radarRoomChip.textContent = '📍 Campus Closed';
        if (radarTimeChip) radarTimeChip.textContent = '🕒 Relax & Study';
        if (radarProfChip) radarProfChip.textContent = '👤 Section 2G';
      }
    }
  },

  dailyProTips: [
    "In Data Structures, Stacks follow <strong>LIFO</strong> (Last-In, First-Out) while Queues follow <strong>FIFO</strong> (First-In, First-Out). Master this distinction for your COSC1003 Midterm Exam!",
    "In Human-Computer Interaction (HCI), <strong>Jakob Nielsen's 1st Heuristic</strong> is 'Visibility of system status' — always keep users informed of what is happening with immediate feedback.",
    "For Platform Technology (OS), <strong>Preemptive Scheduling</strong> allows the CPU to interrupt running tasks (like Round Robin & SRTF), while <strong>Non-Preemptive</strong> lets processes run until completion (like FCFS).",
    "In Rizal's Life and Works, <strong>Republic Act No. 1425</strong> (The Rizal Law) was authored primarily by Senator Claro M. Recto and signed into law by President Ramon Magsaysay in 1956.",
    "In Philippine History, <strong>Primary Sources</strong> are firsthand eyewitness accounts created during the time period (e.g. Pigafetta's chronicle), while <strong>Secondary Sources</strong> analyze or interpret them later.",
    "In Principles of Communication, noise can be <strong>Physical</strong> (external sound), <strong>Physiological</strong> (hearing impairment, fatigue), or <strong>Psychological</strong> (prejudice, anxiety).",
    "In Web Development, an efficient application utilizes <strong>IndexedDB</strong> and <strong>Service Workers</strong> to deliver 100% offline functionality without waiting on network roundtrips."
  ],
  currentProTipIndex: 0,

  rotateDailyProTip() {
    const el = document.getElementById('homeProTipText');
    if (!el || !this.dailyProTips.length) return;
    el.style.opacity = '0';
    setTimeout(() => {
      this.currentProTipIndex = (this.currentProTipIndex + 1) % this.dailyProTips.length;
      el.innerHTML = `"${this.dailyProTips[this.currentProTipIndex]}"`;
      el.style.opacity = '1';
    }, 200);
  }
};

// Simulator Environment Detection (e.g. VS Code Live Preview iframe or ?sim=iphone)
try {
  if (window.self !== window.top || new URLSearchParams(window.location.search).get('sim') === 'iphone') {
    document.documentElement.classList.add('in-simulator');
    document.documentElement.setAttribute('data-simulator', 'true');
    if (document.body) {
      document.body.classList.add('in-simulator');
      document.body.setAttribute('data-simulator', 'true');
    }
  }
} catch (e) {
  document.documentElement.classList.add('in-simulator');
  document.documentElement.setAttribute('data-simulator', 'true');
}

// Global attachment for inline onclick and iframe host access
window.App = App;

// Launch Application on DOM Ready (immediate if already loaded or in iframe)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
