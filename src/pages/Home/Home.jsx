import { useState } from 'react';
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
  Divider,
  Alert,
  AlertTitle,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const Home = () => {
  const navigate = useNavigate();

  // Verificamos usuario y si está en estado "Multado"
  const currentUser = mockStore.getCurrentUser();
  const userName = currentUser?.name || 'Rodrigo Bozio';
  const isMultado = currentUser?.status === 'Multado';

  // Lista de servicios disponibles con precio y duración en minutos
  const servicesList = [
    { id: 1, name: 'Perfilado de Barba', price: 8000, duration: 20 },
    { id: 2, name: 'Corte de Pelo', price: 12000, duration: 30 },
    { id: 3, name: 'Diseño de Cejas', price: 5000, duration: 15 },
    { id: 4, name: 'Lavado y Peinado', price: 6000, duration: 15 },
  ];

  // Selección múltiple de servicios (por defecto Corte de Pelo)
  const [selectedServices, setSelectedServices] = useState([servicesList[1]]);
  const [selectedTime, setSelectedTime] = useState('18:40');
  const [observations, setObservations] = useState('');
  
  // Calendario interactivo (Octubre 2026)
  const [currentMonth, setCurrentMonth] = useState('Octubre 2026');
  const [selectedDay, setSelectedDay] = useState(12);

  // Modal de confirmación (CU 1.2)
  const [openModal, setOpenModal] = useState(false);

  // Horarios disponibles
  const timesList = ['10:00', '11:30', '12:15', '15:00', '18:40', '19:30'];

  // Días del calendario (Octubre 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Toggle de selección múltiple de servicios
  const handleToggleService = (srv) => {
    if (isMultado) return;
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.id === srv.id);
      if (exists) {
        // Mantiene al menos un servicio seleccionado
        if (prev.length === 1) return prev;
        return prev.filter((s) => s.id !== srv.id);
      } else {
        return [...prev, srv];
      }
    });
  };

  // Cálculos automáticos de monto y duración
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Barbero asignado automáticamente por disponibilidad
  const assignedBarber = 'Franco Barbero';

  const handleOpenConfirm = () => {
    if (isMultado) return;
    setOpenModal(true);
  };

  const handleConfirmReservation = () => {
    mockStore.crearTurno({
      servicios: selectedServices,
      barbero: assignedBarber,
      fecha: `${selectedDay} de Octubre, 2026`,
      horario: selectedTime,
      monto: totalAmount,
      duracion: totalDuration,
      observaciones: observations,
    });
    setOpenModal(false);
    // Redirige a Mis Turnos
    navigate('/appointments');
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '1100px', lg: '1350px', xl: '1500px' },
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* ENCABEZADO Y NAVEGACIÓN CLIENTE */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
              RESERVAR TURNO
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Hola, <strong style={{ color: 'white' }}>{userName}</strong>. Seleccioná fecha, horario y servicios
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/appointments')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Mis Turnos
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/Multas')}
              sx={{ 
                borderColor: isMultado ? '#ef5350' : 'rgba(255,255,255,0.3)', 
                color: isMultado ? '#ff8a80' : 'white',
                fontWeight: isMultado ? 700 : 500
              }}
            >
              Multas {isMultado && '(!)'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/profile')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Perfil
            </Button>
          </Box>
        </Box>

        {/* ALERTA DE BLOQUEO SI EL CLIENTE ESTÁ MULTADO */}
        {isMultado && (
          <Alert 
            severity="error" 
            sx={{ 
              backgroundColor: 'rgba(239, 83, 80, 0.12)', 
              border: '1px solid rgba(239, 83, 80, 0.35)',
              color: '#ffcdd2'
            }}
            action={
              <Button color="error" size="small" variant="contained" onClick={() => navigate('/Multas')}>
                Ir a Pagar
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>⛔ Reserva bloqueada por estado MULTADO</AlertTitle>
            Tenés penalizaciones pendientes por cancelaciones tardías acumuladas. Regularizá tu cuenta en la sección de multas para poder solicitar nuevos turnos.
          </Alert>
        )}

        {/* CUERPO PRINCIPAL (2 COLUMNAS) */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* COLUMNA IZQUIERDA: CALENDARIO Y MONTO */}
          <Box sx={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
              1. SELECCIONÁ LA FECHA
            </Typography>

            <Paper
              sx={{
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Cabecera del mes */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontWeight: 700, color: '#90caf9', fontSize: '15px' }}>
                  {currentMonth}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" sx={{ minWidth: '32px', color: 'rgba(255,255,255,0.7)' }}>‹</Button>
                  <Button size="small" sx={{ minWidth: '32px', color: 'rgba(255,255,255,0.7)' }}>›</Button>
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
                <Box sx={{ p: 1 }} />
                <Box sx={{ p: 1 }} />
                <Box sx={{ p: 1 }} />
                <Box sx={{ p: 1 }} />

                {daysInMonth.map((day) => {
                  const isSelected = selectedDay === day;
                  const isPast = day < 6;
                  return (
                    <Box
                      key={day}
                      onClick={() => !isPast && !isMultado && setSelectedDay(day)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '36px',
                        borderRadius: '8px',
                        cursor: isPast || isMultado ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: isSelected ? 800 : 500,
                        backgroundColor: isSelected
                          ? '#1976d2'
                          : isPast
                          ? 'transparent'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isSelected
                          ? 'white'
                          : isPast
                          ? 'rgba(255, 255, 255, 0.2)'
                          : 'white',
                        border: isSelected
                          ? '1px solid #42a5f5'
                          : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: !isPast && !isSelected ? 'rgba(255, 255, 255, 0.1)' : undefined,
                        },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {day}
                    </Box>
                  );
                })}
              </Box>
            </Paper>

            {/* MONTO Y DURACIÓN ESTIMADA (AUTOCOMPLETADO) */}
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                border: '1px solid rgba(25, 118, 210, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontWeight: 600 }}>
                  MONTO TOTAL
                </Typography>
                <Typography variant="h5" sx={{ color: '#90caf9', fontWeight: 800 }}>
                  $ {totalAmount.toLocaleString('es-AR')}
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', fontWeight: 600 }}>
                  DURACIÓN ESTIMADA
                </Typography>
                <Chip
                  label={`⏱ ${totalDuration} minutos`}
                  size="small"
                  color="info"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              * El barbero se asignará automáticamente según disponibilidad horaria.
            </Typography>

          </Box>

          {/* COLUMNA DERECHA: SERVICIOS MÚLTIPLES, HORARIOS Y CONFIRMAR */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            {/* SERVICIOS CON MULTISELECCIÓN */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
                  2. SERVICIOS (MULTISELECCIÓN)
                </Typography>
                <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 600 }}>
                  {selectedServices.length} seleccionado{selectedServices.length > 1 ? 's' : ''}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {servicesList.map((srv) => {
                  const isSelected = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <Paper
                      key={srv.id}
                      onClick={() => handleToggleService(srv)}
                      sx={{
                        p: 1.5,
                        textAlign: 'center',
                        cursor: isMultado ? 'not-allowed' : 'pointer',
                        borderRadius: 2,
                        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.22)' : 'rgba(255, 255, 255, 0.03)',
                        borderColor: isSelected ? '#1976d2' : 'rgba(255, 255, 255, 0.15)',
                        borderWidth: isSelected ? '2px' : '1px',
                        '&:hover': {
                          borderColor: isSelected ? '#42a5f5' : 'rgba(255, 255, 255, 0.3)',
                        },
                        transition: 'all 0.15s ease',
                        position: 'relative',
                      }}
                    >
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '13px' }}>
                        {isSelected ? '✓ ' : ''}{srv.name}
                      </Typography>
                      <Typography sx={{ color: '#90caf9', fontWeight: 600, fontSize: '12px', mt: 0.5 }}>
                        $ {srv.price.toLocaleString('es-AR')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '10px' }}>
                        ~ {srv.duration} min
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </Box>

            {/* HORARIOS */}
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                3. HORARIO DE INICIO
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {timesList.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? 'contained' : 'outlined'}
                      disabled={isMultado}
                      onClick={() => setSelectedTime(time)}
                      sx={{
                        minWidth: '70px',
                        backgroundColor: isSelected ? '#1976d2' : 'transparent',
                        borderColor: isSelected ? '#1976d2' : 'rgba(255,255,255,0.3)',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {time}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* OBSERVACIONES */}
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                4. OBSERVACIONES (OPCIONAL)
              </Typography>
              <TextField
                multiline
                rows={2}
                fullWidth
                disabled={isMultado}
                placeholder="Aclaraciones sobre el corte, preferencias..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </Box>

            {/* BOTÓN CONFIRMAR (CU 1.2) */}
            <Box sx={{ mt: 'auto', pt: 1.5 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={isMultado}
                onClick={handleOpenConfirm}
                sx={{
                  backgroundColor: '#1976d2',
                  padding: '12px',
                  fontWeight: 800,
                  fontSize: '15px',
                  letterSpacing: '0.5px',
                }}
              >
                {isMultado ? 'Bloqueado por Multa' : 'Confirmar'}
              </Button>
            </Box>

          </Box>

        </Box>

        {/* MODAL DE CONFIRMACIÓN DE RESERVA (CU 1.2) */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          slotProps={{
            paper: {
              sx: {
                width: '100%',
                maxWidth: '480px',
                p: 1.5,
                borderRadius: 3,
              },
            },
          }}
        >
          <DialogTitle sx={{ color: 'white', fontWeight: 800, textAlign: 'center', pb: 1 }}>
            Confirmar Reserva de Turno
          </DialogTitle>
          
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', mb: 2 }}>
              Por favor revisá los detalles antes de agendar tu turno:
            </Typography>

            <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Servicios:</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  {selectedServices.map((s) => (
                    <Typography key={s.id} variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                      {s.name} ($ {s.price.toLocaleString('es-AR')})
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Barbero:</Typography>
                <Typography variant="body2" sx={{ color: '#90caf9', fontWeight: 700 }}>
                  {assignedBarber} (Autoasignado)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Fecha:</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>{selectedDay} de Octubre, 2026</Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Horario:</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                  {selectedTime} hs (~{totalDuration} min)
                </Typography>
              </Box>

              {observations && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Observaciones:</Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic' }}>{observations}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 800 }}>Monto total:</Typography>
                <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 800 }}>
                  $ {totalAmount.toLocaleString('es-AR')}
                </Typography>
              </Box>
            </Paper>

            <Alert severity="info" sx={{ mt: 2, fontSize: '11px', backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#90caf9' }}>
              ℹ Recordá que las cancelaciones con menos de 24 hs de anticipación generan strikes de penalización.
            </Alert>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => setOpenModal(false)}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Modificar
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleConfirmReservation}
              sx={{ backgroundColor: '#1976d2', fontWeight: 700 }}
            >
              Confirmar Turno
            </Button>
          </DialogActions>
        </Dialog>

      </Paper>
    </Box>
  );
};