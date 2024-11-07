import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  useTheme,
  Alert,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AddPhotoAlternate as ImageIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../../utils/api';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const steps = [
  'Basic Information',
  'Location & Date',
  'Tickets & Pricing',
  'Images & Media',
  'Review',
];

const categories = [
  'music',
  'sports',
  'arts',
  'technology',
  'food',
  'business',
  'other',
];

const CreateEvent = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
    },
    ticketTiers: [
      {
        name: '',
        price: '',
        quantity: '',
        description: '',
      },
    ],
    images: [],
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setEventData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEventData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTicketTierChange = (index, field, value) => {
    setEventData(prev => {
      const newTiers = [...prev.ticketTiers];
      newTiers[index] = {
        ...newTiers[index],
        [field]: value,
      };
      return { ...prev, ticketTiers: newTiers };
    });
  };

  const addTicketTier = () => {
    setEventData(prev => ({
      ...prev,
      ticketTiers: [
        ...prev.ticketTiers,
        { name: '', price: '', quantity: '', description: '' },
      ],
    }));
  };

  const removeTicketTier = (index) => {
    setEventData(prev => ({
      ...prev,
      ticketTiers: prev.ticketTiers.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index) => {
    setEventData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Upload images first
      const imageUrls = await Promise.all(
        eventData.images.map(async (image) => {
          const formData = new FormData();
          formData.append('image', image.file);
          const response = await api.post('/upload', formData);
          return response.data.url;
        })
      );

      // Create event with image URLs
      const eventPayload = {
        ...eventData,
        images: imageUrls,
        date: `${eventData.date}T${eventData.time}`,
      };

      const response = await api.post('/events', eventPayload);
      navigate(`/events/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating event');
      setActiveStep(0);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInformation
            eventData={eventData}
            handleChange={handleChange}
          />
        );
      case 1:
        return (
          <LocationDate
            eventData={eventData}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <TicketsPricing
            eventData={eventData}
            handleTicketTierChange={handleTicketTierChange}
            addTicketTier={addTicketTier}
            removeTicketTier={removeTicketTier}
          />
        );
      case 3:
        return (
          <ImagesMedia
            eventData={eventData}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            removeImage={removeImage}
          />
        );
      case 4:
        return (
          <Review
            eventData={eventData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.gradient,
        pt: 12,
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<BackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4" gutterBottom>
              Create New Event
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              '& .MuiStepLabel-label': {
                color: 'text.secondary',
              },
              '& .MuiStepLabel-label.Mui-active': {
                color: 'primary.main',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <AnimatePresence mode="wait">
            <MotionBox
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent(activeStep)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    Create Event
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </MotionBox>
          </AnimatePresence>
        </MotionBox>
      </Container>
    </Box>
  );
};

// Step Components
const BasicInformation = ({ eventData, handleChange }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Event Title"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          multiline
          rows={4}
          label="Description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          select
          label="Category"
          name="category"
          value={eventData.category}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
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
    </Grid>
  );
};

const LocationDate = ({ eventData, handleChange }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="date"
          label="Event Date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          type="time"
          label="Event Time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Street Address"
          name="location.address"
          value={eventData.location.address}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          label="City"
          name="location.city"
          value={eventData.location.city}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          label="State"
          name="location.state"
          value={eventData.location.state}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          label="Country"
          name="location.country"
          value={eventData.location.country}
          onChange={handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

const TicketsPricing = ({ eventData, handleTicketTierChange, addTicketTier, removeTicketTier }) => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Ticket Tiers</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={addTicketTier}
          sx={{
            color: theme.palette.accent.neon,
            borderColor: theme.palette.accent.neon,
            '&:hover': {
              borderColor: theme.palette.accent.neon,
              background: 'rgba(57, 255, 20, 0.1)',
            },
          }}
        >
          Add Tier
        </Button>
      </Box>

      {eventData.ticketTiers.map((tier, index) => (
        <MotionCard
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          sx={{ mb: 3 }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Tier Name"
                  value={tier.name}
                  onChange={(e) => handleTicketTierChange(index, 'name', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Price ($)"
                  value={tier.price}
                  onChange={(e) => handleTicketTierChange(index, 'price', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Quantity Available"
                  value={tier.quantity}
                  onChange={(e) => handleTicketTierChange(index, 'quantity', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={tier.description}
                  onChange={(e) => handleTicketTierChange(index, 'description', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            {eventData.ticketTiers.length > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <IconButton
                  onClick={() => removeTicketTier(index)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </CardContent>
        </MotionCard>
      ))}
    </Box>
  );
};

const ImagesMedia = ({ eventData, getRootProps, getInputProps, removeImage }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Event Images
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${theme.palette.accent.cyber}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          mb: 3,
          '&:hover': {
            borderColor: theme.palette.accent.neon,
            backgroundColor: 'rgba(57, 255, 20, 0.05)',
          },
        }}
      >
        <input {...getInputProps()} />
        <ImageIcon sx={{ fontSize: 48, color: theme.palette.accent.cyber, mb: 1 }} />
        <Typography>
          Drag and drop images here, or click to select files
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {eventData.images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <MotionCard
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Box sx={{ position: 'relative' }}>
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
                <IconButton
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Review = ({ eventData }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Event Details
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={theme.palette.accent.coral}>
                Basic Information
              </Typography>
              <Typography><strong>Title:</strong> {eventData.title}</Typography>
              <Typography><strong>Category:</strong> {eventData.category}</Typography>
              <Typography><strong>Description:</strong> {eventData.description}</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color={theme.palette.accent.cyber}>
                Location & Date
              </Typography>
              <Typography><strong>Date:</strong> {eventData.date}</Typography>
              <Typography><strong>Time:</strong> {eventData.time}</Typography>
              <Typography><strong>Address:</strong> {eventData.location.address}</Typography>
              <Typography>
                {eventData.location.city}, {eventData.location.state}, {eventData.location.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color={theme.palette.accent.neon}>
                Ticket Tiers
              </Typography>
              {eventData.ticketTiers.map((tier, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography><strong>{tier.name}</strong></Typography>
                  <Typography>Price: ${tier.price}</Typography>
                  <Typography>Quantity: {tier.quantity}</Typography>
                  {tier.description && (
                    <Typography>Description: {tier.description}</Typography>
                  )}
                  {index < eventData.ticketTiers.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color={theme.palette.secondary.main}>
                Images
              </Typography>
              <Grid container spacing={1}>
                {eventData.images.map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: theme.shape.borderRadius,
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateEvent; 