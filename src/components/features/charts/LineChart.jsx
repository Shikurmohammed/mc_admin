import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const LineChart = ({
  data,
  lines = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  stacked = false,
  area = false,
  syncId,
  title,
}) => {
  const theme = useTheme();

  const defaultLines = lines.length > 0 ? lines : [
    { key: 'value', color: theme.palette.primary.main, name: 'Value' },
  ];

  const ChartComponent = area ? AreaChart : RechartsLineChart;

  return (
    <Box sx={{ width: '100%', height }}>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          syncId={syncId}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          />
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
              formatter={(value, name) => [value, name]}
              labelStyle={{ color: theme.palette.text.primary }}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
            />
          )}
          {defaultLines.map((line, index) => (
            area ? (
              <Area
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                fill={line.color}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                stackId={stacked ? 'stack' : undefined}
              />
            ) : (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                stackId={stacked ? 'stack' : undefined}
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </Box>
  );
};

export default LineChart;