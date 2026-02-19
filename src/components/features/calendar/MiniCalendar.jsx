import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Grid,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  Event,
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';

const MiniCalendar = ({ onDateSelect, selectedDate, events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect?.(today);
  };

  const handleDateClick = (date) => {
    onDateSelect?.(date);
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {format(currentDate, 'MMMM yyyy')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={handlePrevMonth}>
            <ChevronLeft fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleToday}>
            <Today fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleNextMonth}>
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Weekday Headers */}
      <Grid container spacing={0.5} sx={{ mb: 1 }}>
        {weekdays.map((day) => (
          <Grid item xs key={day} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={0.5}>
        {monthDays.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <Grid item xs key={day.toString()}>
              <Box
                onClick={() => handleDateClick(day)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                  cursor: 'pointer',
                  position: 'relative',
                  backgroundColor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  border: isCurrentDay ? '2px solid' : '1px solid',
                  borderColor: isCurrentDay ? 'primary.main' : isSelected ? 'primary.main' : 'transparent',
                  opacity: isCurrentMonth ? 1 : 0.4,
                  '&:hover': {
                    backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <Typography
                  variant="caption"
                  fontWeight={isCurrentDay || isSelected ? 700 : 400}
                >
                  {format(day, 'd')}
                </Typography>
                
                {dayEvents.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'primary.contrastText' : 'primary.main',
                    }}
                  />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Upcoming Events
          </Typography>
          {events.slice(0, 3).map((event) => (
            <Box
              key={event.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                mb: 1,
                borderRadius: 1,
                backgroundColor: 'background.default',
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: event.color,
                }}
              >
                <Event fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(event.date, 'MMM d')} • {event.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default MiniCalendar;