import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Tab,
  Tabs,
  useTheme,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarMonth as CalendarIcon,
  Favorite as FavoriteIcon,
  ConfirmationNumber as TicketIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

// Chart components (you'll need to install recharts)
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const UserDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    ticketsPurchased: 0,
    favoriteEvents: 0,
  });
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, eventsRes, ticketsRes, activityRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/users/events'),
        api.get('/users/tickets'),
        api.get('/users/activity'),
      ]);

      setStats(statsRes.data);
      setEvents(eventsRes.data);
      setTickets(ticketsRes.data);
      setActivityData(activityRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}22`,
              color: color,
              mr: 2,
            }}
          >
            {icon}
          </Avatar>
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
        </Box>
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
      <Container maxWidth="lg">
        {/* User Profile Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar
                    src={user.profileImage}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: `4px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate('/settings')}
                    sx={{ mt: 2 }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Upcoming Events"
                  value={stats.upcomingEvents}
                  icon={<CalendarIcon />}
                  color={theme.palette.accent.cyber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StatCard
                  title="Tickets Purchased"
                  value={stats.ticketsPurchased}
                  icon={<TicketIcon />}
                  color={theme.palette.accent.neon}
                />
              </Grid>
              <Grid item xs={12}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: '300px',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Activity Overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
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
                          dataKey="events"
                          stroke={theme.palette.primary.main}
                          fillOpacity={1}
                          fill="url(#colorEvents)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </MotionCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Events and Tickets Tabs */}
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
            <Tab label="My Events" />
            <Tab label="My Tickets" />
          </Tabs>
        </Box>

        <AnimatePresence mode="wait">
          {tab === 0 ? (
            <MotionBox
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={4}>
                {events.map((event) => (
                  <Grid item key={event._id} xs={12} sm={6} md={4}>
                    <EventCard event={event} />
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          ) : (
            <MotionBox
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={4}>
                {tickets.map((ticket) => (
                  <Grid item key={ticket._id} xs={12} sm={6} md={4}>
                    <TicketCard ticket={ticket} />
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

// Sub-components for Event and Ticket cards
const EventCard = ({ event }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <MotionCard
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        cursor: 'pointer',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      onClick={() => navigate(`/events/${event._id}`)}
    >
      {/* Event card content */}
    </MotionCard>
  );
};

const TicketCard = ({ ticket }) => {
  const theme = useTheme();

  return (
    <MotionCard
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Ticket card content */}
    </MotionCard>
  );
};

export default UserDashboard; 