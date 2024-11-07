import React from 'react';
import { Box, Container, Grid, Typography, Link, useTheme, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';

const MotionLink = motion(Link);
const MotionBox = motion(Box);

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const year = new Date().getFullYear();

  const socialLinks = [
    { icon: <InstagramIcon />, color: theme.palette.accent.coral },
    { icon: <TwitterIcon />, color: theme.palette.accent.cyber },
    { icon: <YouTubeIcon />, color: theme.palette.primary.main },
    { icon: <TelegramIcon />, color: theme.palette.accent.neon },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'rgba(10, 10, 31, 0.9)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                fontSize: '2rem',
                mb: 2,
              }}
            >
              ORION
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Creating unforgettable experiences and connecting people through events.
              Join the next generation of event-goers and creators.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {socialLinks.map((social, index) => (
                <MotionBox
                  key={index}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    sx={{
                      color: social.color,
                      '&:hover': {
                        background: `rgba(${social.color}, 0.1)`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </MotionBox>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            {[
              { text: 'Browse Events', path: '/events' },
              { text: 'Create Event', path: '/create-event' },
              { text: 'About Us', path: '/about' },
              { text: 'Privacy Policy', path: '/privacy' },
            ].map((link, index) => (
              <MotionLink
                key={index}
                component="button"
                onClick={() => navigate(link.path)}
                sx={{
                  display: 'block',
                  mb: 1.5,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  '&:hover': {
                    color: theme.palette.accent.cyber,
                  },
                }}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {link.text}
              </MotionLink>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Box
              sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                Have questions? Reach out to us:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.accent.cyber,
                  mb: 1,
                }}
              >
                support@orion.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available 24/7 for support
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box 
          mt={8} 
          pt={3} 
          sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            © {year} Orion. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 