import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  useTheme,
  IconButton,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Block as BlockIcon,
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  EventAvailable as EventIcon,
  AttachMoney as RevenueIcon,
} from '@mui/icons-material';
import api from '../../utils/api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const AdminDashboard = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRevenue: 0,
    activeUsers: 0,
    userGrowth: 0,
    eventGrowth: 0,
    revenueGrowth: 0,
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, eventsRes, statsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/events'),
        api.get('/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleAction = async (type, item) => {
    setSelectedItem(item);
    setActionType(type);
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'delete') {
        await api.delete(`/admin/${selectedItem.type}s/${selectedItem.id}`);
      } else if (actionType === 'suspend') {
        await api.post(`/admin/users/${selectedItem.id}/suspend`);
      } else if (actionType === 'approve') {
        await api.post(`/admin/events/${selectedItem.id}/approve`);
      }
      fetchDashboardData();
      setDialogOpen(false);
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const StatCard = ({ title, value, icon, color, growth }) => (
    <MotionCard
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        height: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                background: `linear-gradient(45deg, ${color}, ${theme.palette.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${color}22`,
              borderRadius: '50%',
              p: 1,
              height: 'fit-content',
            }}
          >
            {icon}
          </Box>
        </Box>
        {growth !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon
              sx={{
                color: growth >= 0 ? theme.palette.accent.neon : theme.palette.error.main,
                fontSize: '1rem',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: growth >= 0 ? theme.palette.accent.neon : theme.palette.error.main,
              }}
            >
              {growth}% from last month
            </Typography>
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.gradient,
        pt: 12,
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<PeopleIcon sx={{ color: theme.palette.accent.cyber }} />}
              color={theme.palette.accent.cyber}
              growth={stats.userGrowth}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              icon={<EventIcon sx={{ color: theme.palette.accent.coral }} />}
              color={theme.palette.accent.coral}
              growth={stats.eventGrowth}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<RevenueIcon sx={{ color: theme.palette.accent.neon }} />}
              color={theme.palette.accent.neon}
              growth={stats.revenueGrowth}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={<PeopleIcon sx={{ color: theme.palette.secondary.main }} />}
              color={theme.palette.secondary.main}
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <MotionCard
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '400px',
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Revenue Overview
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(19, 19, 47, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={theme.palette.primary.main}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <MotionCard
              whileHover={{ scale: 1.02 }}
              sx={{
                height: '400px',
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Event Categories
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={[
                          theme.palette.primary.main,
                          theme.palette.secondary.main,
                          theme.palette.accent.cyber,
                          theme.palette.accent.coral,
                          theme.palette.accent.neon,
                        ][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(19, 19, 47, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Management Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
          >
            <Tab label="Users Management" />
            <Tab label="Events Management" />
          </Tabs>
        </Box>

        {/* Management Content */}
        <AnimatePresence mode="wait">
          {tab === 0 ? (
            <MotionBox
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Users Management Content */}
              {/* Add DataGrid or custom table component here */}
            </MotionBox>
          ) : (
            <MotionBox
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Events Management Content */}
              {/* Add DataGrid or custom table component here */}
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Confirmation Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          PaperProps={{
            sx: {
              background: theme.palette.background.paper,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {actionType} this {selectedItem?.type}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 