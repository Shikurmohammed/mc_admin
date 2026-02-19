import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const PieChart = ({
  data,
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  innerRadius = 0,
  outerRadius = '80%',
  showTooltip = true,
  showLegend = true,
  showLabel = false,
  title,
  colors,
}) => {
  const theme = useTheme();

  const defaultColors = colors || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.success.main,
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#84cc16',
  ];

  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  return (
    <Box sx={{ width: '100%', height }}>
      {title && (
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
            label={showLabel ? ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={defaultColors[index % defaultColors.length]}
                stroke={theme.palette.background.paper}
                strokeWidth={2}
              />
            ))}
            {!showLabel && (
              <Label
                value={`${total}`}
                position="center"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fill: theme.palette.text.primary,
                }}
              />
            )}
          </Pie>
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 8,
              }}
              formatter={(value, name, props) => [
                value,
                props.payload[nameKey],
                `(${((value / total) * 100).toFixed(1)}%)`,
              ]}
            />
          )}
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value, entry) => (
                <span style={{ color: theme.palette.text.primary }}>
                  {value}
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChart;