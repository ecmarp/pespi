import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FitnessCenter as WorkoutIcon,
} from '@mui/icons-material';

interface WorkoutCategory {
  name: string;
  exercises: {
    name: string;
    caloriesPerRep: number;
    muscleGroup: string;
    description?: string;
  }[];
}

const workoutCategories: WorkoutCategory[] = [
  {
    name: 'Chest',
    exercises: [
      {
        name: 'Flat Barbell Bench Press',
        caloriesPerRep: 5,
        muscleGroup: 'Chest, Triceps, Shoulders',
        description: 'A compound exercise targeting the chest muscles, with secondary engagement of triceps and shoulders.'
      },
      {
        name: 'Incline Barbell Bench Press',
        caloriesPerRep: 4.5,
        muscleGroup: 'Upper Chest, Shoulders, Triceps',
        description: 'Targets the upper portion of the chest, with emphasis on the clavicular head.'
      },
      {
        name: 'Decline Barbell Bench Press',
        caloriesPerRep: 4.5,
        muscleGroup: 'Lower Chest, Triceps, Shoulders',
        description: 'Focuses on the lower portion of the chest muscles.'
      },
      {
        name: 'Dumbbell Flyes',
        caloriesPerRep: 3,
        muscleGroup: 'Chest, Shoulders',
        description: 'Isolation exercise that primarily targets the chest muscles.'
      },
      {
        name: 'Cable Flyes',
        caloriesPerRep: 3,
        muscleGroup: 'Chest, Shoulders',
        description: 'Provides constant tension throughout the movement, targeting chest muscles.'
      },
      {
        name: 'Push-Ups',
        caloriesPerRep: 2,
        muscleGroup: 'Chest, Triceps, Shoulders, Core',
        description: 'Bodyweight exercise that targets multiple muscle groups.'
      },
      {
        name: 'Dips',
        caloriesPerRep: 3,
        muscleGroup: 'Chest, Triceps, Shoulders',
        description: 'Compound exercise that can target chest when leaning forward.'
      },
    ],
  },
  {
    name: 'Back',
    exercises: [
      {
        name: 'Deadlifts',
        caloriesPerRep: 8,
        muscleGroup: 'Back, Hamstrings, Glutes, Core',
        description: 'Compound exercise that targets the entire posterior chain.'
      },
      {
        name: 'Barbell Rows',
        caloriesPerRep: 5,
        muscleGroup: 'Back, Biceps, Shoulders',
        description: 'Compound exercise targeting the middle and upper back.'
      },
      {
        name: 'Pull-Ups',
        caloriesPerRep: 4,
        muscleGroup: 'Back, Biceps, Shoulders',
        description: 'Bodyweight exercise that primarily targets the back muscles.'
      },
      {
        name: 'Lat Pulldowns',
        caloriesPerRep: 3.5,
        muscleGroup: 'Back, Biceps, Shoulders',
        description: 'Machine-based exercise targeting the latissimus dorsi.'
      },
      {
        name: 'T-Bar Rows',
        caloriesPerRep: 4.5,
        muscleGroup: 'Back, Biceps, Shoulders',
        description: 'Compound exercise targeting the middle back.'
      },
      {
        name: 'Face Pulls',
        caloriesPerRep: 2,
        muscleGroup: 'Upper Back, Rear Deltoids',
        description: 'Rehabilitation and prehab exercise for shoulder health.'
      },
      {
        name: 'Seated Cable Rows',
        caloriesPerRep: 3.5,
        muscleGroup: 'Back, Biceps, Shoulders',
        description: 'Machine-based exercise targeting the middle back.'
      },
    ],
  },
  {
    name: 'Biceps',
    exercises: [
      {
        name: 'Barbell Curls',
        caloriesPerRep: 3,
        muscleGroup: 'Biceps, Forearms',
        description: 'Compound exercise targeting the biceps brachii.'
      },
      {
        name: 'Dumbbell Curls',
        caloriesPerRep: 2.5,
        muscleGroup: 'Biceps, Forearms',
        description: 'Isolation exercise for the biceps.'
      },
      {
        name: 'Hammer Curls',
        caloriesPerRep: 2.5,
        muscleGroup: 'Biceps, Forearms',
        description: 'Targets the biceps with a neutral grip.'
      },
      {
        name: 'Preacher Curls',
        caloriesPerRep: 2,
        muscleGroup: 'Biceps, Forearms',
        description: 'Isolation exercise that prevents cheating.'
      },
      {
        name: 'Concentration Curls',
        caloriesPerRep: 2,
        muscleGroup: 'Biceps',
        description: 'Isolation exercise targeting the biceps peak.'
      },
      {
        name: 'Cable Curls',
        caloriesPerRep: 2.5,
        muscleGroup: 'Biceps, Forearms',
        description: 'Provides constant tension throughout the movement.'
      },
      {
        name: 'Chin-Ups',
        caloriesPerRep: 4,
        muscleGroup: 'Biceps, Back, Shoulders',
        description: 'Compound exercise with emphasis on biceps.'
      },
    ],
  },
  {
    name: 'Triceps',
    exercises: [
      {
        name: 'Close-Grip Bench Press',
        caloriesPerRep: 4,
        muscleGroup: 'Triceps, Chest, Shoulders',
        description: 'Compound exercise with emphasis on triceps.'
      },
      {
        name: 'Tricep Pushdowns',
        caloriesPerRep: 2.5,
        muscleGroup: 'Triceps',
        description: 'Isolation exercise targeting the triceps.'
      },
      {
        name: 'Skull Crushers',
        caloriesPerRep: 2.5,
        muscleGroup: 'Triceps',
        description: 'Isolation exercise targeting the long head of triceps.'
      },
      {
        name: 'Overhead Tricep Extensions',
        caloriesPerRep: 2.5,
        muscleGroup: 'Triceps',
        description: 'Isolation exercise targeting all heads of triceps.'
      },
      {
        name: 'Diamond Push-Ups',
        caloriesPerRep: 2,
        muscleGroup: 'Triceps, Chest, Shoulders',
        description: 'Bodyweight exercise with emphasis on triceps.'
      },
      {
        name: 'Dips',
        caloriesPerRep: 3,
        muscleGroup: 'Triceps, Chest, Shoulders',
        description: 'Compound exercise targeting triceps when keeping upright.'
      },
      {
        name: 'Rope Pushdowns',
        caloriesPerRep: 2.5,
        muscleGroup: 'Triceps',
        description: 'Isolation exercise with emphasis on the lateral head.'
      },
    ],
  },
  {
    name: 'Legs',
    exercises: [
      {
        name: 'Barbell Squats',
        caloriesPerRep: 7,
        muscleGroup: 'Quadriceps, Hamstrings, Glutes, Core',
        description: 'Compound exercise targeting the entire lower body.'
      },
      {
        name: 'Romanian Deadlifts',
        caloriesPerRep: 6,
        muscleGroup: 'Hamstrings, Glutes, Lower Back',
        description: 'Compound exercise targeting the posterior chain.'
      },
      {
        name: 'Leg Press',
        caloriesPerRep: 5,
        muscleGroup: 'Quadriceps, Hamstrings, Glutes',
        description: 'Machine-based compound exercise for legs.'
      },
      {
        name: 'Leg Extensions',
        caloriesPerRep: 3,
        muscleGroup: 'Quadriceps',
        description: 'Isolation exercise targeting the quadriceps.'
      },
      {
        name: 'Leg Curls',
        caloriesPerRep: 3,
        muscleGroup: 'Hamstrings',
        description: 'Isolation exercise targeting the hamstrings.'
      },
      {
        name: 'Calf Raises',
        caloriesPerRep: 2,
        muscleGroup: 'Calves',
        description: 'Isolation exercise targeting the calf muscles.'
      },
      {
        name: 'Lunges',
        caloriesPerRep: 3.5,
        muscleGroup: 'Quadriceps, Hamstrings, Glutes',
        description: 'Compound exercise targeting legs with emphasis on balance.'
      },
    ],
  },
];

const Workouts: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom component="div">
        Workouts
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ mb: 4 }}>
        Explore different exercises categorized by muscle groups. Click on a category to see available exercises.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
        {workoutCategories.map((category, index) => (
          <Accordion 
            key={category.name}
            sx={{
              mb: 2,
              borderRadius: '16px !important',
              '&:before': {
                display: 'none',
              },
              '& .MuiAccordionSummary-root': {
                borderRadius: '16px',
                '&.Mui-expanded': {
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                },
              },
              '& .MuiAccordionDetails-root': {
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
              },
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              '&.Mui-expanded': {
                margin: '0 0 16px 0',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
              aria-controls={`${category.name}-content`}
              id={`${category.name}-header`}
              sx={{
                backgroundColor: 'grey.800',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'grey.900',
                },
                '& .MuiAccordionSummary-content': {
                  m: 1,
                },
              }}
            >
              <Typography variant="h6">{category.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, backgroundColor: 'background.paper' }}>
              <List>
                {category.exercises.map((exercise) => (
                  <ListItem 
                    key={exercise.name} 
                    component="div"
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      transition: 'background-color 0.2s',
                      p: 2,
                    }}
                  >
                    <ListItemIcon>
                      <WorkoutIcon sx={{ color: 'grey.600' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={exercise.name}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {exercise.muscleGroup}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Calories per rep: {exercise.caloriesPerRep}
                          </Typography>
                          {exercise.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {exercise.description}
                            </Typography>
                          )}
                        </>
                      }
                      primaryTypographyProps={{
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        sx: { color: 'text.secondary' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default Workouts; 