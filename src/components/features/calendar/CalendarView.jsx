import React, { useState, useEffect, useCallback } from 'react';
import {
    List, 
  ListItem, 
  ListItemText ,
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
  CircularProgress,
  Alert,
  Snackbar,
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
  Refresh,
} from '@mui/icons-material';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  parseISO,
} from 'date-fns';
import DashboardCard from '../../common/card/DashboardCard';
import EventModal from './EventModal';
import { calendarAPI } from '../../../services/apiService';
import useWebSocket from '../../../hooks/useWebSocket';

const CalendarView = ({ view = 'month', onViewChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // WebSocket for real-time updates
  const { sendMessage } = useWebSocket('ws://localhost:3001/calendar');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const startDate = startOfWeek(startOfMonth(currentDate));
      const endDate = endOfWeek(endOfMonth(currentDate));
      
      const data = await calendarAPI.getCalendarEvents(startDate, endDate);
      setEvents(data.map(event => ({
        ...event,
        date: parseISO(event.startDate),
        endDate: parseISO(event.endDate),
      })));
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
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

  const handleEventSave = async (eventData) => {
    try {
      if (eventData.id) {
        await calendarAPI.updateEvent(eventData.id, eventData);
        setSnackbar({ open: true, message: 'Event updated successfully', severity: 'success' });
        sendMessage({ type: 'EVENT_UPDATED', data: eventData });
      } else {
        const newEvent = await calendarAPI.createEvent(eventData);
        setEvents(prev => [...prev, { ...newEvent, date: parseISO(newEvent.startDate) }]);
        setSnackbar({ open: true, message: 'Event created successfully', severity: 'success' });
        sendMessage({ type: 'EVENT_CREATED', data: newEvent });
      }
      fetchEvents();
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to save event', severity: 'error' });
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      await calendarAPI.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setSnackbar({ open: true, message: 'Event deleted successfully', severity: 'success' });
      sendMessage({ type: 'EVENT_DELETED', data: { id: eventId } });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete event', severity: 'error' });
    }
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      isSameDay(event.date, date)
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
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
            const isSelected = isSameDay(selectedDate, day);
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
                          backgroundColor: event.color || '#4f46e5',
                          color: 'white',
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.9 },
                        }}
                      >
                        <Typography variant="caption" noWrap>
                          {format(event.date, 'HH:mm')} - {event.title}
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
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <Grid container spacing={2}>
        {weekDays.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentDay = isToday(day);
          const isSelected = isSameDay(selectedDate, day);

          return (
            <Grid item xs key={day.toString()}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: isSelected ? '2px solid' : '1px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  backgroundColor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} align="center">
                  {format(day, 'EEE')}
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  fontWeight={isCurrentDay ? 700 : 400}
                  sx={{
                    backgroundColor: isCurrentDay ? 'primary.main' : 'transparent',
                    color: isCurrentDay ? 'white' : 'inherit',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '8px auto',
                  }}
                >
                  {format(day, 'd')}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {dayEvents.map((event) => (
                    <Paper
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      sx={{
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: event.color || '#4f46e5',
                        color: 'white',
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 },
                      }}
                    >
                      <Typography variant="caption" noWrap>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {format(event.date, 'HH:mm')}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(selectedDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Typography>
        
        <Box sx={{ position: 'relative', height: 600, overflow: 'auto' }}>
          {hours.map((hour) => (
            <Box
              key={hour}
              sx={{
                display: 'flex',
                borderBottom: '1px solid',
                borderColor: 'divider',
                minHeight: 60,
              }}
            >
              <Box sx={{ width: 80, p: 1, borderRight: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" color="text.secondary">
                  {hour.toString().padStart(2, '0')}:00
                </Typography>
              </Box>
              <Box sx={{ flex: 1, p: 1, position: 'relative' }}>
                {dayEvents
                  .filter(event => new Date(event.date).getHours() === hour)
                  .map((event) => (
                    <Paper
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      sx={{
                        position: 'absolute',
                        left: 8,
                        right: 8,
                        p: 1,
                        backgroundColor: event.color || '#4f46e5',
                        color: 'white',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { opacity: 0.9 },
                      }}
                    >
                      <Typography variant="caption" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {format(event.date, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                      </Typography>
                    </Paper>
                  ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderAgendaView = () => {
    const upcomingEvents = events
      .filter(event => event.date >= selectedDate)
      .sort((a, b) => a.date - b.date)
      .slice(0, 10);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Upcoming Events
        </Typography>
        
        {upcomingEvents.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
            No upcoming events
          </Typography>
        ) : (
          <List dense>
            {upcomingEvents.map((event) => (
              <ListItem
                key={event.id}
                onClick={() => handleEventClick(event)}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  borderLeft: `4px solid ${event.color || '#4f46e5'}`,
                  backgroundColor: 'background.default',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(event.date, 'MMM d, yyyy HH:mm')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {event.description}
                      </Typography>
                      {event.attendees && (
                        <AvatarGroup max={3} sx={{ mt: 1 }}>
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
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
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
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Calendar Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePrevMonth} size="small" disabled={loading}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth} size="small" disabled={loading}>
            <ChevronRight />
          </IconButton>
          <Button
            size="small"
            startIcon={<Today />}
            onClick={handleToday}
            sx={{ ml: 2 }}
            disabled={loading}
          >
            Today
          </Button>
          <IconButton onClick={fetchEvents} disabled={loading} size="small">
            <Refresh />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {['month', 'week', 'day', 'agenda'].map((viewType) => (
            <Chip
              key={viewType}
              label={viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              variant={view === viewType ? 'filled' : 'outlined'}
              color={view === viewType ? 'primary' : 'default'}
              onClick={() => onViewChange && onViewChange(viewType)}
              size="small"
              disabled={loading}
            />
          ))}
          <IconButton size="small" disabled={loading}>
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar View */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
      {view === 'agenda' && renderAgendaView()}

      {/* Upcoming Events Sidebar */}
      {view !== 'agenda' && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Upcoming Events
          </Typography>
          {events
            .filter(event => event.date >= new Date())
            .sort((a, b) => a.date - b.date)
            .slice(0, 3)
            .map((event) => (
              <Paper
                key={event.id}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  borderLeft: `3px solid ${event.color || '#4f46e5'}`,
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
                      {format(event.date, 'MMM d')} • {format(event.date, 'HH:mm')} • {event.duration || '1h'}
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
      )}

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        date={selectedDate}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardCard>
  );
};

export default CalendarView;