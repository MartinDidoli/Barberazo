import { useState } from 'react';
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
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HomeStaff = () => {
  const navigate = useNavigate();

  // El rol viene determinado por el usuario logueado ('empleado' o 'dueño')
  const rolUsuario = localStorage.getItem('barberazo_role') || 'dueño';
  const nombreUsuario = localStorage.getItem('barberazo_user_name') || (rolUsuario === 'dueño' ? 'Martín Dueño' : 'Franco Barbero');

  // Turnos del día
  const [turnos, setTurnos] = useState([
    { id: 1, cliente: 'Rodrigo Bozio', servicio: 'Corte Degradé', horario: '10:30', monto: '$ 12.000', estado: 'pendiente' },
    { id: 2, cliente: 'Lucas Martino', servicio: 'Cejas y Barba', horario: '11:15', monto: '$ 10.000', estado: 'pendiente' },
    { id: 3, cliente: 'Martín Didoli', servicio: 'Perfilado Barba', horario: '12:00', monto: '$ 8.000', estado: 'cancelado_sin_multa' },
    { id: 4, cliente: 'Alejandro Rozas', servicio: 'Corte Clásico', horario: '12:45', monto: '$ 12.000', estado: 'cancelo_cliente' },
    { id: 5, cliente: 'Mariano López', servicio: 'Corte + Barba', horario: '14:00', monto: '$ 18.000', estado: 'completado' },
  ]);

  // CU 1.3: Confirmar Asistencia (Disponible para Empleado y Dueño)
  const handleMarcarAsistencia = (id, asistio) => {
    setTurnos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, estado: asistio ? 'completado' : 'no_asistio' } : t
      )
    );
  };

  // CU 1.6: Cancelar turno por el local (Exclusivo Dueño, sin multa al cliente)
  const handleCancelarDueno = (id) => {
    setTurnos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, estado: 'cancelado_sin_multa' } : t
      )
    );
  };

  const getStatusChip = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Chip label="Pendiente" size="small" color="warning" sx={{ fontWeight: 600 }} />;
      case 'completado':
        return <Chip label="Asistió (Completado)" size="small" color="success" sx={{ fontWeight: 600 }} />;
      case 'no_asistio':
        return <Chip label="No asistió" size="small" color="error" variant="outlined" sx={{ fontWeight: 600 }} />;
      case 'cancelado_sin_multa':
        return <Chip label="Cancelado por local" size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }} />;
      case 'cancelo_cliente':
        return <Chip label="Canceló cliente" size="small" color="error" sx={{ fontWeight: 600 }} />;
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
          maxWidth: '1050px',
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* ENCABEZADO Y TÍTULO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
                TURNOS DEL DÍA
              </Typography>
              <Chip
                label={rolUsuario === 'dueño' ? 'PANEL DUEÑO' : 'PANEL EMPLEADO'}
                size="small"
                color={rolUsuario === 'dueño' ? 'secondary' : 'info'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
              Sesión activa: <strong style={{ color: 'white' }}>{nombreUsuario}</strong>
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/login')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            Cerrar Sesión
          </Button>
        </Box>

        {/* NAVEGACIÓN SEGÚN ROL */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, pb: 1, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {rolUsuario === 'dueño' && (
            <>
              <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/servicios-dueno')}>Servicios</Button>
              <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/habilitar-fecha')}>Nuevas Fechas</Button>
              <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/empleados-dueno')}>Empleados</Button>
            </>
          )}
          <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/clientes-dueno')}>Clientes</Button>
          <Button variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }} onClick={() => navigate('/reviews')}>Reseñas</Button>
        </Box>

        {/* TABLA DE TURNOS DEL DÍA */}
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
                <TableCell>Cliente</TableCell>
                <TableCell>Servicio</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {turnos.map((turno) => (
                <TableRow key={turno.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 600, color: 'white' }}>{turno.cliente}</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{turno.servicio}</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{turno.horario} hs</TableCell>
                  <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>{turno.monto}</TableCell>
                  <TableCell align="center">{getStatusChip(turno.estado)}</TableCell>
                  <TableCell align="center">
                    
                    {turno.estado === 'pendiente' && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        
                        {/* CU 1.6: Botón de Cancelación exclusivo para Dueño (sin multa) */}
                        {rolUsuario === 'dueño' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ fontSize: '11px', fontWeight: 600 }}
                            onClick={() => handleCancelarDueno(turno.id)}
                          >
                            Cancelar
                          </Button>
                        )}

                        {/* CU 1.3: Asistió y No Asistió (Disponible para Empleado y Dueño) */}
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ 
                            fontSize: '11px', 
                            fontWeight: 600,
                            borderColor: 'rgba(239, 83, 80, 0.5)',
                            color: '#ff8a80',
                            '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.1)' }
                          }}
                          onClick={() => handleMarcarAsistencia(turno.id, false)}
                        >
                          No asistió
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ fontSize: '11px', fontWeight: 600 }}
                          onClick={() => handleMarcarAsistencia(turno.id, true)}
                        >
                          Asistió
                        </Button>
                      </Box>
                    )}

                    {turno.estado !== 'pendiente' && (
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        Turno procesado
                      </Typography>
                    )}

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </Box>
  );
};