import { useState } from 'react';
import {
  Alert,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Ingresá tu correo electrónico');
      return;
    }
    setErrorMessage('');
    navigate('/reset-password');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: 2 }}>
      
      <Paper elevation={0} sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 3, 
        width: '100%', 
        maxWidth: '440px', 
        padding: { xs: 3, md: 5 }, 
        borderRadius: borderRadius,
      }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            Recuperar Contraseña
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Ingresá tu correo electrónico y te enviaremos las instrucciones para crear una nueva contraseña
          </Typography>
        </Box>

        {/* FORMULARIO ESTÁNDAR LIMPIO */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            id="input-forgot-email"
            label="Correo electrónico"
            type="email"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage('');
            }}
            fullWidth
            required
          />

          <Button 
            type="submit"
            variant="contained" 
            size="large" 
            sx={{ 
              backgroundColor: '#1976d2', 
              padding: '12px', 
              fontWeight: 800, 
              borderRadius: borderRadius,
              mt: 1 
            }}
          >
            Enviar correo
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '13px' }}>
            ¿Recordaste tu contraseña?
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth
            sx={{ color: '#90caf9', borderColor: 'rgba(144, 202, 249, 0.4)', borderRadius: borderRadius }} 
            onClick={() => navigate('/login')}
          >
            Volver al Login
          </Button>
        </Box>

      </Paper>

    </Box>
  );
};
