#  Task Manager Pro - Frontend

Frontend application for Task Manager Pro.  
Built using React (Vite) with role-based authentication and protected routes.

---

#  Tech Stack

- React
- Vite
- Axios
- React Router DOM
- Context API
- CSS

---

#  Folder Structure

```
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
│
└── vite.config.js
```

---

#  Setup Instructions

##  Install Dependencies

```bash
npm install
```

---

##  Run Frontend

```bash
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

# API Configuration

Make sure backend is running.

 deployed backend:

```js
axios.defaults.baseURL = "https://taskmanager-backend-u0mq.onrender.com/api";
axios.defaults.withCredentials = true;
```






---

#  Available Roles

- ADMIN
- MANAGER
- USER

Role-based UI rendering enabled.

---

#  Build for Production

```bash
npm run build
```

---

#  Deployment 


https://taskmanager-frontend-uzr3.onrender.com

- Render Static Site

---
 architect diagram
 ```bash
┌────────────────────────────┐
│        Client (Browser)    │
│        React + Vite        │
│                            │
│  - Login Page              │
│  - Dashboard               │
│  - Task Management UI      │
│                            │
│  Access Token stored in    │
│  LocalStorage              │
└───────────────┬────────────┘
                │
                │  HTTP Requests (Axios)
                │  Authorization: Bearer <token>
                ▼
┌────────────────────────────┐
│      Backend Server        │
│   Node.js + Express        │
│                            │
│  - Auth Routes             │
│  - Task Routes             │
│  - JWT Middleware          │
│                            │
└───────────────┬────────────┘
                │
                │
                ▼
┌────────────────────────────┐
│         Database           │
│         MongoDB            │
│                            │
│  - Users Collection        │
│  - Tasks Collection        │
└────────────────────────────┘
```

