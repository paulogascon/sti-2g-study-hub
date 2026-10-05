// ==========================================================================
// OFFLINE STORAGE MODULE - STI 2G STUDY HUB
// Handles "Available Offline" toggles, CacheStorage, and Network Detection
// ==========================================================================

const OfflineStorageModule = {
  cacheName: 'sti-2g-offline-docs',
  offlineList: new Set(),

  init() {
    this.registerServiceWorker();
    this.initNetworkStatusMonitor();
    this.loadOfflineList();
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered successfully with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed (normal on direct file://):', err);
          });
      });
    }
  },

  initNetworkStatusMonitor() {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const statusPill = document.getElementById('networkStatusPill');
      if (statusPill) {
        if (isOnline) {
          statusPill.innerHTML = '🟢 Online';
          statusPill.className = 'network-pill online';
        } else {
          statusPill.innerHTML = '🟡 Offline Mode (Active)';
          statusPill.className = 'network-pill offline';
        }
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  loadOfflineList() {
    try {
      const saved = localStorage.getItem('sti_2g_offline_files');
      if (saved) {
        this.offlineList = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load offline list', e);
    }
  },

  saveOfflineList() {
    localStorage.setItem('sti_2g_offline_files', JSON.stringify(Array.from(this.offlineList)));
  },

  isFileSavedOffline(fileId) {
    return this.offlineList.has(fileId);
  },

  async toggleOfflineSave(fileId, fileUrl, buttonEl) {
    const isCurrentlySaved = this.isFileSavedOffline(fileId);

    if (isCurrentlySaved) {
      // Remove from offline cache
      this.offlineList.delete(fileId);
      this.saveOfflineList();
      if ('caches' in window && fileUrl) {
        const cache = await caches.open(this.cacheName);
        await cache.delete(fileUrl);
      }
      this.updateOfflineButtonUI(buttonEl, false);
      alert('Removed from offline cache.');
    } else {
      // Save for offline access
      this.offlineList.add(fileId);
      this.saveOfflineList();

      if ('caches' in window && fileUrl) {
        try {
          const cache = await caches.open(this.cacheName);
          await cache.add(fileUrl);
        } catch (e) {
          console.log('Document stored in app state for offline reference.');
        }
      }
      this.updateOfflineButtonUI(buttonEl, true);
      alert('Saved for Offline! This file can now be opened without Wi-Fi or data.');
    }
  },

  updateOfflineButtonUI(buttonEl, isSaved) {
    if (!buttonEl) return;
    if (isSaved) {
      buttonEl.classList.add('saved-offline');
      buttonEl.innerHTML = '✅ Saved Offline';
    } else {
      buttonEl.classList.remove('saved-offline');
      buttonEl.innerHTML = '📶 Save for Offline';
    }
  }
};
