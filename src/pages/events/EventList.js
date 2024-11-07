import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Chip,
  useTheme,
  IconButton,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const MotionCard = motion(Card);
const MotionContainer = motion(Container);

const categories = [
  'all',
  'music',
  'sports',
  'arts',
  'technology',
  'food',
  'business',
  'other',
];

const EventList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    date: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.date) params.date = filters.date;

      const response = await api.get('/events', { params });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.gradient,
      pt: 12,
      pb: 8,
    }}>
      <MotionContainer
        maxWidth="lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          Discover Amazing Events
        </Typography>

        {/* Filters */}
        <Box
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.accent.cyber }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.accent.cyber,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                select
                label="Category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: theme.palette.accent.coral }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.accent.coral,
                    },
                  },
                  '& .MuiSelect-select': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon sx={{ color: theme.palette.accent.neon }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.accent.neon,
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Event Cards */}
        <AnimatePresence>
          <Grid container spacing={4}>
            {loading
              ? Array.from(new Array(6)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card sx={{ height: '10%' }}>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton variant="text" height={40} />
                        <Skeleton variant="text" height={20} />
                        <Skeleton variant="text" height={20} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : events.map((event) => (
                  <Grid item key={event._id} xs={12} sm={6} md={4}>
                    <MotionCard
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ y: -10 }}
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={event.images[0]?.url || '/default-event.jpg'}
                          alt={event.title}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.6)',
                            },
                          }}
                        >
                          <FavoriteIcon sx={{ color: theme.palette.primary.main }} />
                        </IconButton>
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h5"
                          gutterBottom
                          sx={{
                            fontWeight: 'bold',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {event.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <Chip
                            icon={<CalendarTodayIcon />}
                            label={new Date(event.date).toLocaleDateString()}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              color: theme.palette.accent.cyber,
                            }}
                          />
                          <Chip
                            icon={<LocationOnIcon />}
                            label={`${event.location.city}`}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              color: theme.palette.accent.coral,
                            }}
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {event.description}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.accent.neon,
                              fontWeight: 'bold',
                            }}
                          >
                            From ${Math.min(...event.ticketTiers.map(tier => tier.price))}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            }}
                          >
                            Get Tickets
                          </Button>
                        </Box>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
          </Grid>
        </AnimatePresence>
      </MotionContainer>
    </Box>
  );
};

export default EventList; 