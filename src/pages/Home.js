import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/Create';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box sx={{ 
      background: theme.palette.background.gradient,
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          pt: 15,
          pb: 20,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(108, 99, 255, 0.2), transparent 50%)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionBox variants={itemVariants}>
              <Typography
                component="h1"
                variant="h1"
                align="center"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 4,
                }}
              >
                Experience Events Like Never Before
              </Typography>
            </MotionBox>

            <MotionBox variants={itemVariants}>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
                sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
              >
                Join the next generation of event-goers. Discover unique experiences,
                connect with like-minded people, and create unforgettable memories.
              </Typography>
            </MotionBox>

            <MotionBox
              variants={itemVariants}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/events')}
                startIcon={<ExploreIcon />}
                sx={{
                  minWidth: '200px',
                  fontSize: '1.1rem',
                }}
              >
                Explore Events
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/create-event')}
                startIcon={<CreateIcon />}
                sx={{
                  minWidth: '200px',
                  fontSize: '1.1rem',
                  borderColor: theme.palette.accent.cyber,
                  color: theme.palette.accent.cyber,
                  '&:hover': {
                    borderColor: theme.palette.accent.cyber,
                    backgroundColor: 'rgba(0, 243, 255, 0.1)',
                  },
                }}
              >
                Create Event
              </Button>
            </MotionBox>
          </MotionBox>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 12 }} maxWidth="lg">
        <Grid container spacing={6}>
          {[
            {
              title: "Discover",
              description: "Find unique events that match your vibe. From underground concerts to exclusive workshops.",
              icon: <ExploreIcon sx={{ fontSize: 40, color: theme.palette.accent.coral }} />,
              color: theme.palette.accent.coral,
            },
            {
              title: "Create & Host",
              description: "Turn your vision into reality. Host events that leave a lasting impression.",
              icon: <CreateIcon sx={{ fontSize: 40, color: theme.palette.accent.neon }} />,
              color: theme.palette.accent.neon,
            },
            {
              title: "Connect",
              description: "Join a community of trend-setters and culture creators. Your tribe awaits.",
              icon: <ConnectWithoutContactIcon sx={{ fontSize: 40, color: theme.palette.accent.cyber }} />,
              color: theme.palette.accent.cyber,
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <MotionCard
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      background: `linear-gradient(45deg, ${feature.color}, ${theme.palette.primary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 