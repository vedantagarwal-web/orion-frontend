import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AddIcon from '@mui/icons-material/Add';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';

const MotionIconButton = motion(IconButton);

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(10, 10, 31, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              flexGrow: 1,
              cursor: 'pointer',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              fontSize: '1.8rem',
            }}
            onClick={() => navigate('/')}
          >
            ORION
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<ExploreIcon />}
              onClick={() => navigate('/events')}
              sx={{
                color: theme.palette.accent.cyber,
                '&:hover': {
                  background: 'rgba(0, 243, 255, 0.1)',
                },
              }}
            >
              Events
            </Button>

            {!user ? (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: theme.palette.accent.coral,
                    color: theme.palette.accent.coral,
                    '&:hover': {
                      borderColor: theme.palette.accent.coral,
                      background: 'rgba(255, 127, 80, 0.1)',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/signup')}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <>
                {user.userType === 'organizer' && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-event')}
                    sx={{
                      borderColor: theme.palette.accent.neon,
                      color: theme.palette.accent.neon,
                      '&:hover': {
                        borderColor: theme.palette.accent.neon,
                        background: 'rgba(57, 255, 20, 0.1)',
                      },
                    }}
                  >
                    Create Event
                  </Button>
                )}
                <MotionIconButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMenu}
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
                    },
                  }}
                >
                  <Avatar
                    src={user.profileImage}
                    alt={user.firstName}
                    sx={{ width: 32, height: 32 }}
                  />
                </MotionIconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      background: theme.palette.background.paper,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem 
                    onClick={() => { handleClose(); navigate('/dashboard'); }}
                    sx={{ gap: 1 }}
                  >
                    <AccountCircleIcon sx={{ color: theme.palette.accent.coral }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { handleClose(); navigate('/settings'); }}
                    sx={{ gap: 1 }}
                  >
                    <SettingsIcon sx={{ color: theme.palette.accent.cyber }} />
                    Settings
                  </MenuItem>
                  {user.userType === 'admin' && (
                    <MenuItem 
                      onClick={() => { handleClose(); navigate('/admin'); }}
                      sx={{ gap: 1 }}
                    >
                      <AdminPanelSettingsIcon sx={{ color: theme.palette.accent.neon }} />
                      Admin Panel
                    </MenuItem>
                  )}
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ 
                      gap: 1,
                      color: theme.palette.primary.main,
                    }}
                  >
                    <LogoutIcon />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 