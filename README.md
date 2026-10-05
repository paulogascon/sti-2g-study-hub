# STI 2G Study Hub 🎓

A student-first academic portal and native mobile application engineered specifically for **STI West Negros University — BSIT 2G (1st Semester, SY 2026–2027)**.

---

## 📱 Mobile Installation & Download Links

### 🤖 For Android Users (Direct APK Download):
1. Go to the **[Releases](../../releases/latest)** section on GitHub.
2. Download **`STI_2G_Study_Hub.apk`**.
3. Tap **Install** on your Android phone.
4. The app installs directly into your app drawer with the STI icon and runs **100% offline** without needing mobile data or Wi-Fi!

### 🍏 For iPhone (iOS) Users:
1. Open the GitHub Pages link (`https://<username>.github.io/sti-2g-study-hub/`) in Safari.
2. Tap the **Share** button (box with upward arrow) &rarr; select **"Add to Home Screen"**.
3. The app installs as a native standalone app with the official STI icon, fullscreen mode, and full offline caching!

---

## 🌟 Key Application Features

* **Real-time Class Timetable & Warning Alerts**:
  * Live warning banners at **30 minutes** and **10 minutes** before class begins.
  * Audio synthesizer chime (Web Audio API) and system notifications.
  * Synchronized with official STI School Automate room assignments and professors.
* **Google Drive-Style "Available Offline" Mode**:
  * Tap **"📶 Make Available Offline"** on any handout or guide to cache it locally.
  * Read and review files on campus even when there is **zero Wi-Fi or cellular network**.
* **8-Course Curriculum Repository**:
  * Handouts, activities, and reviewers across all 23 units:
    * `COSC1001` — Principles of Communication (Escauso, Irene May C.)
    * `COSC1003` — Data Structure and Algorithms (Angus, Cherry Ann A.)
    * `COSC1007` — Human-Computer Interaction (Pasion, Charis B.)
    * `COSC1008` — Platform Technology 1 (Gonzales, Danly S.)
    * `GEDC 1006` — Readings in Philippine History (Pama, Delia P.)
    * `GEDC 1014` — Rizal's Life and Works (Angeles, Jocen B.)
    * `INTE1051` — IT Elective I (Pasion, Charis B.)
    * `PHED 1007` — P.E./PATHFIT 3 (Sagon, Benjamin Romel G.)
* **Interactive Practice Quizzes & Flashcards**:
  * 3D flip cards for active recall.
  * Practice test runner with instant scoring and detailed answer rationales.
* **Deadlines & Midterm Exam Countdown**:
  * Task manager for lab tasks and deliverables with urgency tags.

---

## 🏗 Project Architecture

```
STI 2G Study Hub/
├── .github/
│   └── workflows/
│       └── build-apk.yml      # Automated GitHub Actions workflow building the Android APK
├── android/                   # Native Android WebView & Gradle wrapper project
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/sti/studyhub/MainActivity.java
│   │       └── assets/        # Bundled offline web app files
│   ├── build.gradle
│   └── settings.gradle
├── index.html                 # Main single-page application entry point
├── manifest.json              # PWA mobile manifest
├── sw.js                      # Service Worker offline cache engine
├── css/
│   └── style.css              # Theme tokens, card layouts, animations
├── js/
│   ├── app.js                 # App router, theme switcher, modal manager
│   ├── schedule.js            # Timetable matrix and class warning alerts
│   ├── offline-storage.js     # Google Drive-style offline cache manager
│   ├── quiz.js                # Flashcards & mock exam engine
│   ├── tasks.js               # Deliverables manager & exam countdown
│   └── data/
│       ├── seeds.js           # Embedded offline fallback seed data
│       ├── subjects.json      # Course catalog and faculty assignments
│       ├── schedule.json      # BSIT 2G timetable data
│       ├── quizzes.json       # Question bank and flashcards
│       └── handouts.json      # Linked handouts catalog
└── assets/
    └── icons/                 # 192x192 & 512x512 PNG app icons
```

---

## 👨‍💻 Author & Section
* **Student**: Jhon Paulo V. Gascon (JP)
* **Section**: BSIT 2G
* **School**: STI West Negros University (STI WNU), Bacolod City
