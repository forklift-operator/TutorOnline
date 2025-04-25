# TutorOnline

**TutorOnline** is an online tutoring platform designed to connect students with qualified tutors for personalized learning experiences. This project aims to provide a seamless, interactive, and efficient way for learners to get academic help in various subjects.

The app is still in development so many features are missing but i'm working on that.

## Features

- **User Authentication** – Secure sign-up/login for students and tutors
- **Tutor Search & Filtering** – Find tutors by subject, availability, ratings (in progress)
- **Live Sessions** – Real-time video/chat tutoring with screen-sharing (no screen sharing at the moment)
- **Reviews & Ratings** – Students can rate and review tutors
- **Admin Dashboard** – Manage users, sessions, and platform analytics (just user managment for now)

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT
- **Real-time**: Socket.io, WebRTC, PeerJS

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm/yarn

## How to run
1. Install dependencies:
```
sh
npm install
# or
yarn install
```

2. Set up environment variables:
```
sh
cp .env.example .env
# Then edit .env with your credentials
```

3. Run the application:
```
sh
npm start
# or
yarn start
```

4. Access the app:

Frontend: http://localhost:5173
Backend: http://localhost:8080
