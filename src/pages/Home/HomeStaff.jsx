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
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const HomeStaff = () => {
  const navigate = useNavigate();

  const currentUser = mockStore.getCurrentUser();
  const rolUsuario = currentUser?.role || 'dueño';
  const nombreUsuario = currentUser?.name || (rolUsuario === 'dueño' ? 'Martín Dueño' : 'Franco Barbero');

  // Turnos del día cargados desde el almacén central
  const [turnos, setTurnos] = useState([]);

  const loadTurnos = () => {
    setTurnos(mockStore.getTurnos());
  };

  useEffect(() => {
    loadTurnos();
  }, []);

  // CU 1.3: Confirmar Asistencia (Disponible para Empleado y Dueño)
  const handleMarcarAsistencia = (id, asistio) => {
    mockStore.marcarAsistencia(id, asistio);
    loadTurnos();
  };

  // CU 1.6: Cancelar turno por el local (Exclusivo Dueño, sin multa al cliente)
  const handleCancelarDueno = (id) => {
    mockStore.cancelarTurnoDueno(id);
    loadTurnos();
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
          maxWidth: { xs: '100%', md: '1200px', lg: '1450px', xl: '1600px' },
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
                  <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                    {Array.isArray(turno.servicios) ? turno.servicios.join(' + ') : turno.servicio || 'Servicio'}
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>{turno.horario} hs</TableCell>
                  <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>
                    $ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}
                  </TableCell>
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