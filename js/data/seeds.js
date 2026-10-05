// ==========================================================================
// DEFAULT SEED DATA - STI 2G STUDY HUB
// Offline & double-click file:// safe fallbacks
// ==========================================================================

const DEFAULT_SUBJECTS = [
  {
    id: "COSC1003",
    code: "COSC1003",
    title: "Data Structure and Algorithms",
    units: 3,
    category: "Major Course",
    instructor: "Angus, Cherry Ann A.",
    room: "B305 (Lec) / B102 (Lab)",
    accentColor: "#2563EB",
    bgGradient: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
    icon: "code-bracket",
    description: "Fundamental data structures (Arrays, Linked Lists, Stacks, Queues, Trees) and algorithmic complexity (Big O, sorting, searching).",
    midtermTopics: [
      "Abstract Data Types & Big-O Notation",
      "Singly and Doubly Linked Lists",
      "Stacks (LIFO) & Queues (FIFO)",
      "Trees & Binary Search Trees (BST)",
      "Sorting & Searching Algorithms"
    ]
  },
  {
    id: "COSC1007",
    code: "COSC1007",
    title: "Human-Computer Interaction",
    units: 3,
    category: "Major Course",
    instructor: "Pasion, Charis B.",
    room: "B207 (Lec) / MN307 (Lab)",
    accentColor: "#0D9488",
    bgGradient: "linear-gradient(135deg, #115E59 0%, #14B8A6 100%)",
    icon: "cursor-arrow-rays",
    description: "Design principles, usability engineering, user testing, heuristic evaluation, and interaction design for web/mobile interfaces.",
    midtermTopics: [
      "HCI Foundations & User-Centered Design",
      "Nielsen's 10 Usability Heuristics",
      "Hierarchical Task Analysis (HTA)",
      "Prototyping & Wireframing",
      "Usability Testing & Metrics"
    ]
  },
  {
    id: "COSC1008",
    code: "COSC1008",
    title: "Platform Technology 1 (Operating Systems)",
    units: 3,
    category: "Major Course",
    instructor: "Gonzales, Danly S.",
    room: "B304 (Lec) / MN306 (Lab)",
    accentColor: "#7C3AED",
    bgGradient: "linear-gradient(135deg, #5B21B6 0%, #8B5CF6 100%)",
    icon: "cpu-chip",
    description: "Operating system architecture, process management, CPU scheduling, concurrency, memory allocation, and virtual storage.",
    midtermTopics: [
      "OS Architecture & System Calls",
      "Process Lifecycle & PCB",
      "CPU Scheduling Algorithms (FCFS, SJF, RR)",
      "Process Synchronization & Deadlocks",
      "Memory Management & Paging"
    ]
  },
  {
    id: "INTE1051",
    code: "INTE1051",
    title: "IT Elective I",
    units: 3,
    category: "IT Elective",
    instructor: "Pasion, Charis B.",
    room: "B207 (Lec) / MN308 (Lab)",
    accentColor: "#D97706",
    bgGradient: "linear-gradient(135deg, #92400E 0%, #F59E0B 100%)",
    icon: "sparkles",
    description: "Specialized technologies, modern development environments, application logic, and industry workflows.",
    midtermTopics: [
      "Modern Development Paradigms",
      "Component Architecture & State Management",
      "API Integrations & Data Flow",
      "Testing & Deployment Best Practices"
    ]
  },
  {
    id: "COSC1001",
    code: "COSC1001",
    title: "Principles of Communication",
    units: 3,
    category: "Core Foundation",
    instructor: "Escauso, Irene May C.",
    room: "ONLINE (W 5:30PM-8:30PM)",
    accentColor: "#0284C7",
    bgGradient: "linear-gradient(135deg, #075985 0%, #0EA5E9 100%)",
    icon: "chat-bubble-left-right",
    description: "Data communications, signal transmission, network topologies, OSI/TCP layers, and digital modulation basics.",
    midtermTopics: [
      "Transmission Media & Signal Characteristics",
      "Modulation Techniques (AM, FM, PM)",
      "OSI 7-Layer Reference Model",
      "Multiplexing & Error Detection Codes"
    ]
  },
  {
    id: "GEDC1006",
    code: "GEDC 1006",
    title: "Readings in Philippine History",
    units: 3,
    category: "General Education",
    instructor: "Pama, Delia P.",
    room: "B305 (F 1:00PM-4:00PM)",
    accentColor: "#DC2626",
    bgGradient: "linear-gradient(135deg, #991B1B 0%, #EF4444 100%)",
    icon: "book-open",
    description: "Critical analysis of primary sources, historical controversies, customs, and socioeconomic evolution of the Philippines.",
    midtermTopics: [
      "Primary vs. Secondary Sources Analysis",
      "Customs of the Tagalogs & Early Visayan Societies",
      "Cavite Mutiny & Propaganda Movement",
      "Philippine Constitution Evolution"
    ]
  },
  {
    id: "GEDC1014",
    code: "GEDC 1014",
    title: "Rizal's Life and Works",
    units: 3,
    category: "General Education",
    instructor: "Angeles, Jocen B.",
    room: "MN424 (M 5:30PM-8:30PM)",
    accentColor: "#B91C1C",
    bgGradient: "linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)",
    icon: "academic-cap",
    description: "Life, writings, exile, trial, and enduring legacy of Dr. Jose Rizal; analysis of Noli Me Tangere and El Filibusterismo.",
    midtermTopics: [
      "Rizal Law (RA 1425) Context & Rationale",
      "19th Century Philippines under Spanish Rule",
      "Rizal's European Education & Propaganda Writings",
      "Analysis of Noli Me Tangere & El Filibusterismo"
    ]
  },
  {
    id: "PHED1007",
    code: "PHED 1007",
    title: "P.E./PATHFIT 3: Individual-Dual Sports",
    units: 2,
    category: "Physical Education",
    instructor: "Sagon, Benjamin Romel G.",
    room: "FIELD 4 (T 10:00AM-12:00PM)",
    accentColor: "#16A34A",
    bgGradient: "linear-gradient(135deg, #166534 0%, #22C55E 100%)",
    icon: "heart",
    description: "Physical activity and fitness training, movement competency, health wellness, and sports-related skills.",
    midtermTopics: [
      "Physical Fitness Assessments & Metrics",
      "Cardiovascular Endurance & Aerobics",
      "Movement Mechanics & Injury Prevention",
      "Personal Fitness Regimen Design"
    ]
  }
];

const DEFAULT_SCHEDULE = [
  {
    id: "sched_1",
    day: "Monday",
    startTime: "08:00",
    endTime: "10:00",
    subjectCode: "COSC1003",
    subjectTitle: "Data Structure and Algorithms",
    room: "B305",
    type: "Lecture",
    instructor: "Angus, Cherry Ann A."
  },
  {
    id: "sched_2",
    day: "Monday",
    startTime: "10:00",
    endTime: "12:00",
    subjectCode: "INTE1051",
    subjectTitle: "IT Elective I",
    room: "B207",
    type: "Lecture",
    instructor: "Pasion, Charis B."
  },
  {
    id: "sched_3",
    day: "Monday",
    startTime: "13:00",
    endTime: "16:00",
    subjectCode: "COSC1007",
    subjectTitle: "Human-Computer Interaction",
    room: "MN307 (Comp. Lab4)",
    type: "Laboratory",
    instructor: "Pasion, Charis B."
  },
  {
    id: "sched_4",
    day: "Monday",
    startTime: "17:30",
    endTime: "20:30",
    subjectCode: "GEDC 1014",
    subjectTitle: "Rizal's Life and Works",
    room: "MN424",
    type: "Lecture",
    instructor: "Angeles, Jocen B."
  },
  {
    id: "sched_5",
    day: "Tuesday",
    startTime: "10:00",
    endTime: "12:00",
    subjectCode: "PHED 1007",
    subjectTitle: "P.E./PATHFIT 3: Individual-Dual Sports",
    room: "FIELD 4",
    type: "Activity",
    instructor: "Sagon, Benjamin Romel G."
  },
  {
    id: "sched_6",
    day: "Tuesday",
    startTime: "13:00",
    endTime: "15:00",
    subjectCode: "COSC1007",
    subjectTitle: "Human-Computer Interaction",
    room: "B207",
    type: "Lecture",
    instructor: "Pasion, Charis B."
  },
  {
    id: "sched_7",
    day: "Tuesday",
    startTime: "16:00",
    endTime: "19:00",
    subjectCode: "INTE1051",
    subjectTitle: "IT Elective I",
    room: "MN308 (Comp. Lab3)",
    type: "Laboratory",
    instructor: "Pasion, Charis B."
  },
  {
    id: "sched_8",
    day: "Wednesday",
    startTime: "17:30",
    endTime: "20:30",
    subjectCode: "COSC1001",
    subjectTitle: "Principles of Communication",
    room: "ONLINE",
    type: "Lecture",
    instructor: "Escauso, Irene May C."
  },
  {
    id: "sched_9",
    day: "Thursday",
    startTime: "10:00",
    endTime: "12:00",
    subjectCode: "COSC1008",
    subjectTitle: "Platform Technology 1 (Operating Systems)",
    room: "B304",
    type: "Lecture",
    instructor: "Gonzales, Danly S."
  },
  {
    id: "sched_10",
    day: "Thursday",
    startTime: "16:00",
    endTime: "19:00",
    subjectCode: "COSC1003",
    subjectTitle: "Data Structure and Algorithms",
    room: "B102 (Comp. Lab1)",
    type: "Laboratory",
    instructor: "Angus, Cherry Ann A."
  },
  {
    id: "sched_11",
    day: "Friday",
    startTime: "09:00",
    endTime: "12:00",
    subjectCode: "COSC1008",
    subjectTitle: "Platform Technology 1 (Operating Systems)",
    room: "MN306 (Comp. Lab5)",
    type: "Laboratory",
    instructor: "Gonzales, Danly S."
  },
  {
    id: "sched_12",
    day: "Friday",
    startTime: "13:00",
    endTime: "16:00",
    subjectCode: "GEDC 1006",
    subjectTitle: "Readings in Philippine History",
    room: "B305",
    type: "Lecture",
    instructor: "Pama, Delia P."
  }
];

const DEFAULT_QUIZZES = {
  "COSC1003": {
    subjectTitle: "Data Structures and Algorithms",
    flashcards: [
      {
        id: "fc_dsa_1",
        topic: "Stacks",
        front: "What principle governs a Stack data structure, and what are its primary operations?",
        back: "LIFO (Last-In, First-Out). Elements are added and removed from the same end called the 'top'. Core operations: push() to add, pop() to remove, and peek() to view the top element."
      },
      {
        id: "fc_dsa_2",
        topic: "Queues",
        front: "How does a Queue differ from a Stack in terms of access discipline?",
        back: "A Queue operates on FIFO (First-In, First-Out). Elements enter at the 'rear' (enqueue) and leave from the 'front' (dequeue)."
      },
      {
        id: "fc_dsa_3",
        topic: "Linked Lists",
        front: "What is the primary architectural difference between an Array and a Singly Linked List?",
        back: "An array stores elements in contiguous memory with fixed size and O(1) random index access. A linked list uses non-contiguous nodes linked by memory pointers, with dynamic sizing and O(n) sequential access."
      },
      {
        id: "fc_dsa_4",
        topic: "Binary Search Trees",
        front: "What is the BST (Binary Search Tree) ordering invariant property?",
        back: "For any node N: all keys in its left subtree are strictly less than N's key, and all keys in its right subtree are strictly greater than N's key."
      }
    ],
    questions: [
      {
        id: "q_dsa_1",
        topic: "Time Complexity",
        question: "What is the worst-case time complexity of searching for an element in an unsorted Singly Linked List of n nodes?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctIndex: 2,
        explanation: "Because nodes in a linked list are scattered in memory and must be traversed sequentially from the head pointer, finding an item requires visiting up to n elements, yielding O(n)."
      },
      {
        id: "q_dsa_2",
        topic: "Stack Applications",
        question: "Which of the following problems is best solved utilizing a Stack data structure?",
        options: [
          "Breadth-First Search (BFS) graph traversal",
          "Balanced parentheses matching & function call recursion",
          "CPU round-robin scheduling",
          "Print job queueing"
        ],
        correctIndex: 1,
        explanation: "Stacks operate on LIFO, making them the standard choice for parsing nested brackets, syntax validation, undo operations, and recursion call stacks."
      },
      {
        id: "q_dsa_3",
        topic: "Trees",
        question: "In an In-Order traversal (Left, Root, Right) of a Binary Search Tree (BST), the resulting output sequence will always be:",
        options: [
          "In reverse descending order",
          "Randomly shuffled",
          "Sorted in ascending order",
          "Grouped by node depth"
        ],
        correctIndex: 2,
        explanation: "Traversing Left Subtree -> Root -> Right Subtree on a valid BST guarantees visiting keys in strictly ascending numerical order."
      }
    ]
  },
  "COSC1007": {
    subjectTitle: "Human-Computer Interaction",
    flashcards: [
      {
        id: "fc_hci_1",
        topic: "Usability",
        front: "What are the 5 core usability quality attributes defined by Jakob Nielsen?",
        back: "1. Learnability (easy to accomplish tasks first time)\n2. Efficiency (speed after learning)\n3. Memorability (proficiency lasts)\n4. Errors (low rate, easy recovery)\n5. Satisfaction (pleasant design)."
      },
      {
        id: "fc_hci_2",
        topic: "Heuristics",
        front: "What does Nielsen's heuristic 'Visibility of System Status' dictate?",
        back: "The design should always keep users informed about what is going on, through appropriate, timely feedback within reasonable time (e.g., progress bars, loading spinners, active state rings)."
      },
      {
        id: "fc_hci_3",
        topic: "Task Analysis",
        front: "What is Hierarchical Task Analysis (HTA)?",
        back: "A structured UX method of decomposing high-level user goals into smaller sub-tasks, operations, and execution plans (e.g., Goal 0 -> Subtasks 1, 2, 3)."
      }
    ],
    questions: [
      {
        id: "q_hci_1",
        topic: "Usability Heuristics",
        question: "Showing a confirmation dialog before permanently deleting a file satisfies which UX design principle?",
        options: [
          "Flexibility and efficiency of use",
          "Error prevention & user control",
          "Aesthetic and minimalist design",
          "Consistency and standards"
        ],
        correctIndex: 1,
        explanation: "Confirmation modals eliminate accidental destruction by providing a checkpoint and an emergency exit (Error Prevention & User Control)."
      },
      {
        id: "q_hci_2",
        topic: "Fitts's Law",
        question: "According to Fitts's Law, what makes an interactive button fastest to acquire and click?",
        options: [
          "Making it smaller and closer to the center",
          "Making it larger and closer to the user's cursor/thumb reach",
          "Using bright colors regardless of distance",
          "Placing it deep inside nested dropdowns"
        ],
        correctIndex: 1,
        explanation: "Fitts's Law states MT = a + b * log2(2D/W): target acquisition time decreases when target distance (D) is short and target width (W) is large."
      }
    ]
  },
  "COSC1008": {
    subjectTitle: "Platform Technology 1 / Operating Systems",
    flashcards: [
      {
        id: "fc_os_1",
        topic: "Processes",
        front: "What is a Process Control Block (PCB)?",
        back: "A data structure maintained by the OS kernel containing all information about a process: Process ID (PID), Program Counter (PC), CPU registers, memory limits, and list of open I/O files."
      },
      {
        id: "fc_os_2",
        topic: "Scheduling",
        front: "What is the Convoy Effect in First-Come, First-Served (FCFS) CPU scheduling?",
        back: "A performance bottleneck where short processes get stuck waiting behind one massive, long CPU-burst process, dragging down average turnaround time."
      },
      {
        id: "fc_os_3",
        topic: "Deadlocks",
        front: "What are the Coffman 4 necessary conditions for a Deadlock?",
        back: "1. Mutual Exclusion\n2. Hold and Wait\n3. No Preemption\n4. Circular Wait."
      }
    ],
    questions: [
      {
        id: "q_os_1",
        topic: "CPU Scheduling",
        question: "Which CPU scheduling algorithm prevents indefinite starvation by dynamically assigning fixed time slices?",
        options: [
          "Shortest Job First (Non-preemptive SJF)",
          "Round Robin (RR) with Time Quantum",
          "First-Come First-Served (FCFS)",
          "Priority Scheduling without aging"
        ],
        correctIndex: 1,
        explanation: "Round Robin shares CPU time equally in small time quanta (slices), guaranteeing every ready process gets regular CPU access without starvation."
      },
      {
        id: "q_os_2",
        topic: "Virtual Memory",
        question: "What is 'Thrashing' in operating system memory management?",
        options: [
          "A CPU overclocking failure",
          "When the OS spends significantly more time swapping pages in and out than executing instructions",
          "When disk sectors get corrupted during writes",
          "An infinite loop in user space"
        ],
        correctIndex: 1,
        explanation: "Thrashing occurs when total memory demand exceeds physical RAM capacity, causing high page-fault frequencies and devastating CPU utilization."
      }
    ]
  },
  "GEDC1014": {
    subjectTitle: "Rizal's Life and Works",
    flashcards: [
      {
        id: "fc_rizal_1",
        topic: "RA 1425",
        front: "Who authored Republic Act No. 1425 (The Rizal Law) and what was its core purpose?",
        back: "Authored primarily by Senator Claro M. Recto (sponsored by Jose P. Laurel). It mandates all educational institutions in the Philippines to offer courses on Jose Rizal's life, works, and writings, especially Noli Me Tangere and El Filibusterismo."
      },
      {
        id: "fc_rizal_2",
        topic: "Literary Works",
        front: "Contrast the tone and dedication of Noli Me Tangere vs. El Filibusterismo.",
        back: "Noli Me Tangere (1887, Berlin) is a romantic social novel dedicated to the Motherland (Inang Bayan). El Filibusterismo (1891, Ghent) is a darker, political, revolutionary novel dedicated to the martyrdom of GOMBURZA."
      }
    ],
    questions: [
      {
        id: "q_rizal_1",
        topic: "Propaganda Movement",
        question: "What was the principal organ/newspaper of the Reform Movement founded in Barcelona in 1889?",
        options: [
          "Kalayaan",
          "La Solidaridad",
          "Diario de Manila",
          "El Renacimiento"
        ],
        correctIndex: 1,
        explanation: "La Solidaridad was founded by Graciano Lopez Jaena and later edited by Marcelo H. Del Pilar as the official voice of Filipino reformists in Spain."
      }
    ]
  }
};

const DEFAULT_HANDOUTS = [
  {
    id: "h_hci_guide",
    subjectCode: "COSC1007",
    title: "HCI Midterm Study Guide (Master Reviewer)",
    period: "MIDTERM",
    type: "Study Guide",
    format: "PDF / DOCX",
    summary: "Nielsen's 10 Usability Heuristics, Fitts's Law, HTA, and User-Centered Design principles.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/HCI_Study_Guide.pdf"
  },
  {
    id: "h_hci_m1",
    subjectCode: "COSC1007",
    title: "HCI Midterm Handout 1",
    period: "MIDTERM",
    type: "Official Handout",
    format: "PDF",
    summary: "Interaction models, input devices, and cognitive ergonomics.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/Handout_1.pdf"
  },
  {
    id: "h_hci_m2",
    subjectCode: "COSC1007",
    title: "HCI Midterm Handout 2",
    period: "MIDTERM",
    type: "Official Handout",
    format: "PDF",
    summary: "Prototyping fidelity, wireframes, and usability testing methodologies.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/Handout_2.pdf"
  },
  {
    id: "h_hci_defense",
    subjectCode: "COSC1007",
    title: "AuraPulse HCI Defense QA Master Guide",
    period: "MIDTERM",
    type: "Defense Prep",
    format: "DOCX",
    summary: "Panel Q&A defense answers, rationale behind design decisions, and system usability.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/AuraPulse_HCI_Defense_QA_Master_Guide_Aguillon_Haway.docx"
  },
  {
    id: "h_rizal_rev",
    subjectCode: "GEDC 1014",
    title: "JRizal Midterm Master Reviewer",
    period: "MIDTERM",
    type: "Reviewer",
    format: "DOCX",
    summary: "Exile in Dapitan, La Liga Filipina, trial, execution, and critical analysis of El Filibusterismo.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/JRizal-MIDTERMReviewer.docx"
  },
  {
    id: "h_rizal_m1",
    subjectCode: "GEDC 1014",
    title: "Rizal Life Midterm Topic 1 Handout",
    period: "MIDTERM",
    type: "Lecture Notes",
    format: "PDF",
    summary: "19th century sociopolitical landscape and early nationalist writings.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-1.pdf"
  },
  {
    id: "h_rizal_m2",
    subjectCode: "GEDC 1014",
    title: "Rizal Life Midterm Topic 2 Handout",
    period: "MIDTERM",
    type: "Lecture Notes",
    format: "PDF",
    summary: "European reform movement, Propagandists, and La Solidaridad.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-2.pdf"
  },
  {
    id: "h_rizal_m3",
    subjectCode: "GEDC 1014",
    title: "Rizal Life Midterm Topic 3 Handout",
    period: "MIDTERM",
    type: "Lecture Notes",
    format: "PDF",
    summary: "Founding of La Liga Filipina and events leading to Dapitan deportation.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-3.pdf"
  },
  {
    id: "h_rizal_m4",
    subjectCode: "GEDC 1014",
    title: "Rizal Life Midterm Topic 4 Handout",
    period: "MIDTERM",
    type: "Lecture Notes",
    format: "PDF",
    summary: "Literary analysis: Comparing Noli Me Tangere and El Filibusterismo.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-4.pdf"
  },
  {
    id: "h_comm_q1",
    subjectCode: "COSC1001",
    title: "Principles of Communication - Module 04 Quiz Answers",
    period: "MIDTERM",
    type: "Quiz Reviewer",
    format: "DOCX",
    summary: "Complete verified question solutions and explanations for signal transmission.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Quiz_1_Answer.docx"
  },
  {
    id: "h_comm_pt1",
    subjectCode: "COSC1001",
    title: "Principles of Communication - Module 04 Performance Task",
    period: "MIDTERM",
    type: "Performance Task",
    format: "DOCX",
    summary: "Practical lab task documentation, transmission models, and network topology analysis.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Performance_Task_1_Answer.docx"
  },
  {
    id: "h_comm_sw1",
    subjectCode: "COSC1001",
    title: "Principles of Communication - Module 04 Seatwork",
    period: "MIDTERM",
    type: "Seatwork",
    format: "DOCX",
    summary: "Seatwork exercises and solutions on modulation and frequency bands.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Seatwork_1_Answer.docx"
  },
  {
    id: "h_ite_act1",
    subjectCode: "INTE1051",
    title: "IT Elective I - Midterm Activity 1",
    period: "MIDTERM",
    type: "Activity Handout",
    format: "PDF",
    summary: "Midterm application activity guidelines and technical implementation steps.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/IT ELECTIVE/MIDTERM/Midterm-Activity-1.pdf"
  },
  {
    id: "h_ite_lab",
    subjectCode: "INTE1051",
    title: "IT Elective I - Lab Activity Society Form",
    period: "MIDTERM",
    type: "Lab Activity",
    format: "DOCX",
    summary: "Membership form UI and client-side form validation exercise.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/IT ELECTIVE/MIDTERM/Lab_Activity-society.docx"
  },
  {
    id: "h_dsa_guide",
    subjectCode: "COSC1003",
    title: "Data Structures - Combined Handouts Study Guide",
    period: "FOUNDATION",
    type: "Study Guide",
    format: "DOCX",
    summary: "Arrays, Linked Lists, Stacks, Queues, Big-O complexity comparison.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Combined_Study_Guide_Handouts_01_02.docx"
  },
  {
    id: "h_os_guide",
    subjectCode: "COSC1008",
    title: "Platform Technology / OS - Combined Study Guide",
    period: "FOUNDATION",
    type: "Study Guide",
    format: "DOCX",
    summary: "Process management, CPU scheduling, memory management, and paging.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Combined_Study_Guide_IT2601.docx"
  },
  {
    id: "h_hist_guide",
    subjectCode: "GEDC 1006",
    title: "Readings in Philippine History - Study Guide",
    period: "FOUNDATION",
    type: "Study Guide",
    format: "DOCX",
    summary: "Primary and secondary source analysis, customs of the Tagalogs, and Cavite mutiny.",
    localPath: "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Philippine_History_Study_Guide.docx"
  }
];
