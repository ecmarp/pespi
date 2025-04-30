-- Views

-- 1. User Workout Summary View
CREATE OR REPLACE VIEW user_workout_summary AS
SELECT 
    u.user_id,
    u.username,
    COUNT(w.workout_id) as total_workouts,
    AVG(w.duration) as avg_duration,
    SUM(w.calories_burned) as total_calories_burned,
    MAX(w.date) as last_workout_date
FROM users u
LEFT JOIN workouts w ON u.user_id = w.user_id
GROUP BY u.user_id, u.username;

-- 2. Exercise Progress View
CREATE OR REPLACE VIEW exercise_progress AS
SELECT 
    e.exercise_id,
    et.name as exercise_name,
    u.username,
    e.date,
    e.sets,
    e.reps,
    e.weight,
    LAG(e.weight) OVER (PARTITION BY e.exercise_id ORDER BY e.date) as previous_weight
FROM exercises e
JOIN exercise_templates et ON e.template_id = et.template_id
JOIN workouts w ON e.workout_id = w.workout_id
JOIN users u ON w.user_id = u.user_id;

-- 3. Nutrition Summary View
CREATE OR REPLACE VIEW nutrition_summary AS
SELECT 
    m.user_id,
    u.username,
    m.date,
    SUM(m.total_calories) as daily_calories,
    COUNT(m.meal_id) as meals_count,
    AVG(mi.protein) as avg_protein,
    AVG(mi.carbs) as avg_carbs,
    AVG(mi.fat) as avg_fat
FROM meals m
JOIN users u ON m.user_id = u.user_id
JOIN meal_items mi ON m.meal_id = mi.meal_id
GROUP BY m.user_id, u.username, m.date;

-- 4. Weight Progress View
CREATE OR REPLACE VIEW weight_progress AS
SELECT 
    wl.user_id,
    u.username,
    wl.date,
    wl.weight,
    LAG(wl.weight) OVER (PARTITION BY wl.user_id ORDER BY wl.date) as previous_weight,
    wl.weight - LAG(wl.weight) OVER (PARTITION BY wl.user_id ORDER BY wl.date) as weight_change
FROM weight_logs wl
JOIN users u ON wl.user_id = u.user_id;

-- Triggers

-- 1. Update total calories in meals table when meal items are added/updated/deleted
CREATE OR REPLACE FUNCTION update_meal_calories()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE meals
        SET total_calories = (
            SELECT COALESCE(SUM(calories), 0)
            FROM meal_items
            WHERE meal_id = NEW.meal_id
        )
        WHERE meal_id = NEW.meal_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE meals
        SET total_calories = (
            SELECT COALESCE(SUM(calories), 0)
            FROM meal_items
            WHERE meal_id = OLD.meal_id
        )
        WHERE meal_id = OLD.meal_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meal_calories_trigger
AFTER INSERT OR UPDATE OR DELETE ON meal_items
FOR EACH ROW
EXECUTE FUNCTION update_meal_calories();

-- 2. Prevent negative weights in weight logs
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
BEFORE INSERT OR UPDATE ON weight_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_weight();

-- 3. Update workout duration based on exercises
CREATE OR REPLACE FUNCTION update_workout_duration()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE workouts
    SET duration = (
        SELECT COUNT(*) * 5  -- Assuming 5 minutes per exercise
        FROM exercises
        WHERE workout_id = NEW.workout_id
    )
    WHERE workout_id = NEW.workout_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workout_duration_trigger
AFTER INSERT OR UPDATE OR DELETE ON exercises
FOR EACH ROW
EXECUTE FUNCTION update_workout_duration();

-- 4. Validate exercise template data
CREATE OR REPLACE FUNCTION validate_exercise_template()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.name IS NULL OR TRIM(NEW.name) = '' THEN
        RAISE EXCEPTION 'Exercise name cannot be empty';
    END IF;
    
    IF NEW.muscle_group IS NULL OR TRIM(NEW.muscle_group) = '' THEN
        RAISE EXCEPTION 'Muscle group cannot be empty';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_exercise_template_trigger
BEFORE INSERT OR UPDATE ON exercise_templates
FOR EACH ROW
EXECUTE FUNCTION validate_exercise_template();