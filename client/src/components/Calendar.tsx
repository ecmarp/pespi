import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  styled,
  Stack,
  Grid,
  Theme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Styled components
const CalendarDay = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  cursor: 'pointer',
  height: '80px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SelectedDay = styled(CalendarDay)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
}));

const Today = styled(CalendarDay)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
}));

const DayNumber = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const DayContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
});

const DayIndicator = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: theme.palette.secondary.main,
}));

// Add a styled component for empty cells
const EmptyCell = styled(Box)(({ theme }) => ({
  height: '80px',
  backgroundColor: 'transparent',
  width: '100%',
  // Remove all borders and any other visible styling
  border: 'none',
  boxShadow: 'none',
  '& > *': {
    visibility: 'hidden'
  }
}));

interface CalendarProps {
  onDaySelect: (date: Date) => void;
  selectedDate: Date | null;
  // Mock data for demonstration
  dayData?: {
    [key: string]: {
      hasWorkout: boolean;
      hasMeal: boolean;
      weight?: number;
      events?: { color: string }[];
    };
  };
}

const Calendar: React.FC<CalendarProps> = ({ 
  onDaySelect, 
  selectedDate,
  dayData = {} 
}) => {
  // Initialize with the first day of the current month
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(0);

  // Generate days for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    setFirstDayOfMonth(firstDay);
    
    // Get the number of days in the month
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    // Create an array of dates for the month
    const days = Array.from({ length: lastDay }, (_, i) => 
      new Date(year, month, i + 1)
    );
    
    setDaysInMonth(days);
  }, [currentDate]);

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Get data for a specific day
  const getDayData = (date: Date) => {
    const key = date.toISOString().split('T')[0];
    return dayData[key] || { hasWorkout: false, hasMeal: false };
  };

  // Generate empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null);

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={goToPreviousMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">{formatDate(currentDate)}</Typography>
        <IconButton onClick={goToNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Day headers */}
        <Grid container columns={7} spacing={1}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <Grid key={day} size={1}>
              <Typography variant="subtitle2" align="center">
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>
        
        {/* Calendar grid */}
        <Grid container columns={7} spacing={1}>
          {/* Empty cells for days before the first day of the month */}
          {emptyCells.map((_, index) => (
            <Grid key={`empty-${index}`} size={1}>
              <EmptyCell />
            </Grid>
          ))}
          
          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const dayData = getDayData(date);
            const DayComponent = isSelected(date) 
              ? SelectedDay 
              : isToday(date) 
                ? Today 
                : CalendarDay;
            
            return (
              <Grid key={date.toISOString()} size={1}>
                <DayComponent onClick={() => onDaySelect(date)}>
                  <DayNumber variant="body2">
                    {date.getDate()}
                  </DayNumber>
                  <DayContent>
                    {dayData.hasWorkout && (
                      <DayIndicator sx={{ backgroundColor: 'primary.main' }} />
                    )}
                    {dayData.hasMeal && (
                      <DayIndicator sx={{ backgroundColor: 'secondary.main' }} />
                    )}
                    {dayData.weight && (
                      <Typography variant="caption" color="textSecondary">
                        {dayData.weight} lbs
                      </Typography>
                    )}
                  </DayContent>
                </DayComponent>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

export default Calendar; 