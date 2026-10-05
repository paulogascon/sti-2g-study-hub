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
    "subjectTitle": "Data Structures and Algorithms",
    "flashcards": [
      {
        "id": "fc_dsa_1",
        "topic": "Stacks",
        "front": "What principle governs a Stack data structure, and what are its primary operations?",
        "back": "LIFO (Last-In, First-Out). Elements are added and removed from the same end called the 'top'. Core operations: push() to add, pop() to remove, and peek() to view the top element."
      },
      {
        "id": "fc_dsa_2",
        "topic": "Queues",
        "front": "How does a Queue differ from a Stack in terms of access discipline?",
        "back": "A Queue operates on FIFO (First-In, First-Out). Elements enter at the 'rear' (enqueue) and leave from the 'front' (dequeue)."
      },
      {
        "id": "fc_dsa_3",
        "topic": "Linked Lists",
        "front": "What is the primary architectural difference between an Array and a Singly Linked List?",
        "back": "An array stores elements in contiguous memory with fixed size and O(1) random index access. A linked list uses non-contiguous nodes linked by memory pointers, with dynamic sizing and O(n) sequential access."
      },
      {
        "id": "fc_dsa_4",
        "topic": "Binary Search Trees",
        "front": "What is the BST (Binary Search Tree) ordering invariant property?",
        "back": "For any node N: all keys in its left subtree are strictly less than N's key, and all keys in its right subtree are strictly greater than N's key."
      }
    ],
    "questions": [
      {
        "id": "q_dsa_1",
        "topic": "Time Complexity",
        "question": "What is the worst-case time complexity of searching for an element in an unsorted Singly Linked List of n nodes?",
        "options": [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n^2)"
        ],
        "correctIndex": 2,
        "explanation": "Because nodes in a linked list are scattered in memory and must be traversed sequentially from the head pointer, finding an item requires visiting up to n elements, yielding O(n)."
      },
      {
        "id": "q_dsa_2",
        "topic": "Stack Applications",
        "question": "Which of the following problems is best solved utilizing a Stack data structure?",
        "options": [
          "Breadth-First Search (BFS) graph traversal",
          "Balanced parentheses matching & function call recursion",
          "CPU round-robin scheduling",
          "Print job queueing"
        ],
        "correctIndex": 1,
        "explanation": "Stacks operate on LIFO, making them the standard choice for parsing nested brackets, syntax validation, undo operations, and recursion call stacks."
      },
      {
        "id": "q_dsa_3",
        "topic": "Trees",
        "question": "In an In-Order traversal (Left, Root, Right) of a Binary Search Tree (BST), the resulting output sequence will always be:",
        "options": [
          "In reverse descending order",
          "Randomly shuffled",
          "Sorted in ascending order",
          "Grouped by node depth"
        ],
        "correctIndex": 2,
        "explanation": "Traversing Left Subtree -> Root -> Right Subtree on a valid BST guarantees visiting keys in strictly ascending numerical order."
      }
    ]
  },
  "COSC1007": {
    "subjectTitle": "Human-Computer Interaction",
    "flashcards": [
      {
        "id": "fc_hci_1",
        "topic": "HCI Design Process",
        "front": "What are the 5 sequential phases of the overall HCI Design Process?",
        "back": "1. Requirement Analysis
2. User Analysis
3. Scenario and Task Modeling
4. Interface Selection and Consolidation
5. Wire-framing"
      },
      {
        "id": "fc_hci_2",
        "topic": "Earcon",
        "front": "What is an 'earcon' in Human-Computer Interaction?",
        "back": "A brief, distinctive audio cue or sound scheme used in computer interfaces to represent a system event, notification, or error condition (the auditory counterpart of a visual icon)."
      },
      {
        "id": "fc_hci_3",
        "topic": "Event-Driven Programming",
        "front": "What are the three core parts of Event-Driven programming in Java?",
        "back": "1. Event: Object created when a state change occurs in the GUI.
2. Event Source: The UI object that generates/fires the event.
3. Event Listener: Registered code that detects the event and executes response code."
      }
    ],
    "questions": [
      {
        "id": "q_hci_1",
        "topic": "Interaction Modeling",
        "question": "Which phase of the HCI design process is considered the most critical part of interaction modeling and utilizes storyboarding?",
        "options": [
          "Requirement Analysis",
          "User Analysis",
          "Scenario and Task Modeling",
          "Wire-framing"
        ],
        "correctIndex": 2,
        "explanation": "Scenario and Task Modeling is the most important part of interaction modeling. It identifies task structure and sequential relationships using storyboards."
      },
      {
        "id": "q_hci_2",
        "topic": "Java Event Classes",
        "question": "In Java Swing GUI development, which event class is triggered when a user clicks a button or selects an item from a list?",
        "options": [
          "ComponentEvent",
          "ActionEvent",
          "AdjustmentEvent",
          "TextEvent"
        ],
        "correctIndex": 1,
        "explanation": "ActionEvent is triggered when an action is performed on an interactive GUI component, such as clicking a JButton or choosing a JMenuItem."
      },
      {
        "id": "q_hci_3",
        "topic": "UI Layer Architecture",
        "question": "Which software utility operates within the User Interface Layer to govern the layout, alignment, positioning, and rendering of graphical windows?",
        "options": [
          "Window Manager",
          "Interrupt Service Routine (ISR)",
          "Kernel Scheduler",
          "Compiler"
        ],
        "correctIndex": 0,
        "explanation": "A Window Manager manages the overall alignment, layout, minimize, maximize, and rendering of graphical windows."
      },
      {
        "id": "q_hci_4",
        "topic": "Menu Types",
        "question": "According to HCI interface guidelines, which menu presentation style is best suited for object-specific, context-sensitive actions?",
        "options": [
          "Pull-down menu",
          "Pop-up menu",
          "Tabs",
          "Scroll menu"
        ],
        "correctIndex": 1,
        "explanation": "Pop-up menus (such as right-click context menus) are specifically designed for object-specific and context-sensitive commands."
      }
    ]
  },
  "COSC1008": {
    "subjectTitle": "Platform Technology 1 / Operating Systems",
    "flashcards": [
      {
        "id": "fc_os_1",
        "topic": "Processes",
        "front": "What is a Process Control Block (PCB)?",
        "back": "A data structure maintained by the OS kernel containing all information about a process: Process ID (PID), Program Counter (PC), CPU registers, memory limits, and list of open I/O files."
      },
      {
        "id": "fc_os_2",
        "topic": "Scheduling",
        "front": "What is the Convoy Effect in First-Come, First-Served (FCFS) CPU scheduling?",
        "back": "A performance bottleneck where short processes get stuck waiting behind one massive, long CPU-burst process, dragging down average turnaround time."
      },
      {
        "id": "fc_os_3",
        "topic": "Deadlocks",
        "front": "What are the Coffman 4 necessary conditions for a Deadlock?",
        "back": "1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait."
      }
    ],
    "questions": [
      {
        "id": "q_os_1",
        "topic": "CPU Scheduling",
        "question": "Which CPU scheduling algorithm prevents indefinite starvation by dynamically assigning fixed time slices?",
        "options": [
          "Shortest Job First (Non-preemptive SJF)",
          "Round Robin (RR) with Time Quantum",
          "First-Come First-Served (FCFS)",
          "Priority Scheduling without aging"
        ],
        "correctIndex": 1,
        "explanation": "Round Robin shares CPU time equally in small time quanta (slices), guaranteeing every ready process gets regular CPU access without starvation."
      },
      {
        "id": "q_os_2",
        "topic": "Virtual Memory",
        "question": "What is 'Thrashing' in operating system memory management?",
        "options": [
          "A CPU overclocking failure",
          "When the OS spends significantly more time swapping pages in and out than executing instructions",
          "When disk sectors get corrupted during writes",
          "An infinite loop in user space"
        ],
        "correctIndex": 1,
        "explanation": "Thrashing occurs when total memory demand exceeds physical RAM capacity, causing high page-fault frequencies and devastating CPU utilization."
      }
    ]
  },
  "GEDC1014": {
    "subjectTitle": "Rizal's Life and Works",
    "flashcards": [
      {
        "id": "fc_rizal_1",
        "topic": "La Solidaridad",
        "front": "When was La Solidaridad established and who was its first editor in Barcelona?",
        "back": "Established on December 13, 1888 (first publication on February 15, 1889). Graciano Lopez Jaena served as its first editor before Marcelo H. del Pilar took over."
      },
      {
        "id": "fc_rizal_2",
        "topic": "La Liga Filipina",
        "front": "Where and when was La Liga Filipina officially founded?",
        "back": "Founded on July 3, 1892 at the house of Doroteo Ongjungco on Ilaya Street, Tondo, Manila."
      },
      {
        "id": "fc_rizal_3",
        "topic": "Mi Ultimo Adios",
        "front": "Where did Rizal hide his final farewell poem on the eve of his execution?",
        "back": "Inside an ordinary alcohol cooking lamp (cocinilla), which he handed to his sister Trinidad whispering 'there is something inside'."
      },
      {
        "id": "fc_rizal_4",
        "topic": "Dapitan Exile",
        "front": "What were the three new animal species discovered by Rizal in Dapitan and named after him?",
        "back": "Draco rizali (flying lizard), Apogonia rizali (beetle), and Rhacophorus rizali (tree frog)."
      }
    ],
    "questions": [
      {
        "id": "q_rizal_1",
        "topic": "La Solidaridad Pen Names",
        "question": "What pen names were used by Jose Rizal in his contributions to La Solidaridad?",
        "options": [
          "Plaridel & Dolores Manapat",
          "Dimasalang & Laong Laan",
          "Diego Laura & Taga-Ilog",
          "Naning & Tikbalang"
        ],
        "correctIndex": 1,
        "explanation": "Jose Rizal wrote under the pen names 'Dimasalang' and 'Laong Laan'. Marcelo H. del Pilar used 'Plaridel', and Antonio Luna used 'Taga-Ilog'."
      },
      {
        "id": "q_rizal_2",
        "topic": "Katipunan Emissary",
        "question": "Who was the Katipunan emissary sent by Andres Bonifacio to Dapitan to consult Rizal about the revolution?",
        "options": [
          "Dr. Pio Valenzuela",
          "Emilio Jacinto",
          "Deodato Arellano",
          "Ambrosio Salvador"
        ],
        "correctIndex": 0,
        "explanation": "Dr. Pio Valenzuela visited Dapitan in June 1896 posing as a companion to a blind patient to consult Rizal and offer a rescue plan, which Rizal rejected."
      },
      {
        "id": "q_rizal_3",
        "topic": "Governor-General Blanco Offer",
        "question": "During his exile in Dapitan, Governor-General Ramon Blanco offered Rizal clemency on the condition that he serve as:",
        "options": [
          "A civil engineer in Zamboanga",
          "A military surgeon/doctor in Cuba",
          "A professor in Spain",
          "A consul in Hong Kong"
        ],
        "correctIndex": 1,
        "explanation": "Rizal volunteered to serve as a military surgeon in Cuba during the yellow fever epidemic. Governor-General Ramon Blanco granted him permission on July 1896."
      },
      {
        "id": "q_rizal_4",
        "topic": "Execution & Martyrdom",
        "question": "Who was the Spanish Governor-General that signed the death sentence order for Jose Rizal's execution?",
        "options": [
          "Eulogio Despujol",
          "Ramon Blanco",
          "Camilo de Polavieja",
          "Valeriano Weyler"
        ],
        "correctIndex": 2,
        "explanation": "Governor-General Camilo de Polavieja approved and signed the military court-martial's death sentence on December 28, 1896."
      }
    ]
  }
};

const DEFAULT_HANDOUTS = [
  {
    "id": "h_rizal_study_guide_doc",
    "subjectCode": "GEDC 1014",
    "title": "Rizal Midterm Comprehensive Study Guide",
    "period": "MIDTERM",
    "type": "Official Study Guide",
    "format": "DOCX",
    "summary": "Full midterm reviewer covering La Solidaridad, La Liga Filipina, Dapitan exile achievements, court-martial trial, and martyrdom.",
    "localPath": "docs/Rizal_Midterm_Study_Guide.docx",
    "downloadUrl": "docs/Rizal_Midterm_Study_Guide.docx"
  },
  {
    "id": "h_hci_combined_guide_doc",
    "subjectCode": "COSC1007",
    "title": "HCI Midterm Combined Study Guide (Handout 1 & 2)",
    "period": "MIDTERM",
    "type": "Official Study Guide",
    "format": "DOCX",
    "summary": "Master combined reviewer covering HCI Design Process, Hardware Platforms, WIMP components, UI Layer Architecture, and Java Event-Driven programming.",
    "localPath": "docs/HCI_Midterm_Combined_Study_Guide.docx",
    "downloadUrl": "docs/HCI_Midterm_Combined_Study_Guide.docx"
  },
  {
    "id": "h_hci_guide",
    "subjectCode": "COSC1007",
    "title": "HCI Midterm Study Guide (Master Reviewer)",
    "period": "MIDTERM",
    "type": "Study Guide",
    "format": "PDF / DOCX",
    "summary": "Nielsen's 10 Usability Heuristics, Fitts's Law, HTA, and User-Centered Design principles.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/HCI_Study_Guide.pdf"
  },
  {
    "id": "h_hci_m1",
    "subjectCode": "COSC1007",
    "title": "HCI Midterm Handout 1",
    "period": "MIDTERM",
    "type": "Official Handout",
    "format": "PDF",
    "summary": "Interaction models, input devices, and cognitive ergonomics.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/Handout_1.pdf"
  },
  {
    "id": "h_hci_m2",
    "subjectCode": "COSC1007",
    "title": "HCI Midterm Handout 2",
    "period": "MIDTERM",
    "type": "Official Handout",
    "format": "PDF",
    "summary": "Prototyping fidelity, wireframes, and usability testing methodologies.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/Handout_2.pdf"
  },
  {
    "id": "h_hci_defense",
    "subjectCode": "COSC1007",
    "title": "AuraPulse HCI Defense QA Master Guide",
    "period": "MIDTERM",
    "type": "Defense Prep",
    "format": "DOCX",
    "summary": "Panel Q&A defense answers, rationale behind design decisions, and system usability.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/AuraPulse_HCI_Defense_QA_Master_Guide_Aguillon_Haway.docx"
  },
  {
    "id": "h_rizal_rev",
    "subjectCode": "GEDC 1014",
    "title": "JRizal Midterm Master Reviewer",
    "period": "MIDTERM",
    "type": "Reviewer",
    "format": "DOCX",
    "summary": "Exile in Dapitan, La Liga Filipina, trial, execution, and critical analysis of El Filibusterismo.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/JRizal-MIDTERMReviewer.docx"
  },
  {
    "id": "h_rizal_m1",
    "subjectCode": "GEDC 1014",
    "title": "Rizal Life Midterm Topic 1 Handout",
    "period": "MIDTERM",
    "type": "Lecture Notes",
    "format": "PDF",
    "summary": "19th century sociopolitical landscape and early nationalist writings.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-1.pdf"
  },
  {
    "id": "h_rizal_m2",
    "subjectCode": "GEDC 1014",
    "title": "Rizal Life Midterm Topic 2 Handout",
    "period": "MIDTERM",
    "type": "Lecture Notes",
    "format": "PDF",
    "summary": "European reform movement, Propagandists, and La Solidaridad.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-2.pdf"
  },
  {
    "id": "h_rizal_m3",
    "subjectCode": "GEDC 1014",
    "title": "Rizal Life Midterm Topic 3 Handout",
    "period": "MIDTERM",
    "type": "Lecture Notes",
    "format": "PDF",
    "summary": "Founding of La Liga Filipina and events leading to Dapitan deportation.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-3.pdf"
  },
  {
    "id": "h_rizal_m4",
    "subjectCode": "GEDC 1014",
    "title": "Rizal Life Midterm Topic 4 Handout",
    "period": "MIDTERM",
    "type": "Lecture Notes",
    "format": "PDF",
    "summary": "Literary analysis: Comparing Noli Me Tangere and El Filibusterismo.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/RIZAL LIFE/MIDTERM/MIDTERM-TOPIC-4.pdf"
  },
  {
    "id": "h_comm_q1",
    "subjectCode": "COSC1001",
    "title": "Principles of Communication - Module 04 Quiz Answers",
    "period": "MIDTERM",
    "type": "Quiz Reviewer",
    "format": "DOCX",
    "summary": "Complete verified question solutions and explanations for signal transmission.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Quiz_1_Answer.docx"
  },
  {
    "id": "h_comm_pt1",
    "subjectCode": "COSC1001",
    "title": "Principles of Communication - Module 04 Performance Task",
    "period": "MIDTERM",
    "type": "Performance Task",
    "format": "DOCX",
    "summary": "Practical lab task documentation, transmission models, and network topology analysis.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Performance_Task_1_Answer.docx"
  },
  {
    "id": "h_comm_sw1",
    "subjectCode": "COSC1001",
    "title": "Principles of Communication - Module 04 Seatwork",
    "period": "MIDTERM",
    "type": "Seatwork",
    "format": "DOCX",
    "summary": "Seatwork exercises and solutions on modulation and frequency bands.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/MIDTERM HAND OUTS/04_Seatwork_1_Answer.docx"
  },
  {
    "id": "h_ite_act1",
    "subjectCode": "INTE1051",
    "title": "IT Elective I - Midterm Activity 1",
    "period": "MIDTERM",
    "type": "Activity Handout",
    "format": "PDF",
    "summary": "Midterm application activity guidelines and technical implementation steps.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/IT ELECTIVE/MIDTERM/Midterm-Activity-1.pdf"
  },
  {
    "id": "h_ite_lab",
    "subjectCode": "INTE1051",
    "title": "IT Elective I - Lab Activity Society Form",
    "period": "MIDTERM",
    "type": "Lab Activity",
    "format": "DOCX",
    "summary": "Membership form UI and client-side form validation exercise.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/IT ELECTIVE/MIDTERM/Lab_Activity-society.docx"
  },
  {
    "id": "h_dsa_guide",
    "subjectCode": "COSC1003",
    "title": "Data Structures - Combined Handouts Study Guide",
    "period": "FOUNDATION",
    "type": "Study Guide",
    "format": "DOCX",
    "summary": "Arrays, Linked Lists, Stacks, Queues, Big-O complexity comparison.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Combined_Study_Guide_Handouts_01_02.docx"
  },
  {
    "id": "h_os_guide",
    "subjectCode": "COSC1008",
    "title": "Platform Technology / OS - Combined Study Guide",
    "period": "FOUNDATION",
    "type": "Study Guide",
    "format": "DOCX",
    "summary": "Process management, CPU scheduling, memory management, and paging.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Combined_Study_Guide_IT2601.docx"
  },
  {
    "id": "h_hist_guide",
    "subjectCode": "GEDC 1006",
    "title": "Readings in Philippine History - Study Guide",
    "period": "FOUNDATION",
    "type": "Study Guide",
    "format": "DOCX",
    "summary": "Primary and secondary source analysis, customs of the Tagalogs, and Cavite mutiny.",
    "localPath": "C:/Paulo files/STI FOLDER/FIRST SEMESTER 2G/PRELIM HAND OUTS/Philippine_History_Study_Guide.docx"
  }
];
