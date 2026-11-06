import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import ContentCutIcon from '@mui/icons-material/ContentCut';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const EmpleadosDueno = () => {
  const navigate = useNavigate();

  const [empleados, setEmpleados] = useState([]);
  
  // Modal CUU 6.4 (Vincular Servicios con Empleado)
  const [modalServiciosOpen, setModalServiciosOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [serviciosElegidos, setServiciosElegidos] = useState([]);

  // Modal CUU 10.3 (Eliminar Empleado)
  const [modalEliminarOpen, setModalEliminarOpen] = useState(false);
  const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);
  const [errorEliminar, setErrorEliminar] = useState('');

  // Notificaciones Snackbar
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  // Lista de todos los servicios del local disponibles
  const serviciosDisponibles = [
    { id: 1, name: 'Corte de Pelo', price: 12000 },
    { id: 2, name: 'Perfilado de Barba', price: 8000 },
    { id: 3, name: 'Corte + Barba', price: 18000 },
    { id: 4, name: 'Diseño de Cejas', price: 5000 },
    { id: 5, name: 'Lavado y Peinado', price: 6000 },
  ];

  const loadData = () => {
    setEmpleados(mockStore.getEmpleadosList());
  };

  useEffect(() => {
    loadData();
  }, []);

  // CUU 10.2: Navegar a editar empleado
  const handleEditarEmpleado = (empleado) => {
    navigate('/empleados-dueno/newEmployee', { state: { empleado } });
  };

  // CUU 10.3: Abrir confirmación de eliminación
  const handleOpenEliminar = (empleado) => {
    setEmpleadoAEliminar(empleado);
    setErrorEliminar('');
    setModalEliminarOpen(true);
  };

  const handleConfirmarEliminar = () => {
    if (!empleadoAEliminar) return;
    const res = mockStore.eliminarEmpleado(empleadoAEliminar.id);

    if (res.error) {
      setErrorEliminar(res.error);
      return;
    }

    loadData();
    setModalEliminarOpen(false);
    setSnackMessage(`Empleado ${empleadoAEliminar.nombre} eliminado del sistema.`);
    setSnackSeverity('info');
    setSnackOpen(true);
  };

  // CUU 6.4: Servicios
  const handleOpenServicios = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setServiciosElegidos(empleado.servicios || []);
    setModalServiciosOpen(true);
  };

  const handleToggleServicio = (nombreServicio) => {
    setServiciosElegidos((prev) => {
      if (prev.includes(nombreServicio)) {
        return prev.filter((s) => s !== nombreServicio);
      } else {
        return [...prev, nombreServicio];
      }
    });
  };

  const handleGuardarServicios = () => {
    if (!empleadoSeleccionado) return;
    mockStore.vincularServiciosEmpleado(empleadoSeleccionado.id, serviciosElegidos);
    loadData();
    setModalServiciosOpen(false);
    setSnackMessage(`Servicios vinculados correctamente a ${empleadoSeleccionado.nombre}.`);
    setSnackSeverity('success');
    setSnackOpen(true);
  };

  // Mobile Card Component
  const EmpleadoCard = ({ empleado }) => (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            {empleado.nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: '#90caf9', fontWeight: 600 }}>
            {empleado.rol || 'Barbero'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mt: 0.5 }}>
            {empleado.email} • Tel: {empleado.telefono}
          </Typography>
        </Box>
      </Box>

      {/* Servicios asignados */}
      <Box>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 0.5 }}>
          SERVICIOS VINCULADOS:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
          {empleado.servicios?.length > 0 ? (
            empleado.servicios.map((srv) => (
              <Chip key={srv} label={srv} size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontSize: '11px' }} />
            ))
          ) : (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
              Sin servicios asignados
            </Typography>
          )}
        </Box>
      </Box>

      {/* Acciones */}
      <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          startIcon={<ContentCutIcon fontSize="small" />}
          onClick={() => handleOpenServicios(empleado)}
          sx={{ fontWeight: 700, backgroundColor: '#1976d2', fontSize: '0.8rem' }}
        >
          Servicios
        </Button>
        <Tooltip title="Editar datos del empleado">
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleEditarEmpleado(empleado)}
            sx={{ fontWeight: 700, minWidth: 44, borderColor: '#4caf50', color: '#81c784' }}
          >
            <EditIcon fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Eliminar empleado">
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleOpenEliminar(empleado)}
            sx={{ fontWeight: 700, minWidth: 44, borderWidth: 1.5 }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '1200px', lg: '1450px', xl: '1600px' },
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px' }}>
              GESTIÓN DE EMPLEADOS
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Alta, modificación, baja y vinculación de servicios del personal
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/home-staff')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Volver a Turnos
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/empleados-dueno/newEmployee')}
              sx={{ backgroundColor: '#1976d2', fontWeight: 700 }}
            >
              Nuevo Empleado
            </Button>
          </Box>
        </Box>

        {/* MOBILE: CARDS (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {empleados.map((empleado) => (
            <EmpleadoCard key={empleado.id} empleado={empleado} />
          ))}
        </Box>

        {/* DESKTOP: TABLE (≥ md) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Empleado / Cargo</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Servicios Habilitados</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {empleados.map((empleado) => (
                  <TableRow key={empleado.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography sx={{ color: 'white', fontWeight: 700 }}>{empleado.nombre}</Typography>
                      <Typography variant="caption" sx={{ color: '#90caf9' }}>{empleado.rol || 'Barbero'}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                      <Typography variant="body2">{empleado.email}</Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Tel: {empleado.telefono}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {empleado.servicios?.length > 0 ? (
                          empleado.servicios.map((srv) => (
                            <Chip
                              key={srv}
                              label={srv}
                              size="small"
                              variant="outlined"
                              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontSize: '11px' }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                            Sin servicios vinculados
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Vincular servicios">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<ContentCutIcon fontSize="small" />}
                            onClick={() => handleOpenServicios(empleado)}
                            sx={{ fontWeight: 700, fontSize: '0.75rem', backgroundColor: '#1976d2' }}
                          >
                            Servicios
                          </Button>
                        </Tooltip>

                        <Tooltip title="Modificar datos del empleado">
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<EditIcon fontSize="small" />}
                            onClick={() => handleEditarEmpleado(empleado)}
                            sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                          >
                            Editar
                          </Button>
                        </Tooltip>

                        <Tooltip title="Eliminar empleado">
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleOpenEliminar(empleado)}
                            sx={{ fontWeight: 700, minWidth: 36, px: 1, borderWidth: 1.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* BOTÓN VOLVER */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
          >
            ← Volver a Turnos
          </Button>
        </Box>
      </Paper>

      {/* MODAL CUU 10.3: ELIMINAR EMPLEADO */}
      <Dialog
        open={modalEliminarOpen}
        onClose={() => setModalEliminarOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '460px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: '#ef5350', fontWeight: 800, textAlign: 'center' }}>
          Eliminar Empleado
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
            ¿Estás seguro de que deseás eliminar a <strong style={{ color: '#ff8a80' }}>{empleadoAEliminar?.nombre}</strong>?
          </Typography>

          {/* Camino alternativo 1.a / 1.a.1: Turnos pendientes */}
          {errorEliminar && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorEliminar}
            </Alert>
          )}

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
            * El sistema valida que el empleado no posea futuros turnos asignados antes de registrar la baja.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setModalEliminarOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleConfirmarEliminar} sx={{ fontWeight: 800 }}>
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CUU 6.4: VINCULAR SERVICIOS */}
      <Dialog
        open={modalServiciosOpen}
        onClose={() => setModalServiciosOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '480px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 800, textAlign: 'center', pb: 1 }}>
          Vincular Servicios al Empleado
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            Seleccioná qué servicios puede prestar el empleado <strong style={{ color: 'white' }}>{empleadoSeleccionado?.nombre}</strong>:
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
            <FormGroup>
              {serviciosDisponibles.map((srv) => {
                const isChecked = serviciosElegidos.includes(srv.name);
                return (
                  <FormControlLabel
                    key={srv.id}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleToggleServicio(srv.name)}
                        sx={{ color: 'rgba(255,255,255,0.6)', '&.Mui-checked': { color: '#1976d2' } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: isChecked ? 700 : 400 }}>
                          {srv.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 600 }}>
                          $ {srv.price.toLocaleString('es-AR')}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      py: 0.5,
                      px: 1,
                      borderRadius: 1,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
                    }}
                  />
                );
              })}
            </FormGroup>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setModalServiciosOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleGuardarServicios}
            sx={{ fontWeight: 800 }}
          >
            Guardar Vinculación
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert severity={snackSeverity} sx={{ width: '100%', fontWeight: 600 }}>
          {snackMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};
