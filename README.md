# PespiFitness

A comprehensive fitness and wellness tracking application that helps users monitor their workouts, nutrition, and overall health progress.

## Features

- User profile management
- Workout tracking and templates
- Nutrition and meal tracking
- Progress monitoring (weight, BMI, body fat)
- Trainer-client relationship management
- Daily activity logging (steps, sleep, hydration)
- Goal setting and tracking

## Tech Stack

- Backend: Node.js v20+ LTS
- Database: PostgreSQL 16+
- Additional Processing: Java 21 LTS
- Frontend: React with TypeScript

## Prerequisites

- Node.js v20+ LTS
- PostgreSQL 16+
- Java 21 LTS
- npm or yarn package manager

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pespifitness
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```
4. Initialize the database:
   ```bash
   npm run db:init
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
pespifitness/
├── src/
│   ├── server.js
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
└── package.json
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License. 