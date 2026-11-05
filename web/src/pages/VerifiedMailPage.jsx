import {
  Button,
  Box,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const VerifiedMailPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

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
        textAlign: 'center',
      }}>

        {/* ÍCONO DE CONFIRMACIÓN */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: 'rgba(76, 175, 80, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(76, 175, 80, 0.4)',
          }}>
            <CheckCircleIcon sx={{ fontSize: 44, color: '#4caf50' }} />
          </Box>
        </Box>

        {/* ENCABEZADO */}
        <Box>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            Correo Verificado
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
            ¡Tu cuenta ha sido activada exitosamente! Ya podés ingresar y comenzar a reservar tus turnos.
          </Typography>
        </Box>

        {/* ALERTA INFORMATIVA */}
        <Alert severity="success" sx={{ borderRadius: borderRadius, textAlign: 'left', fontWeight: 500 }}>
          Email validado correctamente. Tu usuario ya no se encuentra en estado pendiente.
        </Alert>

        {/* ACCIÓN PRINCIPAL */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => navigate('/login')}
          sx={{
            backgroundColor: '#1976d2',
            padding: '12px',
            fontWeight: 800,
            borderRadius: borderRadius,
            mt: 1,
            '&:hover': {
              backgroundColor: '#1565c0',
            }
          }}
        >
          Iniciar Sesión
        </Button>

      </Paper>
    </Box>
  );
};
