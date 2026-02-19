import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Timeline,
  BarChart,
  PieChart,
  TableChart,
  DateRange,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import ChartContainer from '../components/features/charts/ChartContainer';
import LineChart from '../components/features/charts/LineChart';
import BarChartComponent from '../components/features/charts/BarChart';
import PieChartComponent from '../components/features/charts/PieChart';
import { Typography } from '@mui/material';
const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [category, setCategory] = useState('all');

  const revenueData = [
    { name: 'Jan', revenue: 4000, profit: 2400 },
    { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 9800, profit: 2000 },
    { name: 'Apr', revenue: 3908, profit: 2780 },
    { name: 'May', revenue: 4800, profit: 1890 },
    { name: 'Jun', revenue: 3800, profit: 2390 },
    { name: 'Jul', revenue: 4300, profit: 3490 },
  ];

  const trafficData = [
    { name: 'Direct', value: 400, color: '#4f46e5' },
    { name: 'Social', value: 300, color: '#10b981' },
    { name: 'Referral', value: 300, color: '#f59e0b' },
    { name: 'Email', value: 200, color: '#ef4444' },
    { name: 'Organic', value: 278, color: '#8b5cf6' },
  ];

  const performanceData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  const tabs = [
    { label: 'Overview', icon: <Timeline /> },
    { label: 'Revenue', icon: <BarChart /> },
    { label: 'Traffic', icon: <PieChart /> },
    { label: 'Performance', icon: <TableChart /> },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Analytics"
        subtitle="Detailed insights and performance metrics"
        breadcrumbs={true}
        actions={[
          {
            label: 'Export Report',
            onClick: () => console.log('Export'),
            variant: 'outlined',
          },
          {
            label: 'Refresh',
            onClick: () => console.log('Refresh'),
            variant: 'contained',
          },
        ]}
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
          </Tabs>
          
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
                startAdornment={<DateRange sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                <MenuItem value="week">Last 7 days</MenuItem>
                <MenuItem value="month">Last 30 days</MenuItem>
                <MenuItem value="quarter">Last quarter</MenuItem>
                <MenuItem value="year">Last year</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="product">Product</MenuItem>
                <MenuItem value="support">Support</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ChartContainer
            title="Revenue Trend"
            subtitle={`Last ${timeRange}`}
            filters={[
              {
                key: 'metric',
                label: 'Metric',
                options: [
                  { value: 'revenue', label: 'Revenue' },
                  { value: 'profit', label: 'Profit' },
                ],
                defaultValue: 'revenue',
              },
            ]}
            exportable={true}
            exportId="revenue-chart"
            exportData={revenueData}
            chartType="line"
          >
            <LineChart
              data={revenueData}
              lines={[
                { key: 'revenue', color: '#4f46e5', name: 'Revenue' },
                { key: 'profit', color: '#10b981', name: 'Profit' },
              ]}
              height={400}
              area={true}
            />
          </ChartContainer>
        </Grid>

        <Grid item xs={12} lg={4}>
          <ChartContainer
            title="Traffic Sources"
            subtitle="Current month"
            exportable={true}
            exportId="traffic-chart"
            exportData={trafficData}
            chartType="pie"
          >
            <PieChartComponent
              data={trafficData}
              height={400}
              showLabel={true}
            />
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer
            title="Performance Metrics"
            subtitle="Detailed breakdown"
            exportable={true}
            exportId="performance-chart"
            exportData={performanceData}
            chartType="bar"
          >
            <BarChartComponent
              data={performanceData}
              bars={[
                { key: 'uv', color: '#4f46e5', name: 'Unique Visitors' },
                { key: 'pv', color: '#10b981', name: 'Page Views' },
                { key: 'amt', color: '#f59e0b', name: 'Amount' },
              ]}
              height={300}
              stacked={true}
            />
          </ChartContainer>
        </Grid>

        {/* Additional Metrics */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              2,458
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
            <Typography variant="caption" color="success.main">
              +12.5% from last month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              $24,580
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="caption" color="success.main">
              +8.2% from last month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              1,234
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New Orders
            </Typography>
            <Typography variant="caption" color="success.main">
              +5.7% from last month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              3.24%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Conversion Rate
            </Typography>
            <Typography variant="caption" color="error">
              -0.8% from last month
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default AnalyticsPage;