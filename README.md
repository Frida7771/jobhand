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


## Deployment

### Backend on Render

1. Create a new Web Service on Render, connect this repo, set root to project root (where `server.ts` is) and build/run commands:

   - Build Command: `npm install`
   - Start Command: `npm run start` (or `npm run dev` for test env)

2. Environment Variables (Render → Settings → Environment):

   - `NODE_ENV=production`
   - `PORT=10000` (Render sets one internally; you can omit and use `process.env.PORT`)
   - `MONGO_URL=<your mongo connection string>`
   - `JWT_SECRET=<strong secret>`
   - `JWT_EXPIRES_IN=1d`
   - `ADMIN_EMAIL=<your admin email>`
   - `FRONTEND_URL=https://<your-vercel-domain>`
   - `GOOGLE_CLIENT_ID=<google client id>`
   - `GOOGLE_CLIENT_SECRET=<google client secret>`
   - `GOOGLE_CALLBACK_URL=https://<your-render-domain>/api/v1/auth/google/callback`

3. CORS

   Backend reads `FRONTEND_URL` and configures CORS with `credentials: true`. Ensure the value exactly matches your production frontend domain.

4. Verify

   - Open `https://<your-render-domain>/api/v1` to see a JSON response.
   - Open `https://<your-render-domain>/api/v1/auth/google` to see Google OAuth consent.

### Frontend on Vercel (Vite)

1. Import Git repository into Vercel. Set Root Directory to `client`.

2. Build Settings:

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. Environment Variables (Vercel → Settings → Environment Variables):

   - `VITE_API_URL=https://<your-render-domain>/api/v1`

   Re-deploy after changes.

4. SPA Rewrite (avoid 404 on deep links like `/dashboard`):

   Create `client/vercel.json`:

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
   ```

5. OAuth Configuration (Google Cloud Console):

   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `https://<your-vercel-domain>`
   - Authorized redirect URI:
     - `https://<your-render-domain>/api/v1/auth/google/callback`


## Deployment

### Backend on Render

1. Create a new Web Service on Render, connect this repo, set root to project root (where `server.ts` is) and build/run commands:

   - Build Command: `npm install`
   - Start Command: `npm run start` (or `npm run dev` for test env)

2. Environment Variables (Render → Settings → Environment):

   - `NODE_ENV=production`
   - `PORT=10000` (Render sets one internally; you can omit and use `process.env.PORT`)
   - `MONGO_URL=<your mongo connection string>`
   - `JWT_SECRET=<strong secret>`
   - `JWT_EXPIRES_IN=1d`
   - `ADMIN_EMAIL=<your admin email>`
   - `FRONTEND_URL=https://<your-vercel-domain>`
   - `GOOGLE_CLIENT_ID=<google client id>`
   - `GOOGLE_CLIENT_SECRET=<google client secret>`
   - `GOOGLE_CALLBACK_URL=https://<your-render-domain>/api/v1/auth/google/callback`

3. CORS

   Backend reads `FRONTEND_URL` and configures CORS with `credentials: true`. Ensure the value exactly matches your production frontend domain.

4. Verify

   - Open `https://<your-render-domain>/api/v1` to see a JSON response.
   - Open `https://<your-render-domain>/api/v1/auth/google` to see Google OAuth consent.

### Frontend on Vercel (Vite)

1. Import Git repository into Vercel. Set Root Directory to `client`.

2. Build Settings:

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. Environment Variables (Vercel → Settings → Environment Variables):

   - `VITE_API_URL=https://<your-render-domain>/api/v1`

   Re-deploy after changes.

4. OAuth Configuration (Google Cloud Console):

   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `https://<your-vercel-domain>`
   - Authorized redirect URI:
     - `https://<your-render-domain>/api/v1/auth/google/callback`

### Demo
https://jobhand.vercel.app/

