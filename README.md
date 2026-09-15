# Quiz Website

A web-based quiz platform that allows **students to take quizzes and view their results**, while **lecturers contribute questions and create quizzes by combining questions from the question bank**.

## Overview

The system provides two main types of users:

- **Student** — takes available quizzes and views quiz results.
- **Lecturer** — creates and manages questions, then combines questions into quizzes.

The goal of the platform is to provide a simple system for managing quizzes and assessing students online.

## How It Works

### Student

Students can:

1. Log in to their account.
2. View available quizzes.
3. Open and take a quiz.
4. Submit their answers.
5. View their quiz results.

```text
Student
   │
   ▼
 Login
   │
   ▼
 View Quizzes
   │
   ▼
 Take Quiz
   │
   ▼
 Submit Answers
   │
   ▼
 View Result
```

### Lecturer

Lecturers are responsible for building the quiz content.

They can:

1. Log in to their account.
2. Create and contribute questions to the question bank.
3. Manage their questions.
4. Select questions from the question bank.
5. Combine selected questions into a quiz.
6. Make the quiz available for students.

```text
Lecturer
   │
   ▼
 Login
   │
   ▼
 Create Questions
   │
   ▼
 Question Bank
   │
   ▼
 Select Questions
   │
   ▼
 Create Quiz
   │
   ▼
 Quiz Available to Students
```

## Main Features

### Authentication

- Student and lecturer login
- Role-based access
- Protected features based on user role

### Student Features

- View available quizzes
- Take quizzes
- Submit answers
- View quiz results

### Lecturer Features

- Create questions
- Manage contributed questions
- Build quizzes from existing questions
- Manage quizzes

### Quiz System

- Questions are stored in a question bank.
- Lecturers can reuse questions when creating quizzes.
- A quiz is composed of a collection of questions.
- Students answer the questions and submit their attempts.
- The system evaluates the answers and provides the result.

## System Flow

```text
                    ┌──────────────┐
                    │   Students   │
                    └──────┬───────┘
                           │
                        Take Quiz
                           │
                           ▼
                    ┌──────────────┐
                    │    Quizzes   │
                    └──────────────┘
                           ▲
                           │
                    Combine Questions
                           │
                    ┌──────┴───────┐
                    │   Lecturers  │
                    └──────┬───────┘
                           │
                    Create Questions
                           │
                           ▼
                    ┌──────────────┐
                    │Question Bank │
                    └──────────────┘
```

## Project Architecture

The project consists of a frontend and backend communicating through APIs.

```text
Frontend
   │
   ▼
Backend API
   │
   ▼
Database
```

The backend handles authentication, quiz management, question management, answer evaluation, and result processing, while the frontend provides the interface through which students and lecturers interact with the system.

## Technologies

- **Frontend:** React
- **Backend:** NodeJs
- **Database:** MongoDB
- **Authentication:** JWT

## Project Goal

The project aims to provide a simple and organized platform for **creating, managing, and taking quizzes**, connecting lecturers who create educational content with students who use that content for assessment.

## GitHub
- **Front-End:** https://github.com/emanyousef9369-wq/quiz-site-frontend
- **Back-End:** https://github.com/thomas1854/quiz-website-api
