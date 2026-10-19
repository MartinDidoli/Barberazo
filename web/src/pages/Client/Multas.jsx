import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Snackbar,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const Multas = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(mockStore.getCurrentUser());
  const [multas, setMultas] = useState([]);
  const [snackOpen, setSnackOpen] = useState(false);

  const loadData = () => {
    const currentUser = mockStore.getCurrentUser();
    setUser(currentUser);
    setMultas(mockStore.getMultas(currentUser?.email));
  };

  useEffect(() => {
    loadData();
  }, []);

  const tieneMultaPendiente = multas.some(m => m.estado === 'Pendiente');
  const strikes = user?.strikes || 0;

  const handlePagar = (id) => {
    mockStore.pagarMulta(id);
    loadData();
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
              GESTIÓN DE MULTAS Y PENALIZACIONES
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Cliente: <strong style={{ color: 'white' }}>{user?.name}</strong> ({user?.email})
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
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{ backgroundColor: '#1976d2', fontWeight: 700 }}
            >
              Reservar Turno
            </Button>
          </Box>
        </Box>

        {/* TARJETAS DE RESUMEN (STRIKES Y ESTADO) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Strikes Acumulados
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: strikes >= 2 ? '#ffb74d' : 'white' }}>
                  {strikes} / 3
                </Typography>
                <Chip
                  label={strikes >= 3 ? 'Límite Excedido' : strikes === 2 ? 'Riesgo de Multa' : 'Normal'}
                  size="small"
                  color={strikes >= 2 ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1, display: 'block' }}>
                * Cancelar un turno con menos de 24 hs suma 1 strike. Al 3er strike se aplica multa.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Estado de la Cuenta
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: tieneMultaPendiente ? '#ef5350' : '#4caf50' }}>
                  {tieneMultaPendiente ? 'MULTADO' : 'HABILITADO'}
                </Typography>
                <Chip
                  label={tieneMultaPendiente ? 'Turnos bloqueados' : 'Puede reservar'}
                  size="small"
                  color={tieneMultaPendiente ? 'error' : 'success'}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1, display: 'block' }}>
                {tieneMultaPendiente
                  ? 'Aboná la multa pendiente para reactivar el selector de turnos.'
                  : 'Tu cuenta está al día sin penalizaciones pendientes.'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* ALERTA VISIBLE SI ESTÁ MULTADO */}
        {tieneMultaPendiente && (
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.12)', border: '1px solid rgba(239, 83, 80, 0.3)', color: '#ffcdd2' }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Acceso a nuevos turnos restringido</AlertTitle>
            Tenés una multa pendiente de pago. Hasta regularizar tu cuenta mediante el botón "Pagar Multa", no podrás confirmar nuevas reservas en Barberazo.
          </Alert>
        )}

        {/* TABLA DE MULTAS */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Motivo de la Sanción</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {multas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                    No registrás multas en tu historial.
                  </TableCell>
                </TableRow>
              ) : (
                multas.map((multa) => (
                  <TableRow
                    key={multa.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{multa.fecha}</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>{multa.motivo}</TableCell>
                    <TableCell sx={{ color: '#ef5350', fontWeight: 800 }}>
                      $ {Number(multa.monto).toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={multa.estado}
                        size="small"
                        color={multa.estado === 'Pendiente' ? 'error' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {multa.estado === 'Pendiente' ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          sx={{ fontWeight: 700, px: 2.5 }}
                          onClick={() => handlePagar(multa.id)}
                        >
                          Pagar Multa
                        </Button>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#81c784', fontStyle: 'italic', fontWeight: 600 }}>
                          ✓ Pagado / Habilitado
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* BOTÓN VOLVER */}
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

      {/* SNACKBAR DE CONFIRMACIÓN DE PAGO */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        message="¡Pago registrado con éxito! Tu cuenta ha sido regularizada y podés volver a reservar turnos."
      />
    </Box>
  );
};