import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
        maxWidth: '450px', 
        backgroundColor: 'transparent', 
        padding: { xs: 3, md: 5 }, 
        borderRadius: borderRadius, 
        border: '1px solid rgba(255, 255, 255, 0.2)' 
      }}>
        
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
          Iniciar Sesión
        </Typography>

        <TextField
          id="input-email"
          label="Ingrese correo electrónico"
          variant="outlined"
          fullWidth
          sx={darkInputStyle}
        />
        
        <TextField
          id="input-password"
          label="Ingrese contraseña"
          type="password"
          variant="outlined"
          fullWidth
          sx={darkInputStyle}
        />

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
          ¿Olvidaste tu contraseña? <span style={{ color: '#90caf9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>Recuperar Contraseña aquí</span>
        </Typography>

        <Button variant="contained" size="large" sx={{ backgroundColor: '#007bff', padding: '12px', fontWeight: 'bold', borderRadius: borderRadius }} onClick={() => navigate('/home')}>
          Ingresar
        </Button>

        <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            ¿No tenés cuenta?
          </Typography>
          <Button variant="outlined" size="large" sx={{ color: '#90caf9', borderColor: 'rgba(144, 202, 249, 0.5)', borderRadius: borderRadius }} onClick={() => navigate('/register')}>
            Registrarse
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}