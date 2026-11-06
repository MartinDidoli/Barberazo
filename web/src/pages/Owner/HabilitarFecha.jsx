import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export const HabilitarFecha = () => {
  const navigate = useNavigate();

  // Configuración de fechas de Noviembre 2026
  const [fechasConfig, setFechasConfig] = useState(() => mockStore.getFechasConfig());
  const [selectedDay, setSelectedDay] = useState(24);
  const [horaDesde, setHoraDesde] = useState('08:00');
  const [horaHasta, setHoraHasta] = useState('21:00');

  // Modales
  const [modalDeshabilitarOpen, setModalDeshabilitarOpen] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');

  const [modalAsignarOpen, setModalAsignarOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');
  const [empleadosList, setEmpleadosList] = useState([]);
  const [turnoLaboral, setTurnoLaboral] = useState('09:00 - 17:00'); // Turno del empleado (8hs por defecto)
  const [horaEmpleadoDesde, setHoraEmpleadoDesde] = useState('09:00');
  const [horaEmpleadoHasta, setHoraEmpleadoHasta] = useState('17:00');

  // Notificaciones
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  const loadData = () => {
    const config = mockStore.getFechasConfig();
    setFechasConfig(config);
    setEmpleadosList(mockStore.getEmpleadosList());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Actualizar horas del día al seleccionar en el calendario
  useEffect(() => {
    const diaInfo = fechasConfig[selectedDay];
    if (diaInfo) {
      if (diaInfo.horaDesde) setHoraDesde(diaInfo.horaDesde);
      if (diaInfo.horaHasta) setHoraHasta(diaInfo.horaHasta);
    }
  }, [selectedDay, fechasConfig]);

  const diaActualInfo = fechasConfig[selectedDay] || {
    dia: selectedDay,
    habilitado: true,
    horaDesde: '08:00',
    horaHasta: '21:00',
    empleadosAsignados: [],
  };

  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  // CUU 6.1: Habilitar fecha
  const handleHabilitarFecha = () => {
    mockStore.habilitarFecha(selectedDay, horaDesde || '08:00', horaHasta || '21:00');
    loadData();
    setSnackMessage(`¡Fecha ${selectedDay} de Noviembre habilitada de ${horaDesde} a ${horaHasta} hs!`);
    setSnackSeverity('success');
    setSnackOpen(true);
  };

  // CUU 6.2: Deshabilitar fecha
  const handleOpenDeshabilitar = () => {
    setMotivoCancelacion('');
    setModalDeshabilitarOpen(true);
  };

  const handleConfirmarDeshabilitar = () => {
    mockStore.deshabilitarFecha(selectedDay, motivoCancelacion || 'Cierre extraordinario / Feriado');
    loadData();
    setModalDeshabilitarOpen(false);
    setSnackMessage(`Fecha ${selectedDay} de Noviembre deshabilitada. Turnos cancelados y clientes notificados.`);
    setSnackSeverity('warning');
    setSnackOpen(true);
  };

  // CUU 6.3: Asignar empleado
  const handleOpenAsignar = () => {
    setEmpleadoSeleccionado(empleadosList[0]?.nombre || 'Franco Barbero');
    setHoraEmpleadoDesde('09:00');
    setHoraEmpleadoHasta('17:00');
    setTurnoLaboral('09:00 - 17:00 (Turno Mañana/Tarde - 8 hs)');
    setModalAsignarOpen(true);
  };

  const handleConfirmarAsignar = () => {
    if (!empleadoSeleccionado) return;
    const rangoAsignado = `${horaEmpleadoDesde} - ${horaEmpleadoHasta}`;
    mockStore.asignarEmpleadoAFecha(selectedDay, empleadoSeleccionado, rangoAsignado);
    loadData();
    setModalAsignarOpen(false);
    setSnackMessage(`Empleado ${empleadoSeleccionado} asignado para el ${selectedDay} de Noviembre en el turno ${rangoAsignado} hs.`);
    setSnackSeverity('info');
    setSnackOpen(true);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '1150px', lg: '1350px', xl: '1500px' },
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
              HABILITAR / DESHABILITAR FECHAS Y HORARIOS
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Configuración del calendario laboral, rangos horarios y asignación de personal
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            ← Volver a Turnos
          </Button>
        </Box>

        {/* ALERTA DE ESTADO DEL DÍA */}
        <Box>
          {diaActualInfo.habilitado ? (
            <Alert severity="success" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.12)', border: '1px solid rgba(76, 175, 80, 0.3)', color: '#c8e6c9' }}>
              <strong>Día Habilitado:</strong> El día {selectedDay} de Noviembre está habilitado para reservas entre las {diaActualInfo.horaDesde} y {diaActualInfo.horaHasta} hs.
              {diaActualInfo.empleadosAsignados?.length > 0 && (
                <span> Personal asignado: <strong>{diaActualInfo.empleadosAsignados.join(', ')}</strong></span>
              )}
            </Alert>
          ) : (
            <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.12)', border: '1px solid rgba(239, 83, 80, 0.3)', color: '#ffcdd2' }}>
              <strong>Día Deshabilitado:</strong> El día {selectedDay} de Noviembre no admite turnos. Motivo: <em>"{diaActualInfo.motivoCancelacion || 'Cerrado'}"</em>.
            </Alert>
          )}
        </Box>

        {/* CONTENEDOR 2 COLUMNAS (CALENDARIO + FORMULARIO) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* COLUMNA IZQUIERDA: CALENDARIO */}
          <Box sx={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
              CALENDARIO - NOVIEMBRE 2026
            </Typography>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Cabecera */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#90caf9', fontSize: '15px' }}>
                  Noviembre 2026
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip size="small" label="Habilitado" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.2)', color: '#81c784', border: '1px solid #4caf50', fontSize: '11px' }} />
                  <Chip size="small" label="Deshabilitado" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.2)', color: '#e57373', border: '1px solid #ef5350', fontSize: '11px' }} />
                </Box>
              </Box>

              {/* Días de la semana */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, textAlign: 'center', mb: 1 }}>
                {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((d, index) => (
                  <Typography key={index} variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                    {d}
                  </Typography>
                ))}
              </Box>

              {/* Grilla de días */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.8 }}>
                {daysInMonth.map((day) => {
                  const isSelected = selectedDay === day;
                  const diaInfo = fechasConfig[day];
                  const isHabilitado = diaInfo ? diaInfo.habilitado : true;

                  return (
                    <Box
                      key={day}
                      onClick={() => handleSelectDay(day)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '42px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: isSelected ? 800 : 600,
                        backgroundColor: isSelected
                          ? '#1976d2'
                          : isHabilitado
                            ? 'rgba(76, 175, 80, 0.08)'
                            : 'rgba(239, 83, 80, 0.08)',
                        color: isSelected
                          ? 'white'
                          : isHabilitado
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.35)',
                        border: isSelected
                          ? '2px solid #42a5f5'
                          : isHabilitado
                            ? '1px solid rgba(76, 175, 80, 0.3)'
                            : '1px solid rgba(239, 83, 80, 0.3)',
                        '&:hover': {
                          borderColor: '#42a5f5',
                          backgroundColor: isSelected ? '#1976d2' : 'rgba(255, 255, 255, 0.1)',
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{day}</span>
                      <Box
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'white' : isHabilitado ? '#4caf50' : '#ef5350',
                          mt: 0.2,
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              * Hacé clic en cualquier fecha para consultar o editar sus horarios de atención y asignaciones.
            </Typography>
          </Box>

          {/* COLUMNA DERECHA: DATOS DE LA FECHA Y ACCIONES */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5, justifyContent: 'center' }}>
            
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                Fecha Seleccionada
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                disabled
                value={`${selectedDay} de Noviembre, 2026`}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: 'white',
                    fontWeight: 700,
                  },
                }}
              />
            </Box>

            {/* RANGO HORARIO */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Hora desde:
                </Typography>
                <TextField
                  type="time"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={horaDesde}
                  onChange={(e) => setHoraDesde(e.target.value)}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, display: 'block', mb: 0.5 }}>
                  Hora hasta:
                </Typography>
                <TextField
                  type="time"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={horaHasta}
                  onChange={(e) => setHoraHasta(e.target.value)}
                />
              </Box>
            </Box>

            {/* BOTONES HABILITAR / DESHABILITAR (CUU 6.1 Y 6.2) */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Tooltip title="Inhabilita la fecha y cancela turnos con aviso">
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<BlockIcon />}
                  onClick={handleOpenDeshabilitar}
                  sx={{ fontWeight: 800, py: 1.2 }}
                >
                  Deshabilitar
                </Button>
              </Tooltip>

              <Tooltip title="Habilita la fecha con el rango horario especificado">
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<CheckCircleIcon />}
                  onClick={handleHabilitarFecha}
                  sx={{ fontWeight: 800, py: 1.2 }}
                >
                  Habilitar
                </Button>
              </Tooltip>
            </Box>

            {/* BOTÓN ASIGNAR EMPLEADO (CUU 6.3) */}
            <Button
              variant="contained"
              fullWidth
              startIcon={<PersonAddAlt1Icon />}
              onClick={handleOpenAsignar}
              sx={{
                backgroundColor: '#1976d2',
                color: 'white',
                fontWeight: 800,
                py: 1.2,
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              Asignar Empleado
            </Button>

            {/* RESUMEN DE EMPLEADOS ASIGNADOS AL DÍA */}
            <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1, fontWeight: 700 }}>
                PERSONAL DE TURNO ASIGNADO PARA EL DÍA:
              </Typography>
              {diaActualInfo.empleadosAsignados?.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {diaActualInfo.empleadosAsignados.map((emp) => (
                    <Chip key={emp} label={emp} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                  ))}
                </Box>
              ) : (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  Sin empleados asignados a este día todavía.
                </Typography>
              )}
            </Paper>

          </Box>
        </Box>
      </Paper>

      {/* POP-UP MOTIVO DESHABILITACIÓN (CUU 6.2) */}
      <Dialog
        open={modalDeshabilitarOpen}
        onClose={() => setModalDeshabilitarOpen(false)}
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
          Deshabilitar Fecha
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Estás por deshabilitar el <strong>{selectedDay} de Noviembre</strong>. Se cancelarán automáticamente los turnos agendados y se notificará a los clientes.
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Ingrese motivo de deshabilitación (ej: Feriado nacional, mantenimiento)..."
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setModalDeshabilitarOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Volver
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleConfirmarDeshabilitar} sx={{ fontWeight: 800 }}>
            Confirmar Deshabilitación
          </Button>
        </DialogActions>
      </Dialog>

      {/* POP-UP ASIGNAR EMPLEADO (CUU 6.3) */}
      <Dialog
        open={modalAsignarOpen}
        onClose={() => setModalAsignarOpen(false)}
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
          ASIGNAR EMPLEADO
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Fecha:</Typography>
              <TextField fullWidth size="small" disabled value={`${selectedDay} de Noviembre, 2026`} sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'white', fontWeight: 700 } }} />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Horario de Atención del Local:</Typography>
              <TextField fullWidth size="small" disabled value={`${horaDesde} - ${horaHasta} hs`} sx={{ '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#90caf9' } }} />
            </Box>

            {/* RANGO HORARIO LABORAL DEL EMPLEADO (8hs / Medio tiempo) */}
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                Jornada Laboral del Empleado:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Entrada:</Typography>
                  <TextField
                    type="time"
                    size="small"
                    fullWidth
                    value={horaEmpleadoDesde}
                    onChange={(e) => setHoraEmpleadoDesde(e.target.value)}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Salida:</Typography>
                  <TextField
                    type="time"
                    size="small"
                    fullWidth
                    value={horaEmpleadoHasta}
                    onChange={(e) => setHoraEmpleadoHasta(e.target.value)}
                  />
                </Box>
              </Box>
              
              {/* Presets rápidos de turnos saludables */}
              <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="Mañana (08:30 - 14:30 · 6 hs)"
                  size="small"
                  variant="outlined"
                  onClick={() => { setHoraEmpleadoDesde('08:30'); setHoraEmpleadoHasta('14:30'); }}
                  sx={{ cursor: 'pointer', fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}
                />
                <Chip
                  label="Completo (09:00 - 17:00 · 8 hs)"
                  size="small"
                  variant="outlined"
                  onClick={() => { setHoraEmpleadoDesde('09:00'); setHoraEmpleadoHasta('17:00'); }}
                  sx={{ cursor: 'pointer', fontSize: '10px', color: '#90caf9', borderColor: '#1976d2' }}
                />
                <Chip
                  label="Tarde/Cierre (13:00 - 21:00 · 8 hs)"
                  size="small"
                  variant="outlined"
                  onClick={() => { setHoraEmpleadoDesde('13:00'); setHoraEmpleadoHasta('21:00'); }}
                  sx={{ cursor: 'pointer', fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Seleccionar Empleado:</Typography>
              <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                <Select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                  sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.05)' }}
                >
                  {empleadosList.map((emp) => (
                    <MenuItem key={emp.id} value={emp.nombre}>
                      {emp.nombre} ({emp.rol || 'Barbero'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="contained" color="error" fullWidth onClick={() => setModalAsignarOpen(false)} sx={{ fontWeight: 800 }}>
            Volver
          </Button>
          <Button variant="contained" color="success" fullWidth onClick={handleConfirmarAsignar} sx={{ fontWeight: 800 }}>
            Confirmar
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
