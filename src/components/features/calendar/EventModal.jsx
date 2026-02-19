import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Chip,
  AvatarGroup,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  ViewDay,
  ViewAgenda,
  Add,
  FilterList,
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import DashboardCard from '../../common/card/DashboardCard';
import EventModal from './EventModal';

const CalendarView = ({ view = 'month', onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '10:00 AM',
      duration: '1h',
      color: '#4f46e5',
      attendees: [{ name: 'John' }, { name: 'Sarah' }, { name: 'Mike' }],
    },
    {
      id: 2,
      title: 'Client Call',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '2:30 PM',
      duration: '30m',
      color: '#10b981',
      attendees: [{ name: 'Client' }, { name: 'John' }],
    },
    {
      id: 3,
      title: 'Project Review',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: '4:00 PM',
      duration: '2h',
      color: '#f59e0b',
      attendees: [{ name: 'Team' }],
    },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (date) => {
    return events.filter(event => 
      format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <DashboardCard
      title="Calendar"
      subtitle={format(currentDate, 'MMMM yyyy')}
      actions={[
        {
          label: 'Today',
          icon: <Today />,
          onClick: handleToday,
          variant: 'outlined',
        },
        {
          label: 'New Event',
          icon: <Add />,
          onClick: handleAddEvent,
          variant: 'contained',
        },
      ]}
      headerAction={false}
    >
      {/* Calendar Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePrevMonth} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
          <Button
            size="small"
            startIcon={<Today />}
            onClick={handleToday}
            sx={{ ml: 2 }}
          >
            Today
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {['month', 'week', 'day', 'agenda'].map((viewType) => (
            <Chip
              key={viewType}
              label={viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              icon={
                viewType === 'month' ? <ViewWeek /> :
                viewType === 'week' ? <ViewWeek /> :
                viewType === 'day' ? <ViewDay /> :
                <ViewAgenda />
              }
              variant={view === viewType ? 'filled' : 'outlined'}
              color={view === viewType ? 'primary' : 'default'}
              onClick={() => onViewChange && onViewChange(viewType)}
              size="small"
            />
          ))}
          <IconButton size="small">
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Month View */}
      {view === 'month' && (
        <>
          {/* Weekday Headers */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {weekdays.map((day) => (
              <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid */}
          <Grid container spacing={1}>
            {monthDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentDay = isToday(day);
              const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <Grid item xs key={day.toString()} sx={{ minHeight: 120 }}>
                  <Paper
                    elevation={isSelected ? 2 : 0}
                    onClick={() => handleDateClick(day)}
                    sx={{
                      p: 1,
                      height: '100%',
                      borderRadius: 2,
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'primary.main' : 'transparent',
                      color: isSelected ? 'primary.contrastText' : 'text.primary',
                      border: isCurrentDay ? '2px solid' : '1px solid',
                      borderColor: isCurrentDay ? 'primary.main' : 'divider',
                      opacity: isCurrentMonth ? 1 : 0.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: isSelected ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={isCurrentDay || isSelected ? 700 : 400}
                      >
                        {format(day, 'd')}
                      </Typography>
                      {dayEvents.length > 0 && (
                        <Chip
                          label={dayEvents.length}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: isSelected ? 'primary.light' : 'primary.main',
                            color: isSelected ? 'primary.contrastText' : 'white',
                          }}
                        />
                      )}
                    </Box>

                    {/* Events for the day */}
                    <Box sx={{ mt: 1 }}>
                      {dayEvents.slice(0, 2).map((event) => (
                        <Paper
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          sx={{
                            p: 0.5,
                            mb: 0.5,
                            borderRadius: 1,
                            backgroundColor: event.color,
                            color: 'white',
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.9 },
                          }}
                        >
                          <Typography variant="caption" noWrap>
                            {event.time} - {event.title}
                          </Typography>
                          {event.attendees && event.attendees.length > 0 && (
                            <AvatarGroup max={3} sx={{ mt: 0.5 }}>
                              {event.attendees.map((attendee, idx) => (
                                <Tooltip key={idx} title={attendee.name}>
                                  <Avatar
                                    sx={{ width: 16, height: 16, fontSize: '0.6rem' }}
                                  >
                                    {attendee.name.charAt(0)}
                                  </Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          )}
                        </Paper>
                      ))}
                      {dayEvents.length > 2 && (
                        <Typography variant="caption" color={isSelected ? 'primary.contrastText' : 'text.secondary'}>
                          +{dayEvents.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {/* Upcoming Events Sidebar */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Upcoming Events
        </Typography>
        {events.slice(0, 3).map((event) => (
          <Paper
            key={event.id}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 2,
              borderLeft: `3px solid ${event.color}`,
              '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' },
            }}
            onClick={() => handleEventClick(event)}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {event.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(event.date, 'MMM d')} • {event.time} • {event.duration}
                </Typography>
              </Box>
              {event.attendees && (
                <AvatarGroup max={3}>
                  {event.attendees.map((attendee, idx) => (
                    <Tooltip key={idx} title={attendee.name}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {attendee.name.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </AvatarGroup>
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        date={selectedDate}
      />
    </DashboardCard>
  );
};

export default CalendarView;