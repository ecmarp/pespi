-- Pespi Database Assignment Questions
-- This file contains SQL queries, procedures, and views that exist in the web application
-- but are not explicitly defined in the database schema file

-- =============================================
-- 1. COMPLEX QUERIES WITH JOINS
-- =============================================

-- Query 1: Get user's workout history with workout template details
-- This query joins UserWorkouts with WorkoutTemplates to get complete workout information
SELECT 
    uw.user_workout_id,
    uw.user_id,
    uw.log_date,
    uw.sets,
    uw.reps,
    uw.duration_min,
    uw.calories_burned,
    uw.workout_date,
    uw.notes,
    wt.exercise_name,
    wt.exercise_type,
    wt.muscle_group,
    wt.difficulty_level
FROM "UserWorkouts" uw
JOIN "WorkoutTemplates" wt ON uw.workout_id = wt.workout_id
WHERE uw.user_id = :user_id
ORDER BY uw.workout_date DESC;

-- Query 2: Get nutrition summary for a date range
-- This query aggregates meal tracking data to provide nutrition summaries
SELECT 
    mt.user_id,
    mt.log_date,
    SUM(mt.calories) AS total_calories,
    SUM(mt.protein) AS total_protein,
    SUM(mt.carbs) AS total_carbs,
    SUM(mt.fats) AS total_fats,
    COUNT(mt.meal_id) AS meal_count
FROM "MealTrackings" mt
WHERE mt.user_id = :user_id
AND mt.log_date BETWEEN :start_date AND :end_date
GROUP BY mt.user_id, mt.log_date
ORDER BY mt.log_date DESC;

-- Query 3: Get workout statistics by muscle group
-- This query joins UserWorkouts with WorkoutTemplates and aggregates by muscle group
SELECT 
    wt.muscle_group,
    COUNT(uw.user_workout_id) AS workout_count,
    SUM(uw.calories_burned) AS total_calories_burned,
    AVG(uw.duration_min) AS avg_duration
FROM "UserWorkouts" uw
JOIN "WorkoutTemplates" wt ON uw.workout_id = wt.workout_id
WHERE uw.user_id = :user_id
GROUP BY wt.muscle_group
ORDER BY workout_count DESC;

-- =============================================
-- 2. QUERIES WITH AGGREGATIONS
-- =============================================

-- Query 4: Get average daily calories for the last 7 days
SELECT 
    log_date,
    SUM(calories) AS total_calories
FROM "MealTrackings"
WHERE user_id = :user_id
AND log_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY log_date
ORDER BY log_date DESC;

-- Query 5: Get average macronutrient distribution
SELECT 
    AVG(protein) AS avg_protein,
    AVG(carbs) AS avg_carbs,
    AVG(fats) AS avg_fats
FROM "MealTrackings"
WHERE user_id = :user_id
AND log_date >= CURRENT_DATE - INTERVAL '7 days';

-- =============================================
-- 3. QUERIES USING VIEWS
-- =============================================

-- Query 6: Using the user_workout_summary view
SELECT * FROM user_workout_summary
WHERE user_id = :user_id;

-- Query 7: Using the nutrition_summary view
SELECT * FROM nutrition_summary
WHERE user_id = :user_id
AND date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;

-- =============================================
-- 4. QUERIES WITH SUBQUERIES
-- =============================================

-- Query 8: Find users who have completed more workouts than the average
SELECT 
    u.user_id,
    u.name,
    COUNT(uw.user_workout_id) AS workout_count
FROM "Users" u
JOIN "UserWorkouts" uw ON u.user_id = uw.user_id
GROUP BY u.user_id, u.name
HAVING COUNT(uw.user_workout_id) > (
    SELECT AVG(workout_count)
    FROM (
        SELECT COUNT(*) AS workout_count
        FROM "UserWorkouts"
        GROUP BY user_id
    ) AS workout_counts
)
ORDER BY workout_count DESC;

-- Query 9: Find workouts with calories burned higher than the user's average
SELECT 
    uw.user_workout_id,
    uw.workout_date,
    uw.calories_burned,
    wt.exercise_name
FROM "UserWorkouts" uw
JOIN "WorkoutTemplates" wt ON uw.workout_id = wt.workout_id
WHERE uw.user_id = :user_id
AND uw.calories_burned > (
    SELECT AVG(calories_burned)
    FROM "UserWorkouts"
    WHERE user_id = :user_id
)
ORDER BY uw.calories_burned DESC;

-- =============================================
-- 5. STORED PROCEDURES
-- =============================================

-- Procedure 1: Calculate user's BMI and update weight tracking
CREATE OR REPLACE PROCEDURE update_user_bmi(
    p_user_id INTEGER,
    p_weight NUMERIC,
    p_height NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_bmi NUMERIC;
BEGIN
    -- Calculate BMI: weight (kg) / height (m)²
    v_bmi := p_weight / (p_height * p_height);
    
    -- Insert new weight tracking record with calculated BMI
    INSERT INTO "WeightTrackings" (
        user_id, 
        recorded_at, 
        weight, 
        bmi, 
        "createdAt", 
        "updatedAt"
    )
    VALUES (
        p_user_id,
        CURRENT_TIMESTAMP,
        p_weight,
        v_bmi,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
    
    -- Update user's height if needed
    UPDATE "Users"
    SET user_height = p_height
    WHERE user_id = p_user_id;
END;
$$;

-- Procedure 2: Generate weekly fitness report
CREATE OR REPLACE PROCEDURE generate_weekly_report(
    p_user_id INTEGER,
    p_start_date DATE
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_end_date DATE;
    v_total_workouts INTEGER;
    v_total_calories_burned NUMERIC;
    v_avg_daily_calories NUMERIC;
    v_weight_change NUMERIC;
    v_start_weight NUMERIC;
    v_end_weight NUMERIC;
BEGIN
    -- Calculate end date (7 days after start date)
    v_end_date := p_start_date + INTERVAL '7 days';
    
    -- Get workout statistics
    SELECT 
        COUNT(*),
        COALESCE(SUM(calories_burned), 0)
    INTO 
        v_total_workouts,
        v_total_calories_burned
    FROM "UserWorkouts"
    WHERE user_id = p_user_id
    AND workout_date >= p_start_date
    AND workout_date < v_end_date;
    
    -- Get calorie intake statistics
    SELECT COALESCE(AVG(daily_calories), 0)
    INTO v_avg_daily_calories
    FROM (
        SELECT log_date, SUM(calories) AS daily_calories
        FROM "MealTrackings"
        WHERE user_id = p_user_id
        AND log_date >= p_start_date
        AND log_date < v_end_date
        GROUP BY log_date
    ) AS daily_totals;
    
    -- Get weight change
    SELECT weight INTO v_start_weight
    FROM "WeightTrackings"
    WHERE user_id = p_user_id
    AND recorded_at <= p_start_date
    ORDER BY recorded_at DESC
    LIMIT 1;
    
    SELECT weight INTO v_end_weight
    FROM "WeightTrackings"
    WHERE user_id = p_user_id
    AND recorded_at <= v_end_date
    ORDER BY recorded_at DESC
    LIMIT 1;
    
    v_weight_change := COALESCE(v_end_weight, 0) - COALESCE(v_start_weight, 0);
    
    -- Output the report (in a real application, this would be returned or stored)
    RAISE NOTICE 'Weekly Fitness Report for User %', p_user_id;
    RAISE NOTICE 'Period: % to %', p_start_date, v_end_date - INTERVAL '1 day';
    RAISE NOTICE 'Total Workouts: %', v_total_workouts;
    RAISE NOTICE 'Total Calories Burned: %', v_total_calories_burned;
    RAISE NOTICE 'Average Daily Calorie Intake: %', v_avg_daily_calories;
    RAISE NOTICE 'Weight Change: % lbs', v_weight_change;
END;
$$;

-- =============================================
-- 6. VIEWS
-- =============================================

-- View 1: User Workout Summary
CREATE OR REPLACE VIEW user_workout_summary AS
SELECT 
    u.user_id,
    u.name AS username,
    COUNT(uw.user_workout_id) AS total_workouts,
    AVG(uw.duration_min) AS avg_duration,
    SUM(uw.calories_burned) AS total_calories_burned,
    MAX(uw.workout_date) AS last_workout_date
FROM "Users" u
LEFT JOIN "UserWorkouts" uw ON u.user_id = uw.user_id
GROUP BY u.user_id, u.name;

-- View 2: Exercise Progress
CREATE OR REPLACE VIEW exercise_progress AS
SELECT 
    uw.user_workout_id AS exercise_id,
    wt.exercise_name,
    u.name AS username,
    uw.workout_date AS date,
    uw.sets,
    uw.reps,
    uw.calories_burned AS weight,
    LAG(uw.calories_burned) OVER (PARTITION BY wt.exercise_name ORDER BY uw.workout_date) AS previous_weight
FROM "UserWorkouts" uw
JOIN "WorkoutTemplates" wt ON uw.workout_id = wt.workout_id
JOIN "Users" u ON uw.user_id = u.user_id;

-- View 3: Nutrition Summary
CREATE OR REPLACE VIEW nutrition_summary AS
SELECT 
    mt.user_id,
    u.name AS username,
    mt.log_date AS date,
    SUM(mt.calories) AS daily_calories,
    COUNT(mt.meal_id) AS meals_count,
    AVG(mt.protein) AS avg_protein,
    AVG(mt.carbs) AS avg_carbs,
    AVG(mt.fats) AS avg_fat
FROM "MealTrackings" mt
JOIN "Users" u ON mt.user_id = u.user_id
GROUP BY mt.user_id, u.name, mt.log_date;

-- View 4: Weight Progress
CREATE OR REPLACE VIEW weight_progress AS
SELECT 
    wt.user_id,
    u.name AS username,
    wt.recorded_at AS date,
    wt.weight,
    LAG(wt.weight) OVER (PARTITION BY wt.user_id ORDER BY wt.recorded_at) AS previous_weight,
    wt.weight - LAG(wt.weight) OVER (PARTITION BY wt.user_id ORDER BY wt.recorded_at) AS weight_change
FROM "WeightTrackings" wt
JOIN "Users" u ON wt.user_id = u.user_id;

-- =============================================
-- 7. TRIGGERS
-- =============================================

-- Trigger 1: Update total calories in meals table when meal items are added/updated/deleted
CREATE OR REPLACE FUNCTION update_meal_calories()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE "MealTrackings"
        SET calories = (
            SELECT COALESCE(SUM(calories), 0)
            FROM "MealTrackings"
            WHERE user_id = NEW.user_id
            AND log_date = NEW.log_date
        )
        WHERE user_id = NEW.user_id
        AND log_date = NEW.log_date;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE "MealTrackings"
        SET calories = (
            SELECT COALESCE(SUM(calories), 0)
            FROM "MealTrackings"
            WHERE user_id = OLD.user_id
            AND log_date = OLD.log_date
        )
        WHERE user_id = OLD.user_id
        AND log_date = OLD.log_date;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meal_calories_trigger
AFTER INSERT OR UPDATE OR DELETE ON "MealTrackings"
FOR EACH ROW
EXECUTE FUNCTION update_meal_calories();

-- Trigger 2: Prevent negative weights in weight logs
CREATE OR REPLACE FUNCTION prevent_negative_weight()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.weight <= 0 THEN
        RAISE EXCEPTION 'Weight cannot be negative or zero';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_negative_weight_trigger
BEFORE INSERT OR UPDATE ON "WeightTrackings"
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_weight();

-- Trigger 3: Update workout duration based on exercises
CREATE OR REPLACE FUNCTION update_workout_duration()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "UserWorkouts"
    SET duration_min = (
        SELECT COUNT(*) * 5  -- Assuming 5 minutes per exercise
        FROM "UserWorkouts"
        WHERE user_id = NEW.user_id
        AND workout_date = NEW.workout_date
    )
    WHERE user_id = NEW.user_id
    AND workout_date = NEW.workout_date;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workout_duration_trigger
AFTER INSERT OR UPDATE OR DELETE ON "UserWorkouts"
FOR EACH ROW
EXECUTE FUNCTION update_workout_duration();

-- Trigger 4: Validate exercise template data
CREATE OR REPLACE FUNCTION validate_exercise_template()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.exercise_name IS NULL OR TRIM(NEW.exercise_name) = '' THEN
        RAISE EXCEPTION 'Exercise name cannot be empty';
    END IF;
    
    IF NEW.muscle_group IS NULL OR TRIM(NEW.muscle_group) = '' THEN
        RAISE EXCEPTION 'Muscle group cannot be empty';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_exercise_template_trigger
BEFORE INSERT OR UPDATE ON "WorkoutTemplates"
FOR EACH ROW
EXECUTE FUNCTION validate_exercise_template(); 