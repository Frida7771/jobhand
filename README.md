# JobHand

**JobHand** is a full-stack recruitment management platform that helps users manage job postings, applications, and statistics efficiently. It supports user authentication, job CRUD operations, data visualization, and has an admin dashboard. The platform features a responsive design with dark mode support.

---

## Features

- User registration and login with JWT authentication or Google OAuth2.0
- Create, read, update, and delete (CRUD) job postings  
- Data statistics and visualizations  
- User profile management  
- Admin-only pages for managing users and jobs  
- Responsive UI with light/dark mode toggle  

---

## Technology Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express, Mongoose (MongoDB)  
- **Authentication:** JWT, OAuth2.0 


---

## Directory Structure

```plaintext
jobhand/
├── backend/                    # Node.js + Express backend
├── frontend/                   # React + Vite frontend
├── .gitignore
├── README.md
└── package.json

```
## Installation and Running

### 1. Clone the repository

```
git clone https://github.com/Frida7771/jobhand
cd jobhand
```
### 2. Install backend dependencies

```
cd backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` folder with the following example:

```env
NODE_ENV=development
PORT=5100
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
ADMIN_EMAIL=admin@example.com

```

### 4. Start the backend server

```bash
npm run dev
```
### 5. Install and start the frontend

```
cd client
npm install
npm run dev
```

The frontend will run by default at http://localhost:5174



