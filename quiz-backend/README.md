# Quiz Website Backend

Backend API for a simple Quiz/Exam platform, built as a graduation/summer-training
project. It supports two roles — **student** and **lecturer** — over a shared,
reusable question bank. No frontend is included; this is a REST API only.

## Project overview

- Lecturers create MCQ questions and quizzes, reusing questions from a shared
  question bank. Any brand-new question created while building a quiz is
  automatically added to that shared bank.
- Students browse quizzes, take a quiz (without seeing correct answers), and
  submit their answers to get an instant score.

## Technologies

- Node.js + Express.js (REST API)
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- `joi` for request validation
- `helmet` + `cors` for basic security
- `jest` + `supertest` + `mongodb-memory-server` for tests

## Architecture

```text
Controller -> Service -> Repository -> Model -> MongoDB
```

- **Controllers** parse the request and shape the response.
- **Services** contain business logic (e.g. "add new quiz questions to the bank").
- **Repositories** are the only layer that talks to Mongoose models, so services
  don't depend on Mongoose implementation details directly.
- **Models** define the Mongoose schemas.

```text
src/
├── config/          # env loading, database connection
├── controllers/      # auth, question, quiz
├── services/          # business logic
├── repositories/       # data access (Mongoose)
├── models/              # Mongoose schemas
├── routes/                # Express routers
├── middleware/              # auth, role, validation, error handling
├── validators/                # Joi schemas
├── utils/                       # AppError, catchAsync, JWT helpers
├── app.js                        # Express app (no listen/connect — testable)
└── server.js                      # connects to DB, then starts the server
```

## Requirements

- Node.js (v18+)
- npm
- MongoDB (local) or a MongoDB Atlas cluster

## Installation

```bash
git clone <your-repo-url>
cd quiz-website-backend
npm install
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/quiz_platform
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
```

`.env` is git-ignored and must never be committed.

## MongoDB connection

### Option 1: MongoDB Atlas

1. Create a free account at https://www.mongodb.com/cloud/atlas.
2. Create a cluster (the free tier is enough).
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, add your current IP address (or `0.0.0.0/0` for
   quick local development).
5. Click **Connect -> Drivers** and copy the connection string.
6. Put it into `.env`:

   ```env
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/quiz_platform
   ```

### Option 2: Local MongoDB

Install and run MongoDB locally (e.g. `mongod`), then use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/quiz_platform
```

Mongoose automatically creates the database and collections on first write —
no manual setup needed.

## Running the server

```bash
npm run dev     # nodemon, auto-restarts on changes
# or
npm start       # plain node
```

The server starts on `http://localhost:5000` (or your configured `PORT`).
Health check: `GET /health`.

## Authentication

1. Sign up or log in to get a JWT (`POST /api/auth/signup` or `/login`).
2. Send it on every protected request:

   ```http
   Authorization: Bearer <token>
   ```

The token payload contains `userId` and `role`. There is no email verification,
password reset, or refresh token — signup/login only.

## API documentation

All responses use a simple envelope:

- Success: `{ "data": ... }`
- Error: `{ "message": "..." }`

### `POST /api/auth/signup`

- Auth: none
- Body: `{ "username": string, "password": string, "role": "student" | "lecturer" }`
- Response `201`: `{ "data": { "user": {...}, "token": "..." } }`
- Errors: `400` invalid input, `409` username already exists

### `POST /api/auth/login`

- Auth: none
- Body: `{ "username": string, "password": string }`
- Response `200`: `{ "data": { "user": {...}, "token": "..." } }`
- Errors: `400` invalid input, `401` invalid credentials

### `GET /api/questions`

- Auth: required, role: `lecturer`
- Query: `?tag=java` (optional)
- Response `200`: `{ "data": [ { "_id", "statement", "choices", "correctAnswer", "tags", "createdBy" }, ... ] }`
- Errors: `401` unauthenticated, `403` wrong role

### `POST /api/questions`

- Auth: required, role: `lecturer`
- Body:
  ```json
  { "statement" : "", "choices": [], "correctAnswer": "", "tags": [], "createdBy": [] }`
  ```
- Errors: `401` unauthenticated, `403` wrong role


### `POST /api/quizzes`

- Auth: required, role: `lecturer`
- Body:

  ```json
  {
    "title": "Java Basics",
    "description": "Basic Java quiz",
    "questions": [
      { "questionId": "665..." },
      {
        "statement": "What is JVM?",
        "choices": ["Java Virtual Machine", "Java Variable Manager", "Java Visual Machine", "None"],
        "correctAnswer": "Java Virtual Machine",
        "tags": ["java", "jvm"]
      }
    ]
  }
  ```

- Response `201`: `{ "data": { "_id", "title", "description", "questions": [...ids], "createdBy" } }`
- Behavior: any entry without `questionId` is created and inserted into the
  shared question bank first, then referenced by the quiz.
- Errors: `400` invalid input, `401` unauthenticated, `403` wrong role, `404` referenced `questionId` not found

### `GET /api/quizzes`

- Auth: required (student or lecturer)
- Response `200`:

  ```json
  { "data": [ { "id": "...", "title": "Java Basics", "description": "...", "questionCount": 5, "createdBy": "lecturer1" } ] }
  ```

### `GET /api/quizzes/:quizId`

- Auth: required, role: `student`
- Response `200`: quiz with questions, **without** `correctAnswer`
- Errors: `400` invalid id, `401` unauthenticated, `403` wrong role, `404` quiz not found

### `POST /api/quizzes/:quizId/submit`

- Auth: required, role: `student`
- Body:

  ```json
  { "answers": [ { "questionId": "665...", "answer": "Programming language" } ] }
  ```

- Response `200`: `{ "data": { "quizId": "...", "score": 7, "totalQuestions": 10, "percentage": 70 } }`
- Errors: `400` invalid input or a `questionId` not belonging to the quiz, `401` unauthenticated, `403` wrong role, `404` quiz not found

### Common error codes

```text
400 -> invalid request
401 -> unauthenticated
403 -> authenticated but wrong role
404 -> resource not found
409 -> duplicate username
500 -> unexpected server error
```

## Example workflow

```text
1. Lecturer signs up               -> POST /api/auth/signup
2. Lecturer logs in                -> POST /api/auth/login
3. Lecturer gets a JWT
4. Lecturer browses question bank  -> GET /api/questions?tag=java
5. Lecturer creates a quiz         -> POST /api/quizzes
6. New questions in that quiz are automatically added to the question bank
7. Student signs up                -> POST /api/auth/signup
8. Student logs in                 -> POST /api/auth/login
9. Student gets a JWT
10. Student lists quizzes          -> GET /api/quizzes
11. Student picks a quiz by id
12. Student fetches it             -> GET /api/quizzes/:quizId (no answers included)
13. Student submits answers        -> POST /api/quizzes/:quizId/submit
14. Backend returns score, totalQuestions, and percentage
```
