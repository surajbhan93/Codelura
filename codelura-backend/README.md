# Codelura Hackathon Project – Full Notes

## What is this?

This is a full-stack hackathon management system.
It includes:

- Backend (Node.js, Express, MongoDB)
- Frontend (Next.js, React, Tailwind CSS)
- Secure authentication (JWT)
- Admin, participant, and public APIs
- No AI logic included (for now)

## Main Models (Backend)

- **User**: Stores user info, role (admin/user), email, password (hashed), verification, purchased courses, etc.
- **Hackathon**: Stores hackathon details (title, description, registration/hackathon dates, prize pool, max team size). Status is computed dynamically (UPCOMING, REGISTRATION, ONGOING, ENDED).
- **Participation**: Tracks who joined which hackathon, prevents duplicate joins.
- **Submission**: Stores project submissions, only allowed during ONGOING phase, one per user per hackathon.
- **Leaderboard**: Stores scores, ranks, sorts by finalScore, tie-breaker by earlier submission.

## Core APIs (Backend)

### Hackathon APIs

- `GET /api/hackathons` – List all hackathons
- `GET /api/hackathons/:id` – Get hackathon details

### Participation APIs

- `POST /api/participation/join` – Join a hackathon (JWT required)
- `GET /api/participation/my-hackathons` – List user’s hackathons

### Submission APIs

- `POST /api/submission` – Submit project (JWT required, only during ONGOING)
- `GET /api/submission/:hackathonId` – Get submissions for a hackathon

### Dashboard API

- `GET /api/dashboard/hackathon/:id` – Get dashboard info (submission status, score, feedback, rank)

### Leaderboard API

- `GET /api/leaderboard/:hackathonId` – Get leaderboard (sorted, tie-breaker)

### Admin APIs

- `POST /api/admin/hackathons` – Create hackathon (JWT admin)
- `GET /api/admin/hackathons` – List all hackathons (JWT admin)
- `POST /api/admin/publish-results` – Publish results (locks submissions, freezes leaderboard)

## Security & Validation

- **JWT Authentication:** All protected routes require a valid JWT token. Tokens are signed with a secret from `.env`.
- **Role-based Access:** Admin routes require `role: "admin"` in JWT payload.
- **Input Validation:** Uses Joi for validating request bodies (registration, submission, etc.).
- **Password Hashing:** User passwords are hashed before storing.
- **Cookie Support:** Auth token can be sent via header or cookie.
- **Error Handling:** All APIs return clear error messages and status codes.

## How the Project Works (Step-by-Step)

1. Admin logs in and creates a hackathon (POST /api/admin/hackathons).
2. Users register and join hackathons during registration window (POST /api/participation/join).
3. Users submit projects during ONGOING phase (POST /api/submission).
4. Dashboard displays submission status, score, feedback, rank (GET /api/dashboard/hackathon/:id).
5. Admin publishes results, locks submissions, and freezes leaderboard (POST /api/admin/publish-results).
6. Leaderboard is updated and visible to all (GET /api/leaderboard/:hackathonId).

## Important Rules & Notes

- Cannot join hackathon twice or after registration closes (checked in Participation API).
- Can only submit during ONGOING phase (checked in Submission API).
- Only one active submission per user per hackathon.
- Leaderboard sorts by finalScore, ties resolved by earlier submission.
- Admin can lock submissions and freeze leaderboard.
- All dates/times are handled in UTC.
- All sensitive info (passwords, JWT secrets) stored securely.

## Setup & Tools

### Backend

- Node.js, Express.js, MongoDB (Mongoose)
- Nodemon for development auto-restart
- dotenv for environment variables
- Joi for validation
- jsonwebtoken for JWT
- bcrypt for password hashing
- Postman for API testing

### Frontend

- Next.js, React, Tailwind CSS
- Axios for API calls
- ESLint for code linting
- Prettier for formatting

### Database

- MongoDB (local or Atlas)
- MongoDB Compass for GUI management

### How to Run

```bash
# Backend
cd codelura-backend
npm install
cp .env.example .env   # Fill in MongoDB URI, JWT_SECRET, ADMIN_SECRET
nodemon server.js

# Frontend
cd ../codelura-frontend
npm install
npm run dev
```

## Folder Structure (Backend & Frontend)

### Backend

- `models/` – All schemas (User, Hackathon, Participation, Submission, Leaderboard)
- `routes/` – API endpoints
- `controllers/` – Logic for APIs
- `middleware/` – Auth (JWT), admin check, validation
- `config/` – DB config
- `public/` – Static files
- `uploads/` – Uploaded banners, PDFs
- `App/` – Main app logic
- `server.js` – Entry point

### Frontend

- `app/` – Main pages and layouts
- `components/` – UI and logic components
- `lib/` – API utilities
- `public/` – Static assets (images, sounds, etc.)

## Example Use Case

1. Admin logs in and creates a hackathon.
2. User signs up, verifies email, and joins a hackathon.
3. User submits project during ONGOING phase.
4. Admin publishes results and leaderboard.
5. User checks dashboard for rank, score, feedback.

## Future Improvements

- Add real-time notifications
- Integrate AI evaluation logic
- Support team submissions
- Enhance UI/UX
- Add analytics and reporting
- Improve error handling and validation

---

**Author:** Kartik Singh

- Email: kartik@gmail.com
- GitHub: [yourusername](https://github.com/yourusername)

This file is for your quick reference and understanding. Edit as needed for your workflow.
