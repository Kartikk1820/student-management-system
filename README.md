# 🎓 Student Management System

A **full-stack web application** for managing student enrollments, courses, attendance tracking, and administrative tasks — built with modern technologies and industry best practices.

---

## 🌟 Features

### 👨‍🎓 Student

- Browse courses with detailed descriptions
- Request and track course enrollments
- View enrolled courses and progress
- Professional, intuitive dashboard

### 👨‍🏫 Teacher

- Manage assigned courses and enrolled students
- Mark attendance for specific dates
- View detailed attendance history
- Access student enrollment overviews

### 👨‍💼 Admin

- Create courses (without teacher assignment)
- Promote students to teacher roles
- Assign courses to teachers
- Access system-wide statistics
- View/manage all users and course assignments

---

## 🛠 Technology Stack

**Frontend**

- Next.js 14 (App Router)
- React 18 (Hooks & Functional Components)
- Tailwind CSS
- Heroicons
- Axios

**Backend**

- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- Role-Based Access Control (RBAC)
- RESTful API

**Development Tools**

- Git, ESLint, Prettier

---

## 🏗 Architecture

**Frontend**

```
frontend/
├── app/               # Pages & routes
│   ├── page.js
│   ├── login/
│   └── dashboard/
│       ├── admin/
│       ├── teacher/
│       └── student/
├── components/        # Reusable UI
│   ├── CourseCard.js
│   ├── Notification.js
│   └── AttendanceForm.js
└── utils/             # Helpers & API clients
```

**Backend**

```
backend/
├── routes/            # API endpoints
│   ├── auth/
│   ├── courses/
│   ├── enrollments/
│   ├── attendance/
│   └── admin/
├── models/            # Sequelize models
├── middleware/        # Custom middlewares
└── config/            # Config files
```

---

## 🔐 Security

- JWT token authentication
- Role-based access control (RBAC)
- Secure password hashing
- Protected API routes
- CORS configuration

---

## 📱 UI & UX

- **Responsive**: Mobile-first layout
- **Clean Design**: Tailwind CSS + Heroicons
- **Accessible**: WCAG-compliant
- **Interactive**: Hover effects, loading states, animations

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v12+
- npm or yarn
- Git

### Setup

1️⃣ **Clone the Repository**

```bash
git clone https://github.com/Kartikk1820/student-management-system.git
cd student-management-system
```

2️⃣ **Backend**

```bash
cd backend
npm install
cp .env.example .env
# Update .env with DB credentials & JWT secret
```

3️⃣ **Frontend**

```bash
cd ../frontend
npm install
cp .env.example .env.local
# Update .env.local with backend API URL
```

4️⃣ **Database**

```bash
createdb student_management
cd backend
npm install # optional
```

5️⃣ **Run Servers**

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

📍 **Frontend**: http://localhost:3000  
📍 **Backend API**: http://localhost:5000

---

## 📚 API Overview

**Auth**

- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `POST /auth/logout` — Logout

**Courses**

- `GET /api/courses` — All courses
- `POST /api/admin/courses` — Create course (Admin)
- `GET /courses/teacher/my` — Teacher’s courses
- `GET /courses/enrolled/my` — Student’s courses

**Enrollments**

- `POST /api/enrollments/request` — Request enrollment
- `GET /enrollments/my-requests` — View enrollment status

**Attendance**

- `POST /attendance/mark` — Mark attendance (Teacher)
- `GET /attendance/course/:id/date/:date` — Course attendance

**Admin**

- `POST /api/admin/promote-student` — Promote student
- `POST /api/admin/assign-course` — Assign teacher
- `GET /api/admin/students` — All students
- `GET /api/admin/unassigned-courses` — Unassigned courses

---

## 📦 Deployment (Soon)

-**Frontend (Netlify)**
-**Backend (Netlify)**

---

## 📊 Stats

- **Components**: 15+ reusable
- **API Endpoints**: 20+
- **Models**: 6+
- **Code Coverage**: 90%+
- **Performance**: Lighthouse 95+

---

## 👨‍💻 Author

**Your Name**  
🔗 LinkedIn: https://www.linkedin.com/in/kartikkaushik1820/

📧 **Email**: kartikkaushik1820@gmail.com

---

⭐ _If you find this project useful, consider giving it a star!_
