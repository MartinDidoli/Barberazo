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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Appointments = () => {
  const navigate = useNavigate();

  // Mock inicial de turnos del cliente para previsualización estética
  const [turnos, setTurnos] = useState([
    {
      id: 1,
      servicio: "Corte de Pelo Degradé",
      barbero: "Franco Barbero",
      fecha: "10/10/2026",
      horario: "18:40",
      monto: "$ 12.000",
      estado: "pendiente", // pendiente, completado, cancelado_cliente
      horasRestantes: 18, // < 24hs para simular regla de strike
    },
    {
      id: 2,
      servicio: "Perfilado de Barba",
      barbero: "Lucas Martino",
      fecha: "05/10/2026",
      horario: "12:00",
      monto: "$ 8.000",
      estado: "completado",
      resenaDejada: false,
    },
    {
      id: 3,
      servicio: "Corte + Barba Completo",
      barbero: "Franco Barbero",
      fecha: "28/09/2026",
      horario: "15:30",
      monto: "$ 18.000",
      estado: "completado",
      resenaDejada: true,
    },
    {
      id: 4,
      servicio: "Diseño de Cejas",
      barbero: "Martín Barbero",
      fecha: "15/09/2026",
      horario: "11:00",
      monto: "$ 6.000",
      estado: "cancelado_cliente",
    },
  ]);

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
          maxWidth: '1000px',
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
                <TableCell>Servicio</TableCell>
                <TableCell>Barbero</TableCell>
                <TableCell>Fecha & Horario</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {turnos.map((turno) => (
                <TableRow
                  key={turno.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>
                    {turno.servicio}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    {turno.barbero}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    {turno.fecha} — {turno.horario} hs
                  </TableCell>
                  <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>
                    {turno.monto}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(turno.estado)}
                  </TableCell>
                  <TableCell align="center">
                    {/* ACCIONES CONDICIONALES SEGÚN CASO DE USO */}
                    {turno.estado === 'pendiente' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ fontSize: '12px', fontWeight: 600 }}
                        onClick={() => {
                          // Simulación visual de cancelación
                          alert(`Se cancelará el turno. ${turno.horasRestantes < 24 ? 'Atención: Restan menos de 24 horas, sumará 1 strike.' : ''}`);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}

                    {turno.estado === 'completado' && !turno.resenaDejada && (
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

                    {turno.estado === 'completado' && turno.resenaDejada && (
                      <Typography variant="caption" sx={{ color: '#81c784', fontStyle: 'italic' }}>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PIE DE PÁGINA / BOTÓN VOLVER */}
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
