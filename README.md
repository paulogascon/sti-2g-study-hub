# STI 2G Study Hub 🎓

A student-first academic portal and productivity web application engineered specifically for **STI West Negros University — BSIT 2G (1st Semester, SY 2026–2027)**.

---

## 🌟 Key Features

* **Weekly Timetable Matrix & Live Ticker**:
  * Real-time "Ongoing Class" and "Up Next" indicator synchronized with the official STI School Automate schedule.
  * Interactive day filters (Monday to Saturday) with custom slot editor.
* **8-Course Curriculum Repository**:
  * Direct links to handouts and study guides for all 23 units:
    * `COSC1001` — Principles of Communication
    * `COSC1003` — Data Structure and Algorithms
    * `COSC1007` — Human-Computer Interaction
    * `COSC1008` — Platform Technology 1 (Operating Systems)
    * `GEDC 1006` — Readings in Philippine History
    * `GEDC 1014` — Rizal's Life and Works
    * `INTE1051` — IT Elective I
    * `PHED 1007` — P.E./PATHFIT 3
* **Interactive Reviewer & Quiz Engine**:
  * 3D flip flashcards for active recall.
  * Practice quiz mode with real-time scoring and answer rationales.
* **Academic Deliverables & Deadlines**:
  * Task manager for lab activities, seatworks, and performance tasks.
  * Live countdown timer to Midterm Examination Week.
* **Offline-First & Theme Support**:
  * Zero-setup: double-click `index.html` to run locally in any browser.
  * Dark and Light theme toggle.

---

## 📂 Project Structure

```
STI 2G Study Hub/
├── index.html                 # Main web application entry point
├── README.md                  # Project overview and documentation
├── .gitignore                 # Git ignore rules
├── docs/
│   └── BLUEPRINT.md           # Master architectural blueprint
├── css/
│   └── style.css              # Theme tokens, card layouts, animations
├── js/
│   ├── app.js                 # App router, theme switcher, modal manager
│   ├── schedule.js            # Timetable matrix and live class ticker
│   ├── quiz.js                # Flashcards & mock test exam engine
│   ├── tasks.js               # Deliverables manager & exam countdown
│   └── data/
│       ├── seeds.js           # Embedded offline fallback seed data
│       ├── subjects.json      # Course catalog and faculty assignments
│       ├── schedule.json      # BSIT 2G timetable data
│       ├── quizzes.json       # Question bank and flashcards
│       └── handouts.json      # Linked handouts from STI FOLDER
└── assets/
    └── icons/                 # UI assets and SVG icons
```

---

## 🚀 How to Run

1. Open File Explorer to `C:\Paulo files\My Projects\STI 2G Study Hub\`.
2. Double-click **`index.html`** in any web browser (Chrome, Edge, Opera).
3. (Optional) In VS Code, right-click `index.html` and click **"Open with Live Server"**.

---

## 👨‍💻 Author & Section
* **Student**: Jhon Paulo V. Gascon (JP)
* **Section**: BSIT 2G
* **Institution**: STI West Negros University (STI WNU), Bacolod City
