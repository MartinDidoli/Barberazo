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
import { mockStore } from '../services/mockStore';

export const RegisterPage = () => {
  const borderRadius = "10px";
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const result = mockStore.register({
      nombre,
      apellido,
      email,
      telefono,
      password,
    });

    if (result.error) {
      setErrorMessage(result.error);
      return;
    }

    setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo a tu panel...');
    setTimeout(() => {
      navigate('/home');
    }, 1200);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)', padding: 2 }}>
      
      <Paper elevation={0} sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2.5, 
        width: '100%', 
        maxWidth: '480px', 
        padding: { xs: 3, md: 4.5 }, 
        borderRadius: borderRadius,
      }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            Crear Cuenta
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Completá tus datos para registrarte en Barberazo
          </Typography>
        </Box>

        {/* FORMULARIO */}
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: '10px' }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ borderRadius: '10px' }}>
              {successMessage}
            </Alert>
          )}

          {/* FILA 1: NOMBRE Y APELLIDO (2 COLUMNAS EN DESKTOP, 1 EN MOBILE) */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              id="input-nombre"
              label="Ingrese nombre"
              variant="outlined"
              size="small"
              fullWidth
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                setErrorMessage('');
              }}
              required
            />
            <TextField
              id="input-apellido"
              label="Ingrese apellido"
              variant="outlined"
              size="small"
              fullWidth
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                setErrorMessage('');
              }}
              required
            />
          </Box>

          {/* FILA 2: CORREO ELECTRÓNICO Y TELÉFONO */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              id="input-email"
              label="Ingrese correo electrónico"
              type="email"
              variant="outlined"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              required
            />
            <TextField
              id="input-telefono"
              label="Ingrese teléfono"
              type="tel"
              variant="outlined"
              size="small"
              fullWidth
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                setErrorMessage('');
              }}
            />
          </Box>

          {/* FILA 3: CONTRASEÑA */}
          <TextField
            id="input-password"
            label="Ingrese contraseña"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage('');
            }}
            required
          />

          {/* FILA 4: REPETIR CONTRASEÑA */}
          <TextField
            id="input-confirm-password"
            label="Repetir contraseña"
            type="password"
            variant="outlined"
            size="small"
            fullWidth
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrorMessage('');
            }}
            required
          />

          {/* BOTÓN REGISTRARSE (CUU 2.1) */}
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
            Registrarse
          </Button>
        </Box>

        {/* PIE DE PÁGINA: REDIRIGIR A LOGIN */}
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '13px' }}>
            ¿Ya tenés cuenta?
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            fullWidth
            sx={{ color: '#90caf9', borderColor: 'rgba(144, 202, 249, 0.4)', borderRadius: borderRadius }} 
            onClick={() => navigate('/login')}
          >
            Loguearse
          </Button>
        </Box>

      </Paper>
    </Box>
  );
};