import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.05)', // Un fondo muy sutil
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#007bff' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#007bff' }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 2 }}>
      
      <Paper elevation={0} component="form" sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 3, 
        width: '100%', 
        maxWidth: '500px', 
        backgroundColor: 'transparent', 
        padding: { xs: 3, md: 5 }, 
        borderRadius: borderRadius, 
        border: '1px solid rgba(255, 255, 255, 0.2)' 
      }}>
        
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
          Crear Cuenta
        </Typography>

        {/* Fila 1: Nombre y Apellido */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField label="Ingrese nombre" variant="outlined" fullWidth sx={darkInputStyle} />
          <TextField label="Ingrese apellido" variant="outlined" fullWidth sx={darkInputStyle} />
        </Box>

        {/* Fila 2: Correo electrónico y Teléfono */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField label="Ingrese correo electrónico" variant="outlined" fullWidth sx={darkInputStyle} />
          <TextField label="Ingrese teléfono" variant="outlined" fullWidth sx={darkInputStyle} />
        </Box>

        <TextField label="Ingrese contraseña" type="password" variant="outlined" fullWidth sx={darkInputStyle} />
        
        <TextField label="Repetir contraseña" type="password" variant="outlined" fullWidth sx={darkInputStyle} />

        <Button variant="contained" size="large" sx={{ mt: 2, borderRadius: borderRadius, padding: '12px', fontWeight: 'bold', backgroundColor: '#007bff' }}>
          Registrarse
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿Ya tenés cuenta?
          </Typography>
          
          <Button variant="outlined" fullWidth size="large" onClick={() => navigate('/login')} sx={{ borderRadius: borderRadius, color: '#90caf9', borderColor: 'rgba(144, 202, 249, 0.5)' }}>
            Loguearse
          </Button>
        </Box>
        
      </Paper>
    </Box>
  );
}