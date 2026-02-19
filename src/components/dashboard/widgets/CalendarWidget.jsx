import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Box,
  Typography
} from '@mui/material';
import {
  Add,
  Event,
  Today,
  Schedule
} from '@mui/icons-material';
import { format, addDays, isToday } from 'date-fns';

const CalendarWidget = () => {
  const [currentDate] = useState(new Date());

  const events = [
    {
      id: 1,
      title: 'Team Meeting',
      time: '10:00 AM',
      duration: '1h',
      color: '#4f46e5',
      attendees: 5
    },
    {
      id: 2,
      title: 'Client Call',
      time: '2:30 PM',
      duration: '30m',
      color: '#10b981',
      attendees: 3
    },
    {
      id: 3,
      title: 'Project Review',
      time: '4:00 PM',
      duration: '2h',
      color: '#f59e0b',
      attendees: 8
    }
  ];

  const upcomingDays = [0, 1, 2, 3, 4].map(offset => addDays(currentDate, offset));

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title="Calendar"
        action={
          <IconButton color="primary">
            <Add />
          </IconButton>
        }
        subheader={format(currentDate, 'MMMM yyyy')}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Mini Calendar Days */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          {upcomingDays.map((day, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 1,
                borderRadius: 2,
                backgroundColor: isToday(day) ? 'primary.main' : 'transparent',
                color: isToday(day) ? 'white' : 'text.primary',
                minWidth: 40
              }}
            >
              <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {format(day, 'd')}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Today's Events */}
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Today's Events
        </Typography>
        <List dense>
          {events.map((event) => (
            <ListItem
              key={event.id}
              sx={{
                mb: 1,
                borderRadius: 2,
                borderLeft: `3px solid ${event.color}`,
                backgroundColor: 'background.default'
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: event.color, width: 32, height: 32 }}>
                  <Event sx={{ fontSize: 16 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={event.title}
                // Optional: Safe if you ever put a Box in primary later
                primaryTypographyProps={{ component: 'div' }}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Schedule fontSize="small" sx={{ fontSize: 14 }} />
                    {/* Wrapped the text in a span for cleaner HTML nesting */}
                    <span>{event.time} • {event.duration}</span>
                  </Box>
                }
                // THE CRITICAL FIX: 
                secondaryTypographyProps={{ component: 'div' }}
              />

              <Chip
                label={`${event.attendees} people`}
                size="small"
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CalendarWidget;