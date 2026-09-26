import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HomeStaff = () => {
  const navigate = useNavigate();
  
  // Cambiar 'empleado' por 'dueño' para cambiar la pantalla
  const rolUsuario = 'dueño'; 

  const turnos = [
    { id: 1, cliente: 'Rodrigo Bozio', servicio: 'Barba', horario: '10:30', estado: 'pendiente' },
    { id: 2, cliente: 'Martin Didoli', servicio: 'Pelo', horario: '11:00', estado: 'cancelado_sin_multa' },
    { id: 3, cliente: 'Lucas Martino', servicio: 'Cejas', horario: '11:45', estado: 'pendiente' },
    { id: 4, cliente: 'Alejandro Rozas', servicio: 'Barba', horario: '12:00', estado: 'cancelo_cliente' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: { xs: 2, md: 4 } }}>
      
      <Paper elevation={0} sx={{ width: '100%', maxWidth: '900px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: { xs: 2, md: 4 }, borderRadius: 2 }}>
        
        {/* ENCABEZADO Y NAVEGACIÓN */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          
          {/* Renderizado condicional: Solo si es dueño ve Servicios, Fechas y Empleados */}
          {rolUsuario === 'dueño' && (
            <>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/servicios-dueno')}>SERVICIOS</Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/habilitar-fecha')}>NUEVAS FECHAS</Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>EMPLEADOS</Button>
            </>
          )}
          
          {/* Clientes y Reseñas lo ven ambos */}
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>CLIENTES</Button>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>RESEÑAS</Button>
          
        </Box>

        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
          TURNOS DEL DÍA
        </Typography>

        {/* TABLA DE TURNOS */}
        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(144, 202, 249, 0.2)' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Servicio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Horario</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {turnos.map((turno) => (
                < TableRow key={turno.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ color: 'white' }}>{turno.cliente}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{turno.servicio}</TableCell>
                  <TableCell sx={{ color: 'white' }}>{turno.horario}</TableCell>
                  <TableCell align="center">
                    
                    {/* Botones según el estado del turno */}
                    {turno.estado === 'pendiente' && (
                      < Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        
                        {/* El botón cancelar invoca el CUU 1.6 pero solo si es dueño */}
                        {rolUsuario === 'dueño' && (
                          <Button variant="contained" color="error" size="small">
                            Cancelar
                          </Button>
                        )}
                        
                        {/* Asistió y No asistió (CUU 1.3) lo ven ambos */}
                        <Button variant="contained" size="small" sx={{ backgroundColor: '#ffcccc', color: 'black', '&:hover': { backgroundColor: '#ff9999' } }}>
                          No asistió
                        </Button>
                        <Button variant="contained" color="primary" size="small">
                          Asistió
                        </Button>
                      </Box>
                    )}

                    {turno.estado === 'cancelado_sin_multa' && (
                      < Button variant="contained" disabled sx={{ backgroundColor: 'rgba(255,255,255,0.3) !important', color: 'white !important' }}>
                        Cancelado sin multa
                      </Button>
                    )}

                    {turno.estado === 'cancelo_cliente' && (
                      <Button variant="contained" disabled sx={{ backgroundColor: 'rgba(255,204,204,0.3) !important', color: '#ffcccc !important' }}>
                        Canceló cliente
                      </Button>
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
}