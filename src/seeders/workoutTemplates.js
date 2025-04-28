const { WorkoutTemplate } = require('../models');

const workoutTemplates = [
  // Chest exercises
  {
    exercise_name: 'Flat Barbell Bench Press',
    exercise_type: 'strength',
    default_calories: 5,
    avg_duration_min: 45,
    muscle_group: 'Chest',
    description: 'A compound exercise targeting the chest muscles, with secondary engagement of triceps and shoulders.',
    difficulty_level: 'intermediate'
  },
  {
    exercise_name: 'Incline Barbell Bench Press',
    exercise_type: 'strength',
    default_calories: 4.5,
    avg_duration_min: 45,
    muscle_group: 'Chest',
    description: 'Targets the upper portion of the chest, with emphasis on the clavicular head.',
    difficulty_level: 'intermediate'
  },
  {
    exercise_name: 'Push-Ups',
    exercise_type: 'bodyweight',
    default_calories: 2,
    avg_duration_min: 15,
    muscle_group: 'Chest',
    description: 'Bodyweight exercise that targets multiple muscle groups.',
    difficulty_level: 'beginner'
  },

  // Back exercises
  {
    exercise_name: 'Deadlifts',
    exercise_type: 'strength',
    default_calories: 8,
    avg_duration_min: 60,
    muscle_group: 'Back',
    description: 'Compound exercise that targets the entire posterior chain.',
    difficulty_level: 'advanced'
  },
  {
    exercise_name: 'Pull-Ups',
    exercise_type: 'bodyweight',
    default_calories: 4,
    avg_duration_min: 30,
    muscle_group: 'Back',
    description: 'Bodyweight exercise that primarily targets the back muscles.',
    difficulty_level: 'intermediate'
  },

  // Biceps exercises
  {
    exercise_name: 'Barbell Curls',
    exercise_type: 'strength',
    default_calories: 3,
    avg_duration_min: 30,
    muscle_group: 'Biceps',
    description: 'Compound exercise targeting the biceps brachii.',
    difficulty_level: 'beginner'
  },
  {
    exercise_name: 'Dumbbell Curls',
    exercise_type: 'strength',
    default_calories: 2.5,
    avg_duration_min: 30,
    muscle_group: 'Biceps',
    description: 'Isolation exercise for the biceps.',
    difficulty_level: 'beginner'
  },

  // Triceps exercises
  {
    exercise_name: 'Tricep Pushdowns',
    exercise_type: 'strength',
    default_calories: 2.5,
    avg_duration_min: 30,
    muscle_group: 'Triceps',
    description: 'Isolation exercise targeting the triceps.',
    difficulty_level: 'beginner'
  },
  {
    exercise_name: 'Diamond Push-Ups',
    exercise_type: 'bodyweight',
    default_calories: 2,
    avg_duration_min: 15,
    muscle_group: 'Triceps',
    description: 'Bodyweight exercise with emphasis on triceps.',
    difficulty_level: 'intermediate'
  },

  // Legs exercises
  {
    exercise_name: 'Barbell Squats',
    exercise_type: 'strength',
    default_calories: 7,
    avg_duration_min: 60,
    muscle_group: 'Legs',
    description: 'Compound exercise targeting the entire lower body.',
    difficulty_level: 'intermediate'
  },
  {
    exercise_name: 'Leg Press',
    exercise_type: 'strength',
    default_calories: 5,
    avg_duration_min: 45,
    muscle_group: 'Legs',
    description: 'Machine-based compound exercise for legs.',
    difficulty_level: 'beginner'
  },
  {
    exercise_name: 'Calf Raises',
    exercise_type: 'strength',
    default_calories: 2,
    avg_duration_min: 20,
    muscle_group: 'Legs',
    description: 'Isolation exercise targeting the calf muscles.',
    difficulty_level: 'beginner'
  }
];

const seedWorkoutTemplates = async () => {
  try {
    // Clear existing templates
    await WorkoutTemplate.destroy({ where: {} });

    // Insert new templates
    await WorkoutTemplate.bulkCreate(workoutTemplates);

    console.log('Workout templates seeded successfully');
  } catch (error) {
    console.error('Error seeding workout templates:', error);
  }
};

module.exports = seedWorkoutTemplates; 