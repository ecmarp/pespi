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
3. Create a `.env` file in the root directory with the following variables (info in discord):
   ```
   DB_HOST=
   DB_PORT=
   DB_NAME=
   DB_USER=
   DB_PASSWORD=
   JWT_SECRET=
   ```
4. Initialize the database:
   ```
   npm run dev
   ```
5. Start the development server (front end):
   ```
   cd client
   npm start
   ```
