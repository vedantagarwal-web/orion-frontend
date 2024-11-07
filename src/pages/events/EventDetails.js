import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  Avatar,
  IconButton,
  useTheme,
  Dialog,
  DialogContent,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from '../../utils/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!event) return <Typography>Event not found</Typography>;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: theme.palette.background.gradient,
      pt: 12,
      pb: 8,
    }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/events')}
            sx={{ 
              mb: 4,
              color: theme.palette.accent.cyber,
              '&:hover': {
                background: 'rgba(0, 243, 255, 0.1)',
              },
            }}
          >
            Back to Events
          </Button>

          <Grid container spacing={4}>
            {/* Left Column - Images and Description */}
            <Grid item xs={12} md={8}>
              <MotionBox
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                sx={{ position: 'relative' }}
              >
                <img
                  src={event.images[0]?.url || '/default-event.jpg'}
                  alt={event.title}
                  style={{
                    width: '100%',
                    borderRadius: '16px',
                    maxHeight: '500px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedImage(event.images[0]?.url)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => setLiked(!liked)}
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        color: liked ? theme.palette.primary.main : 'white',
                      }}
                    />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
                    }}
                  >
                    <ShareIcon sx={{ color: 'white' }} />
                  </IconButton>
                </Box>
              </MotionBox>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                  About This Event
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {event.description}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" gutterBottom>
                  Location
                </Typography>
                <Card
                  sx={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon sx={{ color: theme.palette.accent.coral, mr: 1 }} />
                      <Typography variant="body1">
                        {event.location.address}
                        <br />
                        {event.location.city}, {event.location.state}
                        <br />
                        {event.location.country}
                      </Typography>
                    </Box>
                    {/* Add Google Maps integration here */}
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Right Column - Event Details and Tickets */}
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                sx={{
                  position: 'sticky',
                  top: 100,
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {event.title}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip
                      icon={<CalendarTodayIcon />}
                      label={new Date(event.date).toLocaleDateString()}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: theme.palette.accent.cyber,
                      }}
                    />
                    <Chip
                      icon={<LocationOnIcon />}
                      label={event.location.city}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        color: theme.palette.accent.coral,
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Organizer
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2 }}>
                        <PersonIcon />
                      </Avatar>
                      <Typography variant="body1">
                        {event.organizer.firstName} {event.organizer.lastName}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Ticket Tiers
                  </Typography>
                  {event.ticketTiers.map((tier, index) => (
                    <MotionCard
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        mb: 2,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {tier.name}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: theme.palette.accent.neon }}
                          >
                            ${tier.price}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {tier.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tier.quantity - tier.soldCount} tickets remaining
                        </Typography>
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/events/${event._id}/tickets/${tier.id}`)}
                        >
                          Get Tickets
                        </Button>
                      </CardContent>
                    </MotionCard>
                  ))}
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </MotionBox>
      </Container>

      {/* Image Preview Dialog */}
      <Dialog
        open={Boolean(selectedImage)}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent>
          <img
            src={selectedImage}
            alt="Event"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EventDetails; 