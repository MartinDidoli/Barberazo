import { useState, useEffect } from 'react';
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const Appointments = () => {
  const navigate = useNavigate();

  const [turnos, setTurnos] = useState([]);
  const [multaModalOpen, setMultaModalOpen] = useState(false);
  const [alertNotice, setAlertNotice] = useState(null);

  // Cargar turnos del usuario actual
  useEffect(() => {
    setTurnos(mockStore.getTurnosForCurrentUser());
  }, []);

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

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Chip label="Pendiente" size="small" color="warning" sx={{ fontWeight: 600 }} />;
      case 'completado':
        return <Chip label="Completado" size="small" color="success" sx={{ fontWeight: 600 }} />;
      case 'cancelado_cliente':
        return <Chip label="Cancelado por vos" size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />;
      case 'cancelado_sin_multa':
        return <Chip label="Cancelado por el local" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }} />;
      default:
        return <Chip label={estado} size="small" />;
    }
  };

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
        {/* ENCABEZADO Y NAVEGACIÓN */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px' }}>
              MIS TURNOS
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Consultá el historial y administrá tus reservas
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{ backgroundColor: '#1976d2', fontWeight: 'bold' }}
            >
              + Nuevo Turno
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/Multas')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Ver Multas
            </Button>
          </Box>
        </Box>

        {/* NOTIFICACIÓN DE STRIKE */}
        {alertNotice && (
          <Alert 
            severity={alertNotice.severity} 
            onClose={() => setAlertNotice(null)}
            sx={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {alertNotice.text}
          </Alert>
        )}

        {/* TABLA DE TURNOS */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
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
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                    No tenés turnos registrados en este momento.
                  </TableCell>
                </TableRow>
              ) : (
                turnos.map((turno) => {
                  const serviciosText = Array.isArray(turno.servicios)
                    ? turno.servicios.join(' + ')
                    : turno.servicio || 'Servicio';
                  const reviewVencida = turnoVencidoPorResena(turno);
                  const reviewEnviada = turno.estado === 'completado' && turno.resenaDejada && !reviewVencida;

                  return (
                    <TableRow
                      key={turno.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.2s ease',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: 'white' }}>
                        {serviciosText}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        {turno.barbero}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        {turno.fecha} — {turno.horario} hs
                      </TableCell>
                      <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>
                        $ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(turno.estado)}
                      </TableCell>
                      <TableCell align="center">
                        {/* CU 1.5: CANCELAR TURNO */}
                        {turno.estado === 'pendiente' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ fontSize: '12px', fontWeight: 600 }}
                            onClick={() => handleCancelar(turno.id)}
                          >
                            Cancelar
                          </Button>
                        )}

                        {/* CU 1.4: DEJAR RESEÑA */}
                        {turno.estado === 'completado' && !turno.resenaDejada && !reviewVencida && (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ fontSize: '12px', fontWeight: 600 }}
                            onClick={() => navigate('/add-review', { state: { turno } })}
                          >
                            Dejar reseña
                          </Button>
                        )}

                        {turno.estado === 'completado' && reviewEnviada && (
                          <Typography variant="caption" sx={{ color: '#81c784', fontStyle: 'italic', fontWeight: 600 }}>
                            ✓ Reseña enviada
                          </Typography>
                        )}

                        {turno.estado.startsWith('cancelado') && (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Sin acciones
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PIE DE PÁGINA */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
          >
            ← Volver al Inicio
          </Button>
        </Box>
      </Paper>

      {/* MODAL DE ADVERTENCIA POR ALCANZAR 3 STRIKES (CU 1.5) */}
      <Dialog
        open={multaModalOpen}
        onClose={() => setMultaModalOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '460px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#1c1917',
              border: '1px solid #ef5350',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: '#ef5350', fontWeight: 800, textAlign: 'center' }}>
          ⚠️ Límite de Strikes Alcanzado
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'white', textAlign: 'center', mb: 2 }}>
            Acumulaste <strong>3 cancelaciones con menos de 24 horas de anticipación</strong>.
          </Typography>
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.15)', color: '#ffcdd2' }}>
            Se ha emitido una multa de <strong>$ 5.000</strong> a tu nombre. Tu cuenta pasa al estado <strong>MULTADO</strong> y se bloquea la reserva de nuevos turnos hasta abonar la penalización.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setMultaModalOpen(false)}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            Entendido
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => {
              setMultaModalOpen(false);
              navigate('/Multas');
            }}
            sx={{ fontWeight: 700 }}
          >
            Ir a Pagar Multa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
