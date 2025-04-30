-- Insert sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, height, birth_date, gender)
VALUES
    ('john_doe', 'john@example.com', '$2a$10$example_hash', 'John', 'Doe', 180.5, '1990-05-15', 'M'),
    ('jane_smith', 'jane@example.com', '$2a$10$example_hash', 'Jane', 'Smith', 165.0, '1992-08-22', 'F'),
    ('mike_wilson', 'mike@example.com', '$2a$10$example_hash', 'Mike', 'Wilson', 175.0, '1988-03-10', 'M'),
    ('sarah_jones', 'sarah@example.com', '$2a$10$example_hash', 'Sarah', 'Jones', 170.0, '1995-11-30', 'F'),
    ('alex_brown', 'alex@example.com', '$2a$10$example_hash', 'Alex', 'Brown', 178.0, '1991-07-18', 'M');

-- Insert sample exercise templates
INSERT INTO exercise_templates (name, description, muscle_group, equipment_needed)
VALUES
    ('Push-ups', 'Basic bodyweight exercise for chest and triceps', 'Chest, Triceps', 'None'),
    ('Squats', 'Basic lower body exercise', 'Legs', 'None'),
    ('Pull-ups', 'Upper body pulling exercise', 'Back, Biceps', 'Pull-up bar'),
    ('Bench Press', 'Barbell chest exercise', 'Chest, Shoulders', 'Barbell, Bench'),
    ('Deadlift', 'Full body compound exercise', 'Back, Legs', 'Barbell');

-- Insert sample workout templates
INSERT INTO workout_templates (name, description, difficulty, estimated_duration)
VALUES
    ('Full Body Workout', 'Complete body workout for beginners', 'Beginner', 60),
    ('Upper Body Focus', 'Upper body strength workout', 'Intermediate', 45),
    ('Lower Body Power', 'Lower body strength and power', 'Advanced', 50),
    ('HIIT Cardio', 'High-intensity interval training', 'Intermediate', 30),
    ('Core Strength', 'Core and abs focused workout', 'Beginner', 40);

-- Insert sample workouts
INSERT INTO workouts (user_id, template_id, name, date, duration, calories_burned, notes)
VALUES
    (1, 1, 'Morning Full Body', '2024-03-01', 65, 450, 'Great workout!'),
    (1, 2, 'Upper Body Session', '2024-03-03', 50, 350, 'Felt strong today'),
    (2, 3, 'Leg Day', '2024-03-02', 55, 500, 'Challenging but good'),
    (3, 4, 'HIIT Session', '2024-03-01', 35, 400, 'Sweaty workout'),
    (4, 5, 'Core Workout', '2024-03-04', 45, 300, 'Need to increase intensity');

-- Insert sample exercises
INSERT INTO exercises (workout_id, template_id, name, sets, reps, weight, notes)
VALUES
    (1, 1, 'Push-ups', 3, 12, NULL, 'Good form'),
    (1, 2, 'Squats', 4, 15, NULL, 'Increased reps'),
    (2, 3, 'Pull-ups', 3, 8, NULL, 'Need improvement'),
    (2, 4, 'Bench Press', 4, 10, 135.0, 'New PR'),
    (3, 5, 'Deadlift', 5, 5, 225.0, 'Heavy but manageable');

-- Insert sample meals
INSERT INTO meals (user_id, name, date, time, total_calories, notes)
VALUES
    (1, 'Breakfast', '2024-03-01', '08:00:00', 450, 'Pre-workout meal'),
    (1, 'Lunch', '2024-03-01', '12:30:00', 650, 'Post-workout meal'),
    (2, 'Dinner', '2024-03-01', '19:00:00', 550, 'Healthy dinner'),
    (3, 'Breakfast', '2024-03-02', '07:30:00', 400, 'Quick breakfast'),
    (4, 'Lunch', '2024-03-02', '13:00:00', 600, 'Business lunch');

-- Insert sample meal items
INSERT INTO meal_items (meal_id, name, calories, protein, carbs, fat, serving_size)
VALUES
    (1, 'Oatmeal', 150, 5.0, 27.0, 3.0, '1 cup'),
    (1, 'Banana', 100, 1.0, 25.0, 0.0, '1 medium'),
    (2, 'Chicken Salad', 350, 30.0, 15.0, 18.0, '1 bowl'),
    (3, 'Salmon', 300, 34.0, 0.0, 18.0, '6 oz'),
    (4, 'Greek Yogurt', 200, 20.0, 10.0, 8.0, '1 cup');

-- Insert sample weight logs
INSERT INTO weight_logs (user_id, weight, date, notes)
VALUES
    (1, 180.5, '2024-03-01', 'Morning weight'),
    (1, 179.8, '2024-03-08', 'After week of training'),
    (2, 165.0, '2024-03-01', 'Starting weight'),
    (3, 175.0, '2024-03-01', 'Baseline weight'),
    (4, 170.0, '2024-03-01', 'Initial measurement');

-- Insert sample workout exercises (for templates)
INSERT INTO workout_exercises (workout_template_id, exercise_template_id, sets, reps, order_index)
VALUES
    (1, 1, 3, 12, 1),
    (1, 2, 4, 15, 2),
    (2, 3, 3, 10, 1),
    (2, 4, 4, 8, 2),
    (3, 5, 5, 5, 1);