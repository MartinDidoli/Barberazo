import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockStore, TEST_ACCOUNTS } from '../services/mockStore';

export const LoginPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  const [email, setEmail] = useState('cliente@barberazo.com');
  const [password, setPassword] = useState('123456');
  const [openDrawer, setOpenDrawer] = useState(false);

  // Redirigir automáticamente si ya hay una sesión abierta
  useEffect(() => {
    const existing = mockStore.getCurrentUser();
    if (existing) {
      if (existing.role === 'cliente') {
        navigate('/home');
      } else {
        navigate('/home-staff');
      }
    }
  }, [navigate]);

  // Atajo invisible F2 para abrir el cajón de autocompletado rápido
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setOpenDrawer((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectAccount = (acc) => {
    setEmail(acc.email);
    setPassword('123456');
    setOpenDrawer(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockStore.login(email);

    if (user.role === 'cliente') {
      navigate('/home');
    } else {
      navigate('/home-staff');
    }
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
        
        {/* ENCABEZADO (Doble clic en el título activa el cajón de ayuda por si no tienen F2) */}
        <Box sx={{ textAlign: 'center', cursor: 'default' }} onDoubleClick={() => setOpenDrawer(true)}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Ingresá a tu cuenta de Barberazo
          </Typography>
        </Box>

        {/* FORMULARIO ESTÁNDAR LIMPIO */}
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            id="input-email"
            label="Correo electrónico"
            variant="outlined"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          
          <TextField
            id="input-password"
            label="Contraseña"
            type="password"
            variant="outlined"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          <Typography variant="body2" sx={{ textAlign: 'right', color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
            <span style={{ color: '#90caf9', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>
              ¿Olvidaste tu contraseña?
            </span>
          </Typography>

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
            Ingresar
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '13px' }}>
            ¿No tenés cuenta todavía?
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth
            sx={{ color: '#90caf9', borderColor: 'rgba(144, 202, 249, 0.4)', borderRadius: borderRadius }} 
            onClick={() => navigate('/register')}
          >
            Registrarse
          </Button>
        </Box>

      </Paper>

      {/* CAJÓN INVISIBLE DE PRUEBA (SOLO SE ABRE CON F2 O DOBLE CLIC EN EL TÍTULO) */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              p: 3,
              backgroundColor: '#161b22',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            },
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800, mb: 1 }}>
          ⚡ Cuentas de Prueba (F2)
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, display: 'block' }}>
          Hacé clic para autocompletar antes de grabar el video:
        </Typography>

        <List disablePadding>
          {Object.values(TEST_ACCOUNTS).map((acc) => (
            <ListItem key={acc.email} disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton
                onClick={() => handleSelectAccount(acc)}
                sx={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.5,
                  '&:hover': { borderColor: '#1976d2', backgroundColor: 'rgba(25,118,210,0.1)' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                    {acc.label}
                  </Typography>
                  <Chip label={acc.role} size="small" variant="outlined" sx={{ fontSize: '10px' }} />
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  {acc.email}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

    </Box>
  );
};