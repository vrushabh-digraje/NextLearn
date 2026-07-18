import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';
import ChatSession from './models/ChatSession.js';

dotenv.config();

// Helper to generate high-fidelity 4-lesson syllabus containing actual YouTube embeds and GeeksforGeeks reference notes
const generateGfgLessons = (cat, topic) => {
  const getEmbedLink = (category, lessonIndex) => {
    const embeds = {
      'Web Development': [
        'https://www.youtube.com/embed/61y8B763uSg', // HTML (CodeWithHarry)
        'https://www.youtube.com/embed/hKB-YGF14SY', // CSS (CodeWithHarry)
        'https://www.youtube.com/embed/hGBW_1m0kQ0', // JS (CodeWithHarry)
        'https://www.youtube.com/embed/l1EssrLca7g'  // Web Dev (CodeWithHarry)
      ],
      'Data Science': [
        'https://www.youtube.com/embed/gfDE2a7MKjA', // Python (CodeWithHarry)
        'https://www.youtube.com/embed/5PbzH0Q1bSM', // Data Science (CodeWithHarry)
        'https://www.youtube.com/embed/uNirBf3O8P8', // Machine Learning (CodeWithHarry)
        'https://www.youtube.com/embed/7wnove7KRh0'  // Data Analysis (CodeWithHarry)
      ],
      'Artificial Intelligence': [
        'https://www.youtube.com/embed/yGB9jAtiUMo', // C++ (CodeWithHarry)
        'https://www.youtube.com/embed/z9b5aRfrz7M', // DSA (CodeWithHarry)
        'https://www.youtube.com/embed/5_5oS5lji_E', // Java (CodeWithHarry)
        'https://www.youtube.com/embed/ER9SspLe4Hg'  // SQL (CodeWithHarry)
      ],
      'Cybersecurity': [
        'https://www.youtube.com/embed/3Kq1MIfT0Lo', // Ethical Hacking (CodeWithHarry)
        'https://www.youtube.com/embed/6Wv1hRsnqgU', // Cybersecurity Essentials (CodeWithHarry)
        'https://www.youtube.com/embed/zOjov-2OZ0E', // How Hacking Works (CodeWithHarry)
        'https://www.youtube.com/embed/y3kZE7A2F_s'  // Linux (CodeWithHarry)
      ]
    };
    const list = embeds[category] || embeds['Web Development'];
    return list[lessonIndex % list.length];
  };

  const getGfgLink = (category, lessonIndex) => {
    const urls = {
      'Web Development': [
        'https://www.geeksforgeeks.org/html-tutorials/',
        'https://www.geeksforgeeks.org/javascript-tutorials/',
        'https://www.geeksforgeeks.org/node-js-tutorials/',
        'https://www.geeksforgeeks.org/reactjs-tutorials/'
      ],
      'Data Science': [
        'https://www.geeksforgeeks.org/data-science-tutorial/',
        'https://www.geeksforgeeks.org/numpy-in-python-set-1-introduction/',
        'https://www.geeksforgeeks.org/exploratory-data-analysis-in-python/',
        'https://www.geeksforgeeks.org/confusion-matrix-machine-learning/'
      ],
      'Artificial Intelligence': [
        'https://www.geeksforgeeks.org/artificial-intelligence-an-introduction/',
        'https://www.geeksforgeeks.org/neural-networks-and-its-types/',
        'https://www.geeksforgeeks.org/pytorch-tutorial/',
        'https://www.geeksforgeeks.org/generative-adversarial-network-gan/'
      ],
      'Cybersecurity': [
        'https://www.geeksforgeeks.org/what-is-cyber-security/',
        'https://www.geeksforgeeks.org/what-is-ethical-hacking/',
        'https://www.geeksforgeeks.org/sql-injection-sqli/',
        'https://www.geeksforgeeks.org/what-is-firewall-types-and-working/'
      ]
    };
    const list = urls[category] || urls['Web Development'];
    return list[lessonIndex % list.length];
  };

  const getCodeSnippet = (category, lessonIndex) => {
    if (category === 'Web Development') {
      if (lessonIndex === 0) return '<!-- HTML Boilerplate -->\\n<!DOCTYPE html>\\n<html>\\n<head>\\n  <title>Basic Structure</title>\\n</head>\\n<body>\\n  <h1>Hello World</h1>\\n</body>\\n</html>';
      if (lessonIndex === 1) return '// JavaScript Closures Example\\nfunction outer() {\\n  const message = "Hello Closures";\\n  return function inner() {\\n    console.log(message);\\n  };\\n}\\nconst greet = outer();\\ngreet();';
      return '// Express Server Setup\\nconst express = require("express");\\nconst app = express();\\n\\napp.get("/", (req, res) => {\\n  res.send("API Active");\\n});\\napp.listen(5000);';
    }
    if (category === 'Data Science' || category === 'Artificial Intelligence') {
      if (lessonIndex === 0) return '# NumPy Array Manipulation\\nimport numpy as np\\narr = np.array([1, 2, 3, 4, 5])\\nprint("Mean:", np.mean(arr))';
      if (lessonIndex === 1) return '# Pandas Dataframe Operations\\nimport pandas as pd\\ndf = pd.DataFrame({"Name": ["Alice", "Bob"], "Score": [85, 92]})\\nprint(df.describe())';
      return '# PyTorch Simple Tensors\\nimport torch\\nx = torch.randn(3, 3)\\nprint(x)';
    }
    if (lessonIndex === 0) return '# Bash Packet Capture Sniffer\\nsudo tcpdump -i eth0 -n -c 10';
    if (lessonIndex === 1) return '# SQL Injection Protection (Prepared Statements)\\nquery = "SELECT * FROM users WHERE email = ? "\\ncursor.execute(query, (user_email,))';
    return '# Simple Nmap Port Scan\\nnmap -sS -O 192.168.1.1';
  };

  const lessonTitles = [
    `Lesson 1: Foundations of ${topic}`,
    `Lesson 2: Practical Architecture & Core Structure`,
    `Lesson 3: Advanced Optimization, Workflows & Implementations`,
    `Lesson 4: Building Real-World Deployment Projects`
  ];

  return lessonTitles.map((title, idx) => {
    const code = getCodeSnippet(cat, idx);
    const gfgLink = getGfgLink(cat, idx);
    const video = getEmbedLink(cat, idx);

    const textContent = `# ${title}

## GeeksforGeeks Reference Notes

### 1. Prerequisites
* Standard understanding of programming paradigms.
* Local development environment setup configured.
* Active database instances active.

### 2. Core Explanation
This lesson explores advanced structural logic for **${topic}**. We trace memory bounds, review call stack traces, and analyze edge-case parameters to guarantee maximum throughput.

### 3. Code Implementation
\`\`\`javascript
${code}
\`\`\`

### 4. Complexity Analysis Table
| Metric | Worst Case | Average Case | Best Case |
| :--- | :--- | :--- | :--- |
| **Time Complexity** | O(N) | O(N) | O(1) |
| **Space Complexity** | O(N) | O(N) | O(1) |

---

> [!NOTE]
> ### 💡 GeeksforGeeks Resource Guide
> To deepen your knowledge, read the full tutorial notes on [GeeksforGeeks](${gfgLink}). This covers additional dry runs, alternative coding algorithms, and test-case structures.
`;

    return {
      title,
      videoUrl: video,
      duration: 12 + idx * 4,
      textContent
    };
  });
};

const getCategoryThumbnail = (category, index) => {
  const images = {
    'Web Development': [
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop'
    ],
    'Data Science': [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop'
    ],
    'Artificial Intelligence': [
      'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525338078858-8ae62a830922?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop'
    ],
    'Cybersecurity': [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop'
    ]
  };
  const list = images[category] || images['Web Development'];
  return list[index % list.length];
};

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-ai';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected! Cleaning collections...');

    // Wipe existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    await ChatSession.deleteMany({});

    console.log('Creating Admin account...');
    await User.create({
      name: 'NextLearn Admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    console.log('Creating Student account...');
    await User.create({
      name: 'Alex Student',
      email: 'student@example.com',
      password: 'password123',
      role: 'student',
    });

    console.log('Creating 10 Instructor accounts...');
    const instructorsData = [
      { name: 'Dr. Jane Dev', email: 'jane.dev@example.com', password: 'password123', role: 'instructor' },
      { name: 'Sarah Design', email: 'sarah.design@example.com', password: 'password123', role: 'instructor' },
      { name: 'David Data', email: 'david.data@example.com', password: 'password123', role: 'instructor' },
      { name: 'John Business', email: 'john.biz@example.com', password: 'password123', role: 'instructor' },
      { name: 'Liam Code', email: 'liam.code@example.com', password: 'password123', role: 'instructor' },
      { name: 'Elena Lang', email: 'elena.lang@example.com', password: 'password123', role: 'instructor' },
      { name: 'Mark Cloud', email: 'mark.cloud@example.com', password: 'password123', role: 'instructor' },
      { name: 'Alex Cyber', email: 'alex.cyber@example.com', password: 'password123', role: 'instructor' },
      { name: 'Lisa Finance', email: 'lisa.finance@example.com', password: 'password123', role: 'instructor' },
      { name: 'Marcus Art', email: 'marcus.art@example.com', password: 'password123', role: 'instructor' }
    ];

    const instructors = await User.insertMany(instructorsData);
    
    // Quick lookup maps for instructors
    const getInst = (name) => instructors.find(i => i.name === name)._id;

    console.log('Seeding 30 diverse courses...');
    const courses = [
      {
        title: 'Full Stack MERN Web Development',
        description: 'Learn how to build scalable full-stack applications from scratch using MongoDB, Express, React, and Node.js.',
        category: 'Web Development',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Dr. Jane Dev'),
        lessons: [
          {
            title: '1. Introduction to MERN Stack',
            videoUrl: 'https://www.youtube.com/embed/SccSCuHh5Hc',
            duration: 12,
            textContent: `# Welcome to MERN\nLearn to build modern SPAs using MongoDB, Express, React, and Node.js. JavaScript powers the entire flow.`
          }
        ]
      },
      {
        title: 'Introduction to Python Programming',
        description: 'Master the basics of Python programming, from syntax and loops to file handling and object-oriented programming.',
        category: 'Programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Liam Code'),
        lessons: [
          {
            title: '1. Python Syntax & Variables',
            videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
            duration: 8,
            textContent: `# Python Basics\nPython is a high-level, interpreted programming language known for readability. Code block syntax is structured with indentations.`
          }
        ]
      },
      {
        title: 'UI/UX Design Fundamentals',
        description: 'Explore the principles of user interface and user experience design, wireframing, and interactive prototyping.',
        category: 'UI/UX Design',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Sarah Design'),
        lessons: [
          {
            title: '1. Designing for Users',
            videoUrl: 'https://www.youtube.com/embed/c9Wg6Ry_YQ0',
            duration: 15,
            textContent: `# UI/UX Foundations\nGood design is invisible. Focus on user personas, alignment grids, color harmonies, and responsive wireframes.`
          }
        ]
      },
      {
        title: 'Introduction to Data Science',
        description: 'Understand data collection, cleaning, descriptive statistics, and data visualization using Python and Pandas.',
        category: 'Data Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Introduction to Data & Analytics',
            videoUrl: 'https://www.youtube.com/embed/X3paOmcrTjQ',
            duration: 14,
            textContent: `# Data Analytics\nExplore structural data analysis, clean missing parameters, and generate data histograms using pandas DataFrame libraries.`
          }
        ]
      },
      {
        title: 'AWS Cloud Practitioner Guide',
        description: 'Get certified as an AWS Cloud Practitioner. Learn core cloud services, pricing, and infrastructure security.',
        category: 'DevOps',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Mark Cloud'),
        lessons: [
          {
            title: '1. What is Cloud Computing?',
            videoUrl: 'https://www.youtube.com/embed/3hLmDS179YE',
            duration: 10,
            textContent: `# AWS Foundations\nDiscover AWS regions, availability zones, EC2 compute engine configurations, and VPC networking infrastructure.`
          }
        ]
      },
      {
        title: 'Introduction to Cybersecurity',
        description: 'Learn the fundamentals of cybersecurity, network defense protocols, and cryptography basics.',
        category: 'Cybersecurity',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Alex Cyber'),
        lessons: [
          {
            title: '1. Cyber Threat Landscape',
            videoUrl: 'https://www.youtube.com/embed/nz89H1lS6K0',
            duration: 15,
            textContent: `# Secure Systems\nUnderstand CIA triad (Confidentiality, Integrity, Availability), phishing triggers, malware payloads, and network firewalls.`
          }
        ]
      },
      {
        title: 'Agile Product Management',
        description: 'Learn how to manage product development lifecycles, user stories, backlogs, and agile sprint planning.',
        category: 'Business',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('John Business'),
        lessons: [
          {
            title: '1. Agile vs Waterfall',
            videoUrl: 'https://www.youtube.com/embed/502ILHjX9EE',
            duration: 12,
            textContent: `# Agile Methodologies\nDeliver values in increments, manage backlog priorities, and run retrospective sprints to iteratively improve products.`
          }
        ]
      },
      {
        title: 'Financial Markets and Investing',
        description: 'Demystify financial markets. Understand stocks, mutual funds, portfolio diversity, and passive compound investing.',
        category: 'Finance',
        thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Lisa Finance'),
        lessons: [
          {
            title: '1. Introduction to Securities',
            videoUrl: 'https://www.youtube.com/embed/WediN7hRI1s',
            duration: 10,
            textContent: `# Asset Allocation\nLearn simple vs compounding interest rates, stock market shares, inflation indexes, and exchange-traded index funds.`
          }
        ]
      },
      {
        title: 'Conversational Spanish for Beginners',
        description: 'Learn simple vocabulary, everyday phrases, sentence conjugation, and direct pronunciation rules.',
        category: 'Languages',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Elena Lang'),
        lessons: [
          {
            title: '1. Greetings & Conjugation',
            videoUrl: 'https://www.youtube.com/embed/1vRzTz2WpY8',
            duration: 9,
            textContent: `# Spanish Basics\nMaster greetings (Hola, ¿cómo estás?) and key verbs like "ser", "estar", and "tener" to start direct communications.`
          }
        ]
      },
      {
        title: '3D Modeling with Blender',
        description: 'Learn 3D rendering, mesh manipulation, lighting maps, materials shading, and textures painting in Blender.',
        category: 'Creative Arts',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Marcus Art'),
        lessons: [
          {
            title: '1. Blender Interface Navigation',
            videoUrl: 'https://www.youtube.com/embed/TPrnSACiTJ4',
            duration: 16,
            textContent: `# 3D Stage Space\nNavigate the 3D viewport, add primitive shapes, and utilize extrusion modifiers in modeling mode.`
          }
        ]
      },
      {
        title: 'Deep Learning with PyTorch',
        description: 'Build neural network architectures, train classifiers, and optimize backpropagation loops.',
        category: 'Data Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Tensors & Gradients',
            videoUrl: 'https://www.youtube.com/embed/c36lUUrxsDW',
            duration: 18,
            textContent: `# Neural Architectures\nLearn mathematical matrix operations on tensors and track gradient metrics in optimization scripts.`
          }
        ]
      },
      {
        title: 'Docker & Kubernetes Bootcamp',
        description: 'Containerize node microservices. Orchestrate clusters, ingress rules, and scale deployments.',
        category: 'DevOps',
        thumbnailUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Mark Cloud'),
        lessons: [
          {
            title: '1. What is a Container?',
            videoUrl: 'https://www.youtube.com/embed/gAkwW2tuIqE',
            duration: 14,
            textContent: `# Container Isolation\nCreate Dockerfile specifications, isolate configuration ports, and bundle execution runtimes.`
          }
        ]
      },
      {
        title: 'Modern JavaScript (ES6+)',
        description: 'Master async/await, closures, modules, arrow functions, and array manipulation helpers.',
        category: 'Web Development',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Dr. Jane Dev'),
        lessons: [
          {
            title: '1. Array Callbacks & Destructuring',
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            duration: 11,
            textContent: `# JS Modern Features\nMaster mapping array maps, filter configurations, object destructuring parameters, and module exports.`
          }
        ]
      },
      {
        title: 'Ethical Hacking & Pentesting',
        description: 'Explore vulnerability audits, Wi-Fi security, SQL injection exploits, and metadata extractions.',
        category: 'Cybersecurity',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Alex Cyber'),
        lessons: [
          {
            title: '1. Reconnaissance Basics',
            videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
            duration: 20,
            textContent: `# Vulnerability Auditing\nUnderstand ports scanner flags (Nmap), passive subdomains mapping, and footprinting techniques.`
          }
        ]
      },
      {
        title: 'Digital Marketing Strategy',
        description: 'Build organic funnels, configure keyword filters, and launch Facebook/Google advertisement networks.',
        category: 'Marketing',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('John Business'),
        lessons: [
          {
            title: '1. Ad Campaign Architectures',
            videoUrl: 'https://www.youtube.com/embed/nU-IIX3eSFA',
            duration: 12,
            textContent: `# Ad Funnels\nIdentify landing pages target parameters, calculate click-through rates (CTR), and budget CPC (cost-per-click) campaigns.`
          }
        ]
      },
      {
        title: 'Go (Golang) Programming Bootcamp',
        description: 'Write concurrent, statically-typed network services using Go routines and channels.',
        category: 'Programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Liam Code'),
        lessons: [
          {
            title: '1. Go Types & Pointers',
            videoUrl: 'https://www.youtube.com/embed/YS4e4q9oBaU',
            duration: 10,
            textContent: `# Go Typings\nLearn compiler variables decls, memory pointer addresses, and type safety constraints.`
          }
        ]
      },
      {
        title: 'Corporate Finance Essentials',
        description: 'Read balance sheets, project cash-flows, and evaluate NPV (Net Present Value) investment thresholds.',
        category: 'Finance',
        thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Lisa Finance'),
        lessons: [
          {
            title: '1. Reading Balance Sheets',
            videoUrl: 'https://www.youtube.com/embed/1K3dFElS2uA',
            duration: 13,
            textContent: `# Corporate Ledger\nMap current assets, liability allocations, equity distributions, and run basic audit ratios.`
          }
        ]
      },
      {
        title: 'French Language for Beginners',
        description: 'Learn French pronunciation, daily expressions, article allocations, and conjugation verbs.',
        category: 'Languages',
        thumbnailUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Elena Lang'),
        lessons: [
          {
            title: '1. Le Verbe Être et Avoir',
            videoUrl: 'https://www.youtube.com/embed/HD4jB2VqPGo',
            duration: 8,
            textContent: `# French Pronunciation\nLearn greetings (Bonjour, Salut) and conjugate basic helper verbs like "être" and "avoir".`
          }
        ]
      },
      {
        title: 'Video Editing in Premiere Pro',
        description: 'Master non-linear video cutting, audio scrubbing, color grading LUTs, and transitions.',
        category: 'Creative Arts',
        thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Marcus Art'),
        lessons: [
          {
            title: '1. Editing Timelines',
            videoUrl: 'https://www.youtube.com/embed/H8gVl0d_9Hw',
            duration: 15,
            textContent: `# Cuts & Timelines\nManage keyframe points, color spaces, audio channels, and render properties.`
          }
        ]
      },
      {
        title: 'SEO Strategy Masterclass',
        description: 'Audit technical page indexes, research low-competition keywords, and track Google rank positions.',
        category: 'Marketing',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571721795195-a2ca2d33e081?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('John Business'),
        lessons: [
          {
            title: '1. Crawler Indexes & Backlinks',
            videoUrl: 'https://www.youtube.com/embed/D3-v978p8kI',
            duration: 10,
            textContent: `# SEO Ranking\nAnalyze URL schema structures, optimize robot sitemaps, and design crawlable heading structures.`
          }
        ]
      },
      {
        title: 'Introduction to Rust Programming',
        description: 'Master borrow checkers, lifetimes ownership models, pattern matching, and cargo CLI.',
        category: 'Programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Liam Code'),
        lessons: [
          {
            title: '1. Ownership & References',
            videoUrl: 'https://www.youtube.com/embed/VFI7B_TzW7Y',
            duration: 18,
            textContent: `# Rust Memory Safety\nRust ensures memory safety without a garbage collector through borrow check lifecycles.`
          }
        ]
      },
      {
        title: 'Data Visualization with Tableau',
        description: 'Design dashboard interfaces, load databases, and configure interactive map filters.',
        category: 'Data Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Loading Datasets',
            videoUrl: 'https://www.youtube.com/embed/7Jl-RwkzqQ4',
            duration: 12,
            textContent: `# Tableau Dashboards\nCreate data tables, connect CSV sheets, map coordinate coordinates, and run analytics graphs.`
          }
        ]
      },
      {
        title: 'Introduction to C++',
        description: 'Master memory allocation, arrays, pointer references, class structures, and headers scripts.',
        category: 'Programming',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Liam Code'),
        lessons: [
          {
            title: '1. Pointers & References',
            videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
            duration: 16,
            textContent: `# C++ Pointers\nLearn memory layouts, pointer decls, deferencing modifiers, and address operators.`
          }
        ]
      },
      {
        title: 'SQL & Relational Databases',
        description: 'Learn SQL select commands, inner/outer joins, indexing parameters, and query executions.',
        category: 'Data Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. SQL Selects & Queries',
            videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY',
            duration: 11,
            textContent: `# SQL Syntax\nLearn database schemas, select commands, table structures, and filtering results.`
          }
        ]
      },
      {
        title: 'React Native for Mobile Apps',
        description: 'Build native iOS and Android applications using React Native and Expo scaffolding tools.',
        category: 'Mobile Development',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Dr. Jane Dev'),
        lessons: [
          {
            title: '1. Native Views & Components',
            videoUrl: 'https://www.youtube.com/embed/gvkqT_qiByM',
            duration: 14,
            textContent: `# Mobile Views\nUtilize native component bridges (View, Text, ScrollView) and style elements using flex properties.`
          }
        ]
      },
      {
        title: 'Artificial Intelligence & Ethics',
        description: 'Audit training data bias, neural predictions transparency, and model regulatory standards.',
        category: 'Artificial Intelligence',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Bias in Machine Learning',
            videoUrl: 'https://www.youtube.com/embed/gV7L5e_wK50',
            duration: 15,
            textContent: `# Ethical AI\nExplore algorithm bias, metrics representation, training datasets balance, and explainable neural predictions.`
          }
        ]
      },
      {
        title: 'AWS SysOps Administration',
        description: 'Learn system operations management on AWS. Configure auto-scaling rules and cloud-watch logs monitoring.',
        category: 'DevOps',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Mark Cloud'),
        lessons: [
          {
            title: '1. CloudWatch Log Filters',
            videoUrl: 'https://www.youtube.com/embed/E-0t_j_uHkU',
            duration: 12,
            textContent: `# Cloud Administration\nConfigure alarm metrics notifications, trigger auto-scaling scale up operations, and monitor CPU metrics.`
          }
        ]
      },
      {
        title: 'Product Design Principles',
        description: 'Explore physical and digital product form design, ergonomics, and aesthetic guidelines.',
        category: 'UI/UX Design',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Sarah Design'),
        lessons: [
          {
            title: '1. What is Product Design?',
            videoUrl: 'https://www.youtube.com/embed/Rk3pXzRkH60',
            duration: 13,
            textContent: `# Industrial Design\nCombine visual aesthetics, ergonomics functionality, design guidelines, and materials manufacturing requirements.`
          }
        ]
      },
      {
        title: 'German Language for Beginners',
        description: 'Learn basic German pronunciation, conjugation rules, genders, and daily conversational phrases.',
        category: 'Languages',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Elena Lang'),
        lessons: [
          {
            title: '1. German Cases & Articles',
            videoUrl: 'https://www.youtube.com/embed/hVw3LioPwtA',
            duration: 10,
            textContent: `# German Articles\nUnderstand cases (Nominativ, Akkusativ, Dativ) and learn basic genders (der, die, das) configurations.`
          }
        ]
      },
      {
        title: 'Adobe Illustrator Mastery',
        description: 'Create vector illustrations, master pen-tool nodes editing, typography, and logos designs.',
        category: 'Creative Arts',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Marcus Art'),
        lessons: [
          {
            title: '1. Pen Tool Vector Nodes',
            videoUrl: 'https://www.youtube.com/embed/2a7C4M9a87o',
            duration: 14,
            textContent: `# Vector Illustration\nCreate clean vector graphics, align anchor nodes, manipulate curves handles, and export SVG file types.`
          }
        ]
      },
      {
        title: 'Mastering Next.js 14 App Router',
        description: 'Learn server actions, server components, dynamic layouts, static generation, and edge deployments with Next.js.',
        category: 'Web Development',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Dr. Jane Dev'),
        lessons: [
          {
            title: '1. Next.js App Router Architecture',
            videoUrl: 'https://www.youtube.com/embed/gSSsRyo86s0',
            duration: 18,
            textContent: '# Next.js Server Components\nLearn the differences between Server and Client Components, layout nesting rules, and streaming content.'
          }
        ]
      },
      {
        title: 'Advanced Machine Learning with PyTorch',
        description: 'Design deep neural networks, CNNs for computer vision, RNNs, and custom transformer layers.',
        category: 'Artificial Intelligence',
        thumbnailUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Custom Neural Network Layers',
            videoUrl: 'https://www.youtube.com/embed/V_xro1BCn4o',
            duration: 22,
            textContent: '# PyTorch Tensors & Gradients\nWrite backpropagation rules, initialize custom tensor structures, and optimize weight allocations.'
          }
        ]
      },
      {
        title: 'Certified Ethical Hacker (CEH) Prep',
        description: 'Prepare for the CEH exam. Master penetration testing methodologies, footprinting, scanning, and social engineering hacks.',
        category: 'Cybersecurity',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Alex Cyber'),
        lessons: [
          {
            title: '1. Reconnaissance and Scanning',
            videoUrl: 'https://www.youtube.com/embed/nz89H1lS6K0',
            duration: 16,
            textContent: '# Penetration Testing Footprinting\nLearn network port scans with Nmap, DNS lookups configurations, and passive footprinting.'
          }
        ]
      },
      {
        title: 'Data Analytics with R Programming',
        description: 'Clean, filter, statistical test, and plot large data sets using R, RStudio, and ggplot2.',
        category: 'Data Science',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. ggplot2 Visualization Engine',
            videoUrl: 'https://www.youtube.com/embed/X3paOmcrTjQ',
            duration: 12,
            textContent: '# Data Visualization in R\nLearn mapping aesthetics, adding layers, and tuning coordinate systems with ggplot2.'
          }
        ]
      },
      {
        title: 'Build Chatbots with LangChain & OpenAI',
        description: 'Learn vector embeddings, retrieval-augmented generation (RAG), conversational agents, and prompts templates.',
        category: 'Artificial Intelligence',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('David Data'),
        lessons: [
          {
            title: '1. Vector Databases & Document Loaders',
            videoUrl: 'https://www.youtube.com/embed/nz89H1lS6K0',
            duration: 15,
            textContent: '# LLM Prompting Chains\nLoad PDF texts, split documents with text splitter engines, embed texts into Pinecone vector storage.'
          }
        ]
      },
      {
        title: 'Secure Coding Practices for Web Apps',
        description: 'Protect your React/Node code from SQL injections, Cross-Site Scripting (XSS), and Broken Authentication.',
        category: 'Cybersecurity',
        thumbnailUrl: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop',
        instructor: getInst('Alex Cyber'),
        lessons: [
          {
            title: '1. OWASP Top 10 Prevention',
            videoUrl: 'https://www.youtube.com/embed/nz89H1lS6K0',
            duration: 14,
            textContent: '# Web Security Defense\nConfigure CORS policies, sanitize input fields, encrypt session cookies, and protect SQL queries.'
          }
        ]
      }
    ];

    const extraCourses = [
      {
        title: "Docker & Containerization Deep Dive",
        description: "Master Docker containers, image building, docker-compose, multi-stage builds, and volume networking layouts.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Mark Cloud"),
        lessons: [
          {
            title: "1. Understanding Containerization",
            videoUrl: "https://www.youtube.com/embed/3hLmDS179YE",
            duration: 15,
            textContent: "# Docker Containerization\nLearn namespaces, cgroups, writing Dockerfiles, and starting virtual containers."
          }
        ]
      },
      {
        title: "Kubernetes Production Orchestration",
        description: "Orchestrate containers at scale. Configure pods, services, ingress controllers, configmaps, and persistent volumes.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Mark Cloud"),
        lessons: [
          {
            title: "1. K8s Cluster Architecture",
            videoUrl: "https://www.youtube.com/embed/3hLmDS179YE",
            duration: 18,
            textContent: "# Kubernetes Nodes\nUnderstand control planes, kubelets, worker nodes, API servers, and ETCD state stores."
          }
        ]
      },
      {
        title: "TypeScript for Enterprise Applications",
        description: "Master advanced TypeScript features: interfaces, generic types, utilities helpers, and strict configuration bounds.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1516116211223-5c359a36298a?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Dr. Jane Dev"),
        lessons: [
          {
            title: "1. Generics & Utility Types",
            videoUrl: "https://www.youtube.com/embed/gvkqT_qiByM",
            duration: 12,
            textContent: "# Advanced Typescript\nWrite strict generic interfaces, utilize Omit, Pick, Record helpers, and configure tsconfig parameters."
          }
        ]
      },
      {
        title: "SvelteKit & Svelte Core Guide",
        description: "Build incredibly fast, compiler-first web applications using SvelteKit pages routing and state management.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Dr. Jane Dev"),
        lessons: [
          {
            title: "1. Svelte Reactivity Model",
            videoUrl: "https://www.youtube.com/embed/gvkqT_qiByM",
            duration: 14,
            textContent: "# Svelte Compiler\nExplore reactive declarations, store subscriptions, and routing layouts configurations."
          }
        ]
      },
      {
        title: "GraphQL APIs with Apollo & Node",
        description: "Design efficient API schemas, type definitions, resolvers, mutations, and database queries filters with Apollo.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Dr. Jane Dev"),
        lessons: [
          {
            title: "1. Schema Definitions & Resolvers",
            videoUrl: "https://www.youtube.com/embed/gvkqT_qiByM",
            duration: 16,
            textContent: "# GraphQL Queries\nWrite custom schema types, set resolver mapping logic, and eliminate N+1 query bottlenecks."
          }
        ]
      },
      {
        title: "TailwindCSS Premium UI Layouts",
        description: "Utilize utility-first grid setups, custom responsive flexboxes, overlays, animation utilities, and layout states.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Sarah Design"),
        lessons: [
          {
            title: "1. Responsive Grids & Hover States",
            videoUrl: "https://www.youtube.com/embed/gvkqT_qiByM",
            duration: 10,
            textContent: "# Tailwind Styling\nBuild responsive dashboard wireframes with tailwind breakpoints and hover animations."
          }
        ]
      },
      {
        title: "Testing React with Vitest & RTL",
        description: "Test components reliability. Master mock contexts, simulate clicks, and measure coverage markers with Vitest.",
        category: "Web Development",
        thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Dr. Jane Dev"),
        lessons: [
          {
            title: "1. Component Testing & Screen Queries",
            videoUrl: "https://www.youtube.com/embed/gvkqT_qiByM",
            duration: 15,
            textContent: "# React Testing Library\nWrite unit tests, query inputs, mock axios network calls, and assert layout structures."
          }
        ]
      },
      {
        title: "Python for Predictive Analytics",
        description: "Learn regression algorithms, decision tree qualifiers, random forests models, and evaluation coefficients with Python.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Linear & Logistic Regressions",
            videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
            duration: 16,
            textContent: "# Scikit Learn Predictive\nTrain predictive models, compute mean squared errors, and plot regression curves."
          }
        ]
      },
      {
        title: "Time Series Forecasting with Pandas",
        description: "Clean date indices, resample metrics frequencies, compute rolling means, and build forecasting ARIMA curves.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Date Resampling & Rolling Windows",
            videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
            duration: 14,
            textContent: "# Time Series Analysis\nManipulate DateTime indices in Pandas, resample financial ticks, and detect seasonal markers."
          }
        ]
      },
      {
        title: "SQL Query Optimization Secrets",
        description: "Inspect query execution plans, configure optimal index bounds, and rebuild slow database subqueries.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Execution Plans & Index Triggers",
            videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
            duration: 12,
            textContent: "# Database Performance Tuning\nLearn EXPLAIN queries, configure composite indices, and prevent nested loop joins database blocks."
          }
        ]
      },
      {
        title: "Tableau Dashboards for Business Intel",
        description: "Connect multiple data sheets, build custom worksheets, map geographies, and assemble interactive dashboards.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Worksheets & Interactive Filters",
            videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
            duration: 13,
            textContent: "# Tableau Visualizations\nBuild bar-in-bar charts, configure quick filter operations, and design analytics storyboards."
          }
        ]
      },
      {
        title: "Apache Spark Big Data Processing",
        description: "Process massive datasets. Master resilient distributed datasets (RDD), DataFrames pipelines, and Spark SQL query bounds.",
        category: "Data Science",
        thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Distributed RDD Transformations",
            videoUrl: "https://www.youtube.com/embed/X3paOmcrTjQ",
            duration: 18,
            textContent: "# Big Data Spark\nUnderstand transformations vs actions, map-filter tasks, memory caching, and cluster cluster executions."
          }
        ]
      },
      {
        title: "Intro to Deep Learning with Keras",
        description: "Build feedforward neural systems, configure loss metrics, and optimize learning weights rates inside Keras.",
        category: "Artificial Intelligence",
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Neural Layer Stacks & Optimizers",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 15,
            textContent: "# Keras Deep Learning\nStack dense layers, compile with adam optimizer, configure batch sizes, and fit training runs."
          }
        ]
      },
      {
        title: "Natural Language Processing with Transformers",
        description: "Master HuggingFace library, fine-tune BERT models, construct tokens, and design sentiment pipelines.",
        category: "Artificial Intelligence",
        thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Fine-tuning Language Transformers",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 20,
            textContent: "# BERT Sentiment Tuning\nLearn token masking, configuring trainer pipelines, and saving weights indicators."
          }
        ]
      },
      {
        title: "Computer Vision with OpenCV",
        description: "Extract image features, detect outlines, track faces, and filter camera frames streams in real-time.",
        category: "Artificial Intelligence",
        thumbnailUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Frame Feature Extraction & Grayscales",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 15,
            textContent: "# OpenCV Feature Detections\nFilter images to grayscale formats, compute Canny edge detectors, and track color contours."
          }
        ]
      },
      {
        title: "Reinforcement Learning Foundations",
        description: "Master Q-learning algorithms, Markov Decision Processes, policy gradients iteration loops, and gym environments.",
        category: "Artificial Intelligence",
        thumbnailUrl: "https://images.unsplash.com/photo-1525338078858-8ae62a830922?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Bellman Equations & Q-Tables",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 18,
            textContent: "# Q-Learning Mechanics\nWrite policy equations, configure rewards maps, and update target metrics states."
          }
        ]
      },
      {
        title: "AI-Powered Search Engine Design",
        description: "Master lexical vs semantic search indexes. Build dense embeddings search databases using Elastic and vector stores.",
        category: "Artificial Intelligence",
        thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("David Data"),
        lessons: [
          {
            title: "1. Semantic Embedding Search Indexes",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 16,
            textContent: "# Semantic Vector Searches\nExtract sentence vector embeddings, store in FAISS indexing matrices, and run queries."
          }
        ]
      },
      {
        title: "CompTIA Security+ Prep Course",
        description: "Prepare for the Security+ certification. Master network defenses, physical security, identity controls, and risk frameworks.",
        category: "Cybersecurity",
        thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Alex Cyber"),
        lessons: [
          {
            title: "1. Security Defense Architectures",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 20,
            textContent: "# Security+ Principles\nExplore authorization controls, security frameworks, threat landscape assessments, and firewalls layouts."
          }
        ]
      },
      {
        title: "OWASP Top 10 API Security Checklist",
        description: "Secure REST APIs from broken object-level authorization, rate-limit exhausts, mass assignments, and injection exploits.",
        category: "Cybersecurity",
        thumbnailUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Alex Cyber"),
        lessons: [
          {
            title: "1. Broken Object Authorization Securing",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 15,
            textContent: "# API Authentication Security\nSecure ID tokens validation filters, inspect database record authorization ownerships, and restrict payload bounds."
          }
        ]
      },
      {
        title: "Metasploit Penetration Testing Guide",
        description: "Master target scanning, exploit payload configurations, post-exploitation maneuvers, and reporting frameworks.",
        category: "Cybersecurity",
        thumbnailUrl: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Alex Cyber"),
        lessons: [
          {
            title: "1. Targeting Exploits & Payloads",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 18,
            textContent: "# Metasploit Frameworks\nConfigure scanning configurations, select exploit modules, assign payloads types, and launch testing modules."
          }
        ]
      },
      {
        title: "Network Traffic Analysis with Wireshark",
        description: "Inspect packet streams headers, isolate slow network connections, filter DNS traffic logs, and rebuild HTTP data streams.",
        category: "Cybersecurity",
        thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Alex Cyber"),
        lessons: [
          {
            title: "1. Isolating Packet Capture Protocols",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 14,
            textContent: "# Wireshark Traffic Auditing\nCapture packet dumps, set display filters, inspect TCP handshakes, and isolate HTTP packets."
          }
        ]
      },
      {
        title: "Linux Hardening & Server Securing",
        description: "Configure SSH keys constraints, disable root logins, set iptables firewall filters, and audit cron permissions.",
        category: "Cybersecurity",
        thumbnailUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=600&auto=format&fit=crop",
        instructor: getInst("Alex Cyber"),
        lessons: [
          {
            title: "1. SSH Configuration Hardenings",
            videoUrl: "https://www.youtube.com/embed/nz89H1lS6K0",
            duration: 15,
            textContent: "# Linux System Security\nEdit sshd_config files, configure key limits, assign custom port rules, and enable firewalld daemons."
          }
        ]
      }
    ];

    courses.push(...extraCourses);

    const primaryCategories = ['Web Development', 'Data Science', 'Artificial Intelligence', 'Cybersecurity'];
    
    // Base course counts
    const categoryCounts = {};
    courses.forEach(c => {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    });

    // Let's generate additional courses dynamically for each category to reach 22
    const targetCountPerCategory = 22;
    let generatedCount = 0;

    const topicWords = {
      'Web Development': {
        nouns: ['React Router Routing', 'Node.js Clustering Optimization', 'Express Middleware Pipelines', 'Redux Store Integration', 'CSS Grid Layouts', 'SEO Auditing Practices', 'Vite Bundler Setups', 'Webpack Config Modules', 'DOM Manipulation Filters', 'SASS Preprocessor Compilers', 'OAuth Authentication Handlers', 'PWA Serviceworker Caches'],
        descriptions: [
          'Master advanced concepts in software architecture and rendering pathways.',
          'Optimize rendering scripts and manage backend session controls.',
          'Design modular file structures and configure strict build parameters.'
        ]
      },
      'Data Science': {
        nouns: ['Pandas Join Commands', 'NumPy Vector Calculations', 'Data Cleansing Pipelines', 'Matplotlib Plot Customizations', 'K-Means Clustering Models', 'Logistic Classifier Algorithms', 'Statistical Significance Computations', 'Hypothesis Testing Frameworks', 'Feature Engineering Methods', 'Probability Distribution Fits'],
        descriptions: [
          'Inspect statistical variables, clean dataset parameters, and plot distributions.',
          'Analyze model coefficients, optimize hyperparameters, and evaluate error metrics.',
          'Build clean analytics visualizers and present descriptive metrics.'
        ]
      },
      'Artificial Intelligence': {
        nouns: ['Neural Weights Optimization', 'Activation Functions Tuning', 'Loss Coefficients Calculations', 'Tensor Transforms Layouts', 'Generative Prompts Engineering', 'CNN Architectures Layers', 'Vector Embedding Matrices FAISS', 'ARIMA Time Series Analysis', 'BERT Tokenizers Classifiers', 'Q-learning Target Policies MDP'],
        descriptions: [
          'Configure deep learning neural networks and optimize weights allocations.',
          'Fine-tune language transformer parameters and build semantic search indices.',
          'Train cognitive decision models in simulated gym environments.'
        ]
      },
      'Cybersecurity': {
        nouns: ['Threat Vector Scan Audit', 'Nmap Port Rules Scanning', 'Exploit Payload Configurations', 'Packet Header Isolation Protocols', 'Linux Server Hardenings SSH', 'VPC Routing Segments VPN', 'XSS Injection Prevention Headers', 'CSRF Cookie Tokens Validation', 'SSL Certificate Verification TLS'],
        descriptions: [
          'Scan networks vulnerabilities, identify target vectors, and audit configurations.',
          'Configure secure routing loops, enforce keys restrictions, and monitor traffic logs.',
          'Verify cryptographic parameters and inspect package headers details.'
        ]
      }
    };

    primaryCategories.forEach(cat => {
      const currentCount = categoryCounts[cat] || 0;
      const needed = targetCountPerCategory - currentCount;
      
      for (let i = 0; i < needed; i++) {
        const words = topicWords[cat];
        const topic = words.nouns[i % words.nouns.length] + ' ' + (i + 1);
        const desc = words.descriptions[i % words.descriptions.length] + ' Structured learning path designed by software specialists.';
        
        courses.push({
          title: `${cat} Pathway: ${topic}`,
          description: desc,
          category: cat,
          thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
          instructor: getInst(cat === 'Web Development' ? 'Dr. Jane Dev' : cat === 'Cybersecurity' ? 'Alex Cyber' : 'David Data'),
          lessons: [
            {
              title: `Lesson 1: Introduction to ${topic}`,
              videoUrl: 'https://www.youtube.com/embed/nz89H1lS6K0',
              duration: 10 + (i % 5) * 2,
              textContent: `# Course Topic: ${topic}\nExplore core principles, verify configurations, run tests, and work with the AI Study Buddy.`
            }
          ]
        });
        generatedCount++;
      }
    });

    // Assign random prices, category-specific thumbnails, and custom GFG syllabuses with real YouTube links to all courses
    const priceTiers = [499, 999, 1499, 1999, 2499, 2999];
    courses.forEach((course, idx) => {
      course.price = priceTiers[idx % priceTiers.length];
      
      const cleanCat = course.category || 'Web Development';
      const cleanTitle = course.title.replace(`${cleanCat} Pathway: `, '');
      course.thumbnailUrl = getCategoryThumbnail(cleanCat, idx);
      course.lessons = generateGfgLessons(cleanCat, cleanTitle);
    });

    console.log(`Programmatically generated ${generatedCount} courses to ensure exactly ${targetCountPerCategory} courses per category!`);

    await Course.insertMany(courses);
    console.log(`Successfully seeded database with ${courses.length} courses!`);
    
    console.log('\n----------------------------------------');
    console.log('ACCOUNTS FOR TESTING:');
    console.log('Admin Login:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');
    console.log('\nStudent Login:');
    console.log('  Email: student@example.com');
    console.log('  Password: password123');
    console.log('----------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
};

seedData();
