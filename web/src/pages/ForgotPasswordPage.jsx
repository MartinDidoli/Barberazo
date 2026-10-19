import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 2 }}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, width: '100%', maxWidth: '400px', backgroundColor: '#f9f9f9', padding: 4, borderRadius: borderRadius, border: '1px solid #e0e0e0' }}>
        
        <Typography variant="h5" textAlign="center" fontWeight="bold">
          Recuperar Contraseña
        </Typography>
        
        <Typography variant="body2" textAlign="center" color="textSecondary">
          Ingresá tu correo electrónico y te enviaremos las instrucciones para crear una nueva contraseña.
        </Typography>
        
        <TextField label="Correo electrónico" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
        
        <Button variant="contained" size="large" onClick={() => navigate('/reset-password')} sx={{ mt: 1, borderRadius: borderRadius, padding: '12px', fontWeight: 'bold' }}>
          Enviar correo
        </Button>

        <Button variant="text" onClick={() => navigate('/login')} sx={{ borderRadius: borderRadius }}>
          Volver al Login
        </Button>

      </Box>
    </Box>
  );
}