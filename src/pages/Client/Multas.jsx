import { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from "react-router-dom";

export const Multas = () => {
  const navigate = useNavigate();

  // Mock de estado para visualización estética inicial
  const [strikes, setStrikes] = useState(2);
  const [multas, setMultas] = useState([
    {
      id: 1,
      fecha: '06/10/2026',
      motivo: 'Cancelación tardía (< 24 horas)',
      monto: '$ 5.000',
      estado: 'Pendiente',
    },
    {
      id: 2,
      fecha: '15/08/2026',
      motivo: 'Acumulación de 3 cancelaciones',
      monto: '$ 5.000',
      estado: 'Pagado',
    },
  ]);

  const tieneMultaPendiente = multas.some(m => m.estado === 'Pendiente');

  const handlePagar = (id) => {
    setMultas(prev => prev.map(m => m.id === id ? { ...m, estado: 'Pagado' } : m));
    alert('¡Pago simulado con éxito! Tu cuenta queda regularizada.');
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '950px',
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
              Revisá tus penalizaciones por cancelaciones fuera de término y regularizá tu situación
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={() => navigate('/appointments')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            Mis Turnos
          </Button>
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
                  label={strikes >= 2 ? 'Riesgo de Multa' : 'Estado Normal'}
                  size="small"
                  color={strikes >= 2 ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1, display: 'block' }}>
                * Al llegar a 3 strikes por cancelar con menos de 24hs se genera una multa.
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
                {tieneMultaPendiente ? 'Aboná la multa pendiente para poder reservar nuevos turnos.' : 'Sin restricciones activas.'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* ALERTA VISIBLE SI ESTÁ MULTADO */}
        {tieneMultaPendiente && (
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.12)', border: '1px solid rgba(239, 83, 80, 0.3)', color: '#ffcdd2' }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Acceso a turnos restringido</AlertTitle>
            Tenés una multa pendiente de pago. Hasta que no la abones, no podrás confirmar nuevas reservas en la barbería.
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
                <TableCell>Motivo</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {multas.map((multa) => (
                <TableRow
                  key={multa.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{multa.fecha}</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{multa.motivo}</TableCell>
                  <TableCell sx={{ color: '#ef5350', fontWeight: 800 }}>{multa.monto}</TableCell>
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
                      <Typography variant="caption" sx={{ color: '#81c784', fontStyle: 'italic' }}>
                        ✓ Regularizado
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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
    </Box>
  );
};