🍬 Sweet Shop Management System (TDD Kata)

A full-stack Sweet Shop Management System built using Test-Driven Development (TDD) principles.
The application provides secure authentication, inventory management, and  for managing sweets in a modern, scalable way.

🚀 Project Overview

This project is designed to simulate a real-world inventory and sales system for a sweet shop.
It allows users to browse, search, and purchase sweets, while admin users can manage inventory operations such as adding, updating, deleting.

The system follows clean architecture, RESTful API design, and modern frontend practices, with strong test coverage and transparent AI usage.

----------------------------------------------------------------------------------
Deployement URL: https://sweet-shop-management-system-35jj.vercel.app/

1: signup the account 
2: after that there is one conformation mail accept it 
3: Then, signin the account after that redirect into home page.

----------------------------------------------------------------------------------

🧱 Tech Stack
Backend

Node.js + TypeScript

Express.js

Supabase

Authentication (JWT-based)

PostgreSQL Database

Supertest ( API Testing)

Frontend

React.js

TypeScript

Tailwind CSS

Axios

React Router

Dev & Tools

Git & GitHub

Supabase CLI

ESLint & Prettier

AI tools (disclosed below)

🔐 Authentication & Roles

User Registration & Login using Supabase Auth

JWT-based protected routes

Role-based access

User → View & purchase sweets

Admin → Add, update, delete, restock sweets

📌 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login

Sweets (Protected)
POST   /api/sweets
GET    /api/sweets
GET    /api/sweets/search
PUT    /api/sweets/:id
DELETE /api/sweets/:id   (Admin only)

Inventory
POST /api/sweets/:id/purchase
POST /api/sweets/:id/restock   (Admin only)

🧪 Test-Driven Development (TDD)

This project strictly follows the Red → Green → Refactor approach.

Testing Strategy

Unit tests for services

Integration tests for API endpoints

Authentication & authorization test cases

Inventory edge cases (out-of-stock, invalid purchase, admin access)

Tools Used

Jest

Supertest

📊 High test coverage achieved with meaningful assertions

🎨 Frontend Features

User registration & login

Responsive dashboard listing sweets

Search & filter by:

Name

Category

Price range

Purchase button 

Admin dashboard:

Add sweet

Update sweet

Delete sweet

Restock inventory


2️⃣ Backend Setup
cd backend
npm install


Create .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_secret


Run backend:

npm run dev


Run tests:

npm test

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🖼️ Screenshots

📌 Screenshots of dashboard, auth pages, admin panel, and purchase flow included in /screenshots folder.

🤖 My AI Usage (Mandatory Section)
AI Tools Used

ChatGPT 
How I Used AI


Assisted in writing unit and integration test cases

Helped refactor code for better readability and SOLID principles

Brainstormed UI/UX improvements for the frontend dashboard

My Reflection

AI significantly improved my development speed and helped catch edge cases early.

However, all logic, architectural decisions, validations, and refactoring were manually reviewed and implemented by me.
AI acted as a development assistant, not a replacement for understanding or ownership of the code.

🧾 Git & Version Control

Frequent commits with clear messages

TDD-oriented commit flow

AI co-authorship added wherever AI tools were used

Example:

feat: implement sweets purchase API


🌍 Deployment (Optional)

🔗 Live Application: https://sweet-shop-management-system-35jj.vercel.app/

Frontend: Vercel 

Backend: Supabase + Render 

✅ Assignment Compliance Checklist

✔ RESTful Backend API

✔ Supabase Auth & Database

✔ JWT-secured routes

✔ Full SPA frontend

✔ TDD with test reports

✔ Clean code & Git history
