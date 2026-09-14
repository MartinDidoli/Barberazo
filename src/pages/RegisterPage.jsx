import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 2 }}>
      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, width: '100%', maxWidth: '500px', backgroundColor: '#f9f9f9', padding: 4, borderRadius: borderRadius, border: '1px solid #e0e0e0' }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
          <Box sx={{ width: 70, height: 70, borderRadius: '50%', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption">LOGO</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Ingrese nombre" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
          <TextField label="Ingrese apellido" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Ingrese correo electrónico" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
          <TextField label="Ingrese teléfono" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
        </Box>

        <TextField label="Ingrese contraseña" type="password" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />
        
        <TextField label="Repetir contraseña" type="password" variant="filled" fullWidth sx={{ backgroundColor: "#f2f2f2", borderRadius: borderRadius }} />

        <Button variant="contained" size="large" sx={{ mt: 1, borderRadius: borderRadius, padding: '12px', fontWeight: 'bold' }}>
          Registrarse
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'blue' }}>
            ¿Ya tenés cuenta?
          </Typography>
          
          <Button variant="outlined" fullWidth size="large" onClick={() => navigate('/login')} sx={{ borderRadius: borderRadius, backgroundColor: '#e3f2fd' }}>
            Loguearse
          </Button>
        </Box>
      </Box>
    </Box>
  );
}