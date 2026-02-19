import React, { useState } from 'react';
// Import Grid directly from @mui/material (v7 standard)
import { Container, Grid, Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';

// IMPORTANT: Ensure these files exist and have 'export default'
import CalendarView from '../components/features/calendar/CalendarView';
import MiniCalendar from '../components/features/calendar/MiniCalendar';
import EventModal from '../components/features/calendar/EventModal';

const CalendarPage = () => {
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      title: 'Team Standup',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: '9:00 AM',
      duration: '30m',
      color: '#4f46e5',
      description: 'Daily team sync',
    },
    {
      id: 2,
      title: 'Client Presentation',
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '2:00 PM',
      duration: '1h',
      color: '#10b981',
      description: 'Quarterly review presentation',
    }
  ];

  const handleViewChange = (newView) => setView(newView);
  const handleDateSelect = (date) => setSelectedDate(date);
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Calendar"
        subtitle="Manage your schedule and events"
        breadcrumbs={true}
        actions={[
          {
            label: 'New Event',
            onClick: () => setModalOpen(true),
            variant: 'contained',
          },
        ]}
      />

      {/* MUI v7: 'item' removed, using 'size' prop */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CalendarView
            view={view}
            onViewChange={handleViewChange}
            events={events}
            onEventClick={handleEventClick}
          />
        </Grid>
        
        <Grid size={{ xs: 12, lg: 3 }}>
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            events={events}
          />
          
          <Box sx={{ mt: 3 }}>
            {/* Ensure PageHeader is exported correctly */}
            <PageHeader
              title="Quick Stats"
              subtitle="This month"
              breadcrumbs={false}
            />
            {/* Stats content goes here */}
          </Box>
        </Grid>
      </Grid>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        event={selectedEvent}
        date={selectedDate}
      />
    </Container>
  );
};

export default CalendarPage;
