# NextLearn 🎓
> A Premium Tech-Focused Learning Management System with Interactive Study Buddy, Custom Curriculum Builder, and Secure Payment Gateway

NextLearn is a premium MERN Stack Learning Management System structured specifically for computer science, software engineering, and technology learners. It features an English Heritage aesthetic (British Racing Green, Oxford Navy, and English Oak Gold colors), customized study paths, interactive progress tracking, an embedded Study Buddy chatbot (powered by Google Gemini), and a simulated secure payment gateway.

---

## 🚀 Key Features

*   **Premium Tech Pathways**: Mapped curriculums for Web Development, Data Science, Artificial Intelligence, and Cybersecurity.
*   **Interactive Study Buddy**: Context-aware learning assistant residing in all lesson rooms to review code, draft summaries, and clear roadblocks.
*   **Course Curriculum Builder**: Dynamic interface for instructors to define syllabuses, upload video content, write Markdown lesson sheets, and set course prices (e.g. ₹499, ₹999, ₹1499, etc.).
*   **Simulated Secure Checkout**: Interactive checkout gateway modal supporting Debit/Credit Cards (validation formatted), UPI app triggers, and NetBanking bank portal page transitions.
*   **Stately Statistics & Progress Tracker**: Real-time progress bars, completed lesson indicators, and a Weekly Study Target Hours/Weeks planner.
*   **Admin Master Control Panel**: Access for system administrators to audit users list, modify member roles, and trigger secure account deletions.

---

## 🎨 Technology Stack & Design System

*   **Frontend**: React (Vite), React Router DOM (v7), Lucide Icons.
*   **Backend**: Node.js, Express, Mongoose ODM.
*   **Database**: MongoDB (Local or Atlas).
*   **Language Models**: Google GenAI SDK (Gemini-2.5-flash).
*   **Design aesthetic**: Prestigious English Heritage style palette, custom glassmorphism panels, and offset float animations for floating badges.

---

## 📁 Repository Structure

```text
NextLearn/
├── backend/
│   ├── controllers/      # Route controllers (Auth, Courses, Chat)
│   ├── middleware/       # Role protections (Student, Instructor, Admin)
│   ├── models/           # Mongoose Schemas (User, Course, Enrollment, ChatSession)
│   ├── routes/           # REST endpoints
│   ├── .env              # Backend environments (Port, Mongo, Gemini Key)
│   ├── seed_db.js        # Seed script with 109 courses and Code With Harry videos
│   └── server.js         # Bootstrap Express application
│
└── frontend/
    ├── public/           # Image assets & illustrations
    ├── src/
    │   ├── components/   # Modular components (Navbar, Footer, ChatWidget, PaymentModal)
    │   ├── context/      # Session and Auth context
    │   ├── pages/        # Route pages (Home, Courses, CourseView, Dashboard, AdminDashboard)
    │   ├── App.jsx       # App shell & router configurations
    │   ├── index.css     # Global styles & keyframe animations
    │   └── main.jsx      # Entry point
```

---

## 🛠️ Local Installation & Development Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB installed and running locally on your system

### 1. Configure the Backend
Navigate to the `/backend` folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file inside the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nextlearn
JWT_SECRET=YOUR_SUPER_SECRET_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 2. Seed the Database
Populate the database with the testing accounts and 109 comprehensive tech courses (featuring Code With Harry videos and GeeksforGeeks notes):
```bash
node seed_db.js
```

### 3. Configure the Frontend
Navigate to the `/frontend` folder and install dependencies:
```bash
cd ../frontend
npm install
```

### 4. Start the Application
Start the backend server:
```bash
# In backend/ directory
npm run dev
```

Start the frontend Vite server:
```bash
# In frontend/ directory
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Seeded Testing Credentials

You can log in using these preset credentials:

*   **Administrator Account**:
    *   **Email**: `admin@example.com`
    *   **Password**: `password123`
*   **Student Account**:
    *   **Email**: `student@example.com`
    *   **Password**: `password123`
*   **Instructor Account**:
    *   **Email**: `instructor@example.com`
    *   **Password**: `password123`

---

## 📝 License
NextLearn is open-source software licensed under the MIT License.
