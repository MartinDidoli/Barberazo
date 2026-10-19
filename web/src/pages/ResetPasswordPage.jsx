import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: 4, pt: 8 }}>
      
      <Box sx={{ width: '100%', maxWidth: '600px', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Recuperar Contraseña
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Desktop
        </Typography>
      </Box>

      <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3, width: '100%', maxWidth: '600px', backgroundColor: '#f9f9f9', padding: 4, borderRadius: borderRadius, border: '1px solid #e0e0e0' }}>
        
        < Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          < Box sx={{ width: 80, height: 80, borderRadius: '50%', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption">LOGO</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <TextField label="Ingrese nueva Contraseña" type="password" variant="outlined" sx={{ width: '100%', maxWidth: '400px', backgroundColor: "#ffffff", borderRadius: borderRadius }} />
          
          <TextField label="Repita nueva contraseña" type="password" variant="outlined" sx={{ width: '100%', maxWidth: '400px', backgroundColor: "#ffffff", borderRadius: borderRadius }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ borderRadius: borderRadius, padding: '12px 40px', fontWeight: 'bold' }}>
            Restaurar Contraseña
          </Button>
        </Box>

      </Box>
    </Box>
  );
}