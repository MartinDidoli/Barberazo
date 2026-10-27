import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import CancelIcon from '@mui/icons-material/Cancel';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import BlockIcon from '@mui/icons-material/Block';

export const Appointments = () => {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState(() => mockStore.getTurnosForCurrentUser());
  const [multaModalOpen, setMultaModalOpen] = useState(false);
  const [alertNotice, setAlertNotice] = useState(null);

  const handleCancelar = (turnoId) => {
    const res = mockStore.cancelarTurnoCliente(turnoId);
    setTurnos(mockStore.getTurnosForCurrentUser());

    if (res.seMulta) {
      setMultaModalOpen(true);
    } else if (res.penalizaStrike) {
      setAlertNotice({
        severity: 'warning',
        text: `Turno cancelado con menos de 24 hs de anticipación. Sumaste 1 strike de penalización (${res.newStrikes}/3). Al llegar a 3 strikes se generará una multa.`,
      });
    } else {
      setAlertNotice({
        severity: 'info',
        text: 'Turno cancelado correctamente (sin penalización por haber sido con más de 24 hs de anticipación).',
      });
    }
  };

  const turnoVencidoPorResena = (turno) => {
    if (!turno || turno.estado !== 'completado') return false;
    const fecha = turno.fecha;
    if (!fecha || typeof fecha !== 'string') return false;
    const match = fecha.match(/^\d{2}\/\d{2}\/\d{4}$/);
    if (!match) return false;
    const [day, month, year] = fecha.split('/').map(Number);
    const turnoDate = new Date(year, month - 1, day);
    const diffDays = Math.floor((new Date().getTime() - turnoDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 30;
  };

  // ===== UNIFIED CHIP SYSTEM - All statuses FILLED with icons =====
  const getStatusChip = (estado) => {
    const chipStyles = {
      size: 'small',
      fontWeight: 700,
      borderRadius: 2,
      sx: { px: 1.5, py: 0.5, fontSize: '0.7rem' },
    };

    switch (estado) {
      case 'pendiente':
        return (
          <Chip label="Pendiente" icon={<InfoIcon fontSize="small" />} color="warning" variant="filled" {...chipStyles} />
        );
      case 'completado':
        return (
          <Chip label="Completado" icon={<CheckCircleIcon fontSize="small" />} color="success" variant="filled" {...chipStyles} />
        );
      case 'cancelado_cliente':
        return (
          <Chip label="Cancelado por vos" icon={<CancelIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />
        );
      case 'cancelado_sin_multa':
        return (
          <Chip label="Cancelado por el local" icon={<BlockIcon fontSize="small" />} color="default" variant="filled" {...chipStyles} />
        );
      default:
        return <Chip label={estado} {...chipStyles} />;
    }
  };

  // ===== MOBILE CARD COMPONENT =====
  const AppointmentCard = ({ turno }) => {
    const serviciosText = Array.isArray(turno.servicios)
      ? turno.servicios.join(' + ')
      : turno.servicio || 'Servicio';
    const reviewVencida = turnoVencidoPorResena(turno);
    const reviewEnviada = turno.estado === 'completado' && turno.resenaDejada && !reviewVencida;

    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.15)' },
        }}
      >
        {/* Top: Service + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {serviciosText}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ p: 0, color: 'rgba(255,255,255,0.5)' }}>
                <RateReviewIcon fontSize="small" />
              </IconButton>
              {turno.barbero}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>{getStatusChip(turno.estado)}</Box>
        </Box>

        {/* Middle: Date/Time + Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.85)' }}>
            <Typography variant="body2">{turno.fecha}</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>—</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{turno.horario} hs</Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 700, whiteSpace: 'nowrap' }}>
            $ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}
          </Typography>
        </Box>

        {/* Bottom: ACTION BUTTONS (touchable, consistent) */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {turno.estado === 'pendiente' && (
            <Tooltip title="Cancelar turno">
              <Button variant="outlined" color="error" startIcon={<CancelIcon fontSize="small" />} size="small" sx={{ flex: 1, minWidth: 120, fontWeight: 700, fontSize: '0.8rem', borderWidth: 2, '&:hover': { borderWidth: 2 } }} onClick={() => handleCancelar(turno.id)}>Cancelar</Button>
            </Tooltip>
          )}
          {turno.estado === 'completado' && !turno.resenaDejada && !reviewVencida && (
            <Tooltip title="Dejar reseña">
              <Button variant="contained" color="primary" startIcon={<RateReviewIcon fontSize="small" />} size="small" sx={{ flex: 1, minWidth: 120, fontWeight: 700, fontSize: '0.8rem' }} onClick={() => navigate('/add-review', { state: { turno } })}>Dejar reseña</Button>
            </Tooltip>
          )}
          {turno.estado === 'completado' && reviewEnviada && (
            <Button variant="filled" color="success" disabled startIcon={<CheckCircleIcon fontSize="small" />} size="small" sx={{ flex: 1, minWidth: 120, fontWeight: 700, fontSize: '0.8rem', opacity: 1 }}>Reseña enviada</Button>
          )}
          {turno.estado.startsWith('cancelado') && (
            <Button variant="outlined" disabled color="default" size="small" sx={{ flex: 1, minWidth: 120, fontWeight: 700, fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>Sin acciones</Button>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
      <Paper elevation={0} sx={{ width: '100%', maxWidth: { xs: '100%', md: '1200px', lg: '1450px', xl: '1600px' }, p: { xs: 2.5, md: 4 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px' }}>MIS TURNOS</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Consultá el historial y administrá tus reservas</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="contained" onClick={() => navigate('/home')} sx={{ backgroundColor: '#1976d2', fontWeight: 'bold' }}>+ Nuevo Turno</Button>
            <Button variant="outlined" onClick={() => navigate('/Multas')} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Ver Multas</Button>
          </Box>
        </Box>

        {alertNotice && (
          <Alert severity={alertNotice.severity} onClose={() => setAlertNotice(null)} sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>{alertNotice.text}</Alert>
        )}

        {/* MOBILE: CARDS (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {turnos.length === 0 ? (
            <Paper elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>No tenés turnos registrados en este momento.</Typography>
            </Paper>
          ) : (
            turnos.map((turno) => <AppointmentCard key={turno.id} turno={turno} />)
          )}
        </Box>

        {/* DESKTOP: TABLE (≥ md) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Servicio(s)</TableCell>
                  <TableCell>Barbero</TableCell>
                  <TableCell>Fecha & Horario</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turnos.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>No tenés turnos registrados en este momento.</TableCell></TableRow>
                ) : (
                  turnos.map((turno) => {
                    const serviciosText = Array.isArray(turno.servicios) ? turno.servicios.join(' + ') : turno.servicio || 'Servicio';
                    const reviewVencida = turnoVencidoPorResena(turno);
                    const reviewEnviada = turno.estado === 'completado' && turno.resenaDejada && !reviewVencida;

                    return (
                      <TableRow key={turno.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s ease' }}>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>{serviciosText}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{turno.barbero}</TableCell>
                        <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{turno.fecha} — {turno.horario} hs</TableCell>
                        <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>$ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}</TableCell>
                        <TableCell align="center">{getStatusChip(turno.estado)}</TableCell>
                        <TableCell align="center">
                          {turno.estado === 'pendiente' && (
                            <Tooltip title="Cancelar turno"><Button variant="outlined" color="error" startIcon={<CancelIcon fontSize="small" />} size="small" sx={{ fontWeight: 700, fontSize: '0.8rem', borderWidth: 2, '&:hover': { borderWidth: 2 } }} onClick={() => handleCancelar(turno.id)}>Cancelar</Button></Tooltip>
                          )}
                          {turno.estado === 'completado' && !turno.resenaDejada && !reviewVencida && (
                            <Tooltip title="Dejar reseña"><Button variant="contained" color="primary" startIcon={<RateReviewIcon fontSize="small" />} size="small" sx={{ fontWeight: 700, fontSize: '0.8rem' }} onClick={() => navigate('/add-review', { state: { turno } })}>Dejar reseña</Button></Tooltip>
                          )}
                          {turno.estado === 'completado' && reviewEnviada && (
                            <Button variant="filled" color="success" disabled startIcon={<CheckCircleIcon fontSize="small" />} size="small" sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 1 }}>Reseña enviada</Button>
                          )}
                          {turno.estado.startsWith('cancelado') && (
                            <Button variant="outlined" disabled color="default" size="small" sx={{ fontWeight: 700, fontSize: '0.8rem', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>Sin acciones</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/home')} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>← Volver al Inicio</Button>
        </Box>
      </Paper>

      {/* STRIKE MODAL (unchanged) */}
      <Dialog open={multaModalOpen} onClose={() => setMultaModalOpen(false)} slotProps={{ paper: { sx: { width: '100%', maxWidth: '460px', p: 2, borderRadius: 3, backgroundColor: '#1c1917', border: '1px solid #ef5350' } } }}>
        <DialogTitle sx={{ color: '#ef5350', fontWeight: 800, textAlign: 'center' }}>⚠️ Límite de Strikes Alcanzado</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>Acumulaste <strong>3 cancelaciones con menos de 24 horas de anticipación</strong>.</Typography>
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.15)', color: '#ffcdd2' }}>Se ha emitido una multa de <strong>$ 5.000</strong> a tu nombre. Tu cuenta pasa al estado <strong>MULTADO</strong> y se bloquea la reserva de nuevos turnos hasta abonar la penalización.</Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1, display: 'flex', gap: 1 }}>
          <Button variant="outlined" fullWidth onClick={() => setMultaModalOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>Entendido</Button>
          <Button variant="contained" color="error" fullWidth onClick={() => { setMultaModalOpen(false); navigate('/Multas'); }} sx={{ fontWeight: 700 }}>Ir a Pagar Multa</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};