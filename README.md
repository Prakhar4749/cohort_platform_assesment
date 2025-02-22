# Cohort platform Backend API

A Node.js backend application for the Hiking Camp platform built with Express.js and MongoDB.

## Project Structure
```
backend/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Custom middleware
│   ├── models/        # MongoDB/Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── app.js         # Application entry point
├── .env               # Environment variables
├── .gitignore
├── package.json
└── package-lock.json
```

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

## API Security

- JWT based authentication
- Request validation using Joi
- HTTP security headers with Helmet
- CORS enabled
- Password hashing with bcryptjs

## Dependencies

- bcryptjs: Password hashing
- cors: Cross-Origin Resource Sharing
- dotenv: Environment variables
- express: Web framework
- jsonwebtoken: JWT authentication
- mongoose: MongoDB ODM


## Deployment

The application is configured for deployment on Vercel.

---
