# 🚀 Codelura  
### Full Stack Learning & Content Platform

Codelura is a **modern full-stack web application** built for **learning, blogging, and course management**.  
It features a scalable architecture with a powerful **admin panel**, rich-text editors, authentication, and modular frontend & backend systems.

---

## 📌 Table of Contents
- Introduction
- Project Overview
- Folder Structure
- Tech Stack
- Features
- Frontend Setup
- Backend Setup
- Environment Variables
- Future Scope
- Author

---

## 📖 Introduction

Codelura is designed to serve as a **learning and content delivery platform** where admins can create blogs and courses, and users can consume high-quality educational content through a clean and responsive interface.

The project follows **industry-level folder structuring**, **clean architecture**, and is scalable for future SaaS features.

---

## 🧠 Project Overview

- Frontend built with **Next.js 16 App Router**
- Backend built using **Node.js + Express**
- Admin panel for managing blogs and courses
- Rich-text blog editor with code highlighting
- Authentication & user management ready
- Fully modular & scalable architecture

---

## 📂 Folder Structure

```bash
Codelura/
│
├── codelura-frontend/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── blogs/
│   │   │   └── courses/
│   │   ├── blogs/
│   │   ├── courses/
│   │   │   └── [id]/
│   │   ├── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── about/
│   │   ├── admin/
│   │   ├── blog/
│   │   ├── home/
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       ├── Container.tsx
│   │       └── SectionWrapper.tsx
│   │
│   ├── providers.tsx
│   ├── globals.css
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── codelura-backend/
│   ├── App/
│   │   ├── controllers/
│   │   │   └── admin/
│   │   │       ├── blog.admin.controller.js
│   │   │       ├── course.admin.controller.js
│   │   │       └── comment.admin.controller.js
│   │   │
│   │   ├── models/
│   │   │   ├── Blog.js
│   │   │   ├── Course.js
│   │   │   ├── User.js
│   │   │   └── Comment.js
│   │   │
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── views/
│   │
│   ├── app.js
│   ├── public/
│   └── package.json
│
└── README.md


## 🛠️ Tech Stack

### 🌐 Frontend
- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CS
- Flowbite & Flowbite-React
- Framer Motio
- Radix U
- Lucide Icons
- React Icons
- Next Themes (Dark / Light Mode)

---

### ✍️ Rich Text & Editor
- TipTap Editor
- Lowligh (Code Highlighting)
- Turndow (HTML → Markdown)
- React Quill

---

### 🔐 Authentication & UX
- Google OAuth
- Axios
- React Hot Toast
- Password Strength Meter (zxcvbn)

---

### ⚙️ Backend
- Node.js
- Express.js
- REST API Architecture
- MVC Pattern
- MongoDB (Mongoose)
- Middleware-based Authentication
- Admin Controllers & Services

---

## ✨ Features

### 👤 Admin Panel
- Create / Edit / Delete **Blogs**
- Create / Manage **Courses**
- Rich-text editor with:
  - Code blocks
  - Images
  - Syntax highlighting
- Analytics-ready data models

---

### 👥 User Side
- Browse blogs & courses
- Dynamic routing (`/courses/[id]`)
- Fully responsive UI
- Dark & Light mode support

---

### 🧱 Architecture Highlights
- Modular folder structure
- Reusable shared components
- Clean separation of concerns
- Scalable for **SaaS & LMS** features


