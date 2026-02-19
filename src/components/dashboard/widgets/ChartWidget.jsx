import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Typography // Added import
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { CHART_COLORS } from '../../../utils/constants';

const ChartWidget = ({ title, data, chartType = 'line', height = 300 }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderChart = () => {
    // Note: Recharts sub-components (XAxis, etc.) expect the data from parent
    const chartProps = { data, width: 100, height: 100 }; // ResponsiveContainer handles actual size

    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              fill={CHART_COLORS.primary}
              fillOpacity={0.2}
            />
          </AreaChart>
        );
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={title}
        action={
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        }
        subheader={
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp fontSize="small" color="success" />
            <Typography variant="caption" color="text.secondary">
              +12.5% this month
            </Typography>
          </Box>
        }
        // FIX 1: Overrides the <p> tag to avoid <div> nesting error
        slotProps={{ subheader: { component: 'div' } }}
      />
      <CardContent sx={{ flexGrow: 1, minHeight: height }}>
        {/* minWidth: 0 is essential here */}
        <Box sx={{ width: '100%', height: height, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Export Data</MenuItem>
        <MenuItem onClick={handleMenuClose}>Customize</MenuItem>
      </Menu>
    </Card>
  );
};

export default ChartWidget;
