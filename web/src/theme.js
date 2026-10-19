import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#0d47a1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    background: {
      default: '#0e1117',
      paper: 'rgba(22, 27, 34, 0.75)',
    },
    text: {
      primary: '#f0f6fc',
      secondary: '#8b949e',
    },
    success: {
      main: '#2ea043',
      light: '#3fb950',
    },
    warning: {
      main: '#d29922',
      light: '#e3b341',
    },
    error: {
      main: '#f85149',
      light: '#ff7b72',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(22, 27, 34, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.08)',
          color: '#e6edf3',
        },
        head: {
          fontWeight: 700,
          color: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
          },
        },
      },
    },
  },
});
