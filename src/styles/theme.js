import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF3366', // Vibrant pink
      light: '#FF6B9B',
      dark: '#CC1A47',
    },
    secondary: {
      main: '#6C63FF', // Electric purple
      light: '#8F88FF',
      dark: '#4A43CC',
    },
    accent: {
      neon: '#39FF14', // Neon green
      coral: '#FF7F50', // Coral
      cyber: '#00F3FF', // Cyber blue
      yellow: '#FFD600', // Electric yellow
    },
    background: {
      default: '#0A0A1F', // Deep space blue
      paper: '#13132F',
      gradient: 'linear-gradient(45deg, #0A0A1F 30%, #1A1A3F 90%)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3CC',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Inter", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      background: 'linear-gradient(45deg, #FF3366, #6C63FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #FF3366, #6C63FF)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF6B9B, #8F88FF)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 30px rgba(108, 99, 255, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 31, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme; 