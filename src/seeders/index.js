const seedWorkoutTemplates = require('./workoutTemplates');

const seedAll = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Seed workout templates
    await seedWorkoutTemplates();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
    process.exit(1);
  }
};

// Run the seeder
seedAll(); 