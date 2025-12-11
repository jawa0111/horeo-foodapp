import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, CardHeader, Grid, Typography, Box
} from '@mui/material';
import { TrendingUp, ShoppingCart, Star, LocalOffer } from '@mui/icons-material';

// Mock data - replace with actual API calls
const salesData = [
  { name: 'Jan', orders: 4000, revenue: 2400 },
  { name: 'Feb', orders: 3000, revenue: 1398 },
  { name: 'Mar', orders: 2000, revenue: 9800 },
  { name: 'Apr', orders: 2780, revenue: 3908 },
  { name: 'May', orders: 1890, revenue: 4800 },
  { name: 'Jun', orders: 2390, revenue: 3800 },
  { name: 'Jul', orders: 3490, revenue: 4300 },
];

const topProducts = [
  { name: 'Pizza Margherita', sales: 400, revenue: 2400 },
  { name: 'Chicken Burger', sales: 300, revenue: 1398 },
  { name: 'Caesar Salad', sales: 200, revenue: 9800 },
  { name: 'Pasta Carbonara', sales: 278, revenue: 3908 },
  { name: 'Chocolate Cake', sales: 189, revenue: 4800 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
          }}
        >
          <Icon fontSize="large" />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: 1800,
      mx: 'auto',
      width: '100%',
    }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: 'primary.main' }}>
        Dashboard Overview
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Orders" value="1,234" icon={ShoppingCart} color="#3f51b5" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Revenue" value="$12,345" icon={TrendingUp} color="#4caf50" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Top Selling Item" value="Pizza Margherita" icon={Star} color="#ff9800" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Menu Items" value="45" icon={LocalOffer} color="#e91e63" />
        </Grid>
      </Grid>

      {/* Space for future content */}
    </Box>
  );
};

export default Dashboard;
