import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const NewEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Si viene con estado de edición
  const empleadoAEditar = location.state?.empleado || null;
  const isEditing = Boolean(empleadoAEditar);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (empleadoAEditar) {
      const partes = (empleadoAEditar.nombre || '').split(' ');
      setNombre(empleadoAEditar.nombreSolo || partes[0] || '');
      setApellido(empleadoAEditar.apellidoSolo || partes.slice(1).join(' ') || '');
      setEmail(empleadoAEditar.email || '');
      setTelefono(empleadoAEditar.telefono || '');
    }
  }, [empleadoAEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isEditing) {
      // CUU 10.2: Modificar Empleado
      const res = mockStore.modificarEmpleado(empleadoAEditar.id, {
        nombre,
        apellido,
        email,
        telefono,
      });

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      setSuccessMessage('¡Datos del empleado modificados con éxito! Redirigiendo...');
      setTimeout(() => {
        navigate('/empleados-dueno');
      }, 1000);
    } else {
      // CUU 10.1: Crear Nuevo Empleado
      const res = mockStore.crearEmpleado({
        nombre,
        apellido,
        email,
        telefono,
        password,
      });

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      setSuccessMessage('¡Empleado registrado con éxito! Redirigiendo a la lista...');
      setTimeout(() => {
        navigate('/empleados-dueno');
      }, 1000);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '520px',
          p: { xs: 3, md: 4.5 },
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {/* ENCABEZADO */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            {isEditing ? 'Modificar Empleado' : 'Nuevo Empleado'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            {isEditing
              ? 'Actualizá los datos del empleado seleccionado'
              : 'Ingresá los datos del barbero para registrarlo en el sistema'}
          </Typography>
        </Box>

        {/* MENSAJES DE ALERTA */}
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

        {/* FORMULARIO */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* NOMBRE Y APELLIDO */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <TextField
              label="Nombre"
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
              label="Apellido"
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

          {/* EMAIL */}
          <TextField
            label="Correo Electrónico"
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

          {/* TELÉFONO */}
          <TextField
            label="Teléfono"
            type="tel"
            variant="outlined"
            size="small"
            fullWidth
            value={telefono}
            onChange={(e) => {
              setTelefono(e.target.value);
              setErrorMessage('');
            }}
            required
          />

          {/* CONTRASEÑA (Solo al crear nuevo empleado) */}
          {!isEditing && (
            <TextField
              label="Contraseña"
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
              helperText="Mínimo 6 caracteres"
            />
          )}

          {/* BOTONES DE ACCIÓN */}
          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/empleados-dueno')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: '10px' }}
            >
              Volver
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#1976d2',
                fontWeight: 800,
                borderRadius: '10px',
                padding: '10px',
              }}
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Empleado'}
            </Button>
          </Box>

        </Box>
      </Paper>
    </Box>
  );
};
