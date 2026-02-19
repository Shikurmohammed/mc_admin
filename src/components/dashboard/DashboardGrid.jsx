import React, { useState } from 'react';
import { Grid, Box, Paper, IconButton, Typography } from '@mui/material';
import { DragIndicator, Close } from '@mui/icons-material';
import { useDashboard } from '../../context/DashboardContext';
import ChartWidget from './widgets/ChartWidget';
import CalendarWidget from './widgets/CalendarWidget';
import StatsWidget from './widgets/StatsWidget';
import RecentActivity from './widgets/RecentActivity';
import StatCard from '../common/card/StatCard';

const DashboardGrid = () => {
  const { widgets, moveWidget, removeWidget, setIsDragging } = useDashboard();
  const [draggedWidget, setDraggedWidget] = useState(null);

  const handleDragStart = (e, widgetId) => {
    setDraggedWidget(widgetId);
    setIsDragging(true);
    e.dataTransfer.setData('widgetId', widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetWidgetId) => {
    e.preventDefault();
    if (draggedWidget && draggedWidget !== targetWidgetId) {
      moveWidget(draggedWidget, targetWidgetId);
    }
    setDraggedWidget(null);
    setIsDragging(false);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setIsDragging(false);
  };

  const getWidgetComponent = (widget) => {
    const commonProps = {
      key: widget.id,
      item: true,
      draggable: true,
      onDragStart: (e) => handleDragStart(e, widget.id),
      onDragOver: handleDragOver,
      onDrop: (e) => handleDrop(e, widget.id),
      onDragEnd: handleDragEnd,
      xs: widget.size === 'large' ? 12 : widget.size === 'medium' ? 6 : 3,
    };

    switch (widget.type) {
      case 'chart':
        return (
          <Grid {...commonProps} md={8} lg={9}>
            <DraggableCard
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
            >
              <ChartWidget title="Revenue Overview" height={350} />
            </DraggableCard>
          </Grid>
        );
      case 'calendar':
        return (
          <Grid {...commonProps} md={4} lg={3}>
            <DraggableCard
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
            >
              <CalendarWidget />
            </DraggableCard>
          </Grid>
        );
      case 'stats':
        return (
          <Grid {...commonProps} md={6}>
            <DraggableCard
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
            >
              <StatsWidget />
            </DraggableCard>
          </Grid>
        );
      case 'activity':
        return (
          <Grid {...commonProps} md={6}>
            <DraggableCard
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
            >
              <RecentActivity />
            </DraggableCard>
          </Grid>
        );
      case 'stat':
        return (
          <Grid {...commonProps} sm={6} md={3}>
            <DraggableCard
              title={widget.title}
              onRemove={() => removeWidget(widget.id)}
              compact
            >
              <StatCard
                title={widget.title}
                value={widget.value}
                change="+12.5%"
                icon="TrendingUp"
              />
            </DraggableCard>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3}>
      {widgets.map(widget => getWidgetComponent(widget))}
    </Grid>
  );
};

const DraggableCard = ({ title, children, onRemove, compact = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Paper
      elevation={2}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        height: '100%',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      {isHovered && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              cursor: 'grab',
            }}
          >
            <DragIndicator sx={{ color: 'action.active' }} />
          </Box>
          <IconButton
            size="small"
            onClick={onRemove}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 1,
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </>
      )}
      {!compact && title && (
        <Box sx={{ p: 2, pb: 0 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
        </Box>
      )}
      <Box sx={{ p: compact ? 0 : 2 }}>
        {children}
      </Box>
    </Paper>
  );
};

export default DashboardGrid;