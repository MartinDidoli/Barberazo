import { useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogContent, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ClientesDueno = () => {
  const navigate = useNavigate();
  
  const [openModal, setOpenModal] = useState(false);

  const clientes = [
    { id: 1, nombre: 'Rodrigo Bozio', telefono: '115135', email: 'untipazo@utn.com', estado: 'activo' },
    { id: 2, nombre: 'Mateo Bertin', telefono: '2352352352', email: 'elcap@utn.com', estado: 'activo' },
    { id: 3, nombre: 'Lucas Martino', telefono: '232524524', email: 'elbarba@utn.com', estado: 'activo' },
    { id: 4, nombre: 'Alejandro Rozas', telefono: '5675685685', email: 'elprofe@utn.com', estado: 'bloqueado' },
  ];

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#007bff' }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: { xs: 2, md: 4 } }}>
      
      <Paper elevation={0} sx={{ width: '100%', maxWidth: '900px', backgroundColor: 'transparent', border: { xs: 'none', md: '1px solid rgba(255,255,255,0.2)' }, padding: { xs: 1, md: 4 }, borderRadius: 2 }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          {/* Flecha volver (Mobile) */}
          <Button onClick={() => navigate('/home-staff')} sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', fontSize: '24px', minWidth: '40px', p: 0 }}>
            ←
          </Button>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
            CLIENTES
          </Typography>
        </Box>

        {/* VISTA DESKTOP (Tabla) */}
        <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' }, backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(144, 202, 249, 0.2)' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Nombre y Apellido</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Telefono</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Email</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell sx={{ color: 'white', textAlign: 'center' }}>{cliente.nombre}</TableCell>
                  <TableCell sx={{ color: 'white', textAlign: 'center' }}>{cliente.telefono}</TableCell>
                  <TableCell sx={{ color: 'white', textAlign: 'center' }}>{cliente.email}</TableCell>
                  <TableCell align="center">
                    {cliente.estado === 'activo' ? (
                      <Button variant="contained" color="error" onClick={() => setOpenModal(true)} sx={{ fontWeight: 'bold' }}>
                        Bloquear
                      </Button>
                    ) : (
                      <Button variant="contained" color="success" onClick={() => alert('Invoca CUU 5.2')} sx={{ fontWeight: 'bold' }}>
                        Desbloquear
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* VISTA MOBILE (Lista apilada) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 3 }}>
          {clientes.map((cliente) => (
            <Box key={cliente.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.2)', pb: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ color: 'white' }}><strong>NOMBRE Y APELLIDO:</strong> {cliente.nombre}</Typography>
              <Typography sx={{ color: 'white' }}><strong>TELEFONO:</strong> {cliente.telefono}</Typography>
              <Typography sx={{ color: 'white' }}><strong>EMAIL:</strong>< br/>{cliente.email}</Typography>
              
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                {cliente.estado === 'activo' ? (
                  <Button variant="contained" color="error" onClick={() => setOpenModal(true)} sx={{ fontWeight: 'bold', width: '150px' }}>
                    Bloquear
                  </Button>
                ) : (
                  <Button variant="contained" color="success" onClick={() => alert('Invoca CUU 5.2')} sx={{ fontWeight: 'bold', width: '150px' }}>
                    Desbloquear
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Botón Volver Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mt: 4 }}>
          <Button variant="contained" onClick={() => navigate('/home-staff')} sx={{ backgroundColor: '#ffcccc', color: 'black', '&:hover': { backgroundColor: '#ffb3b3' }, fontWeight: 'bold', width: '120px' }}>
            Volver
          </Button>
        </Box>

      </Paper>

      {/* POP-UP MOTIVO BLOQUEO */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} PaperProps={{ sx: { backgroundColor: '#222', border: '1px solid rgba(255,255,255,0.2)', p: 2, borderRadius: 2 } }}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: { xs: '250px', sm: '400px' } }}>
          
          <TextField multiline rows={4} fullWidth placeholder="Ingrese motivo de bloqueo aqui..." variant="outlined" sx={darkInputStyle} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button variant="contained" color="error" onClick={() => setOpenModal(false)} sx={{ fontWeight: 'bold', flex: 1 }}>
              Volver
            </Button>
            <Button variant="contained" color="success" onClick={() => { alert('Invoca CUU 5.1'); setOpenModal(false); }} sx={{ fontWeight: 'bold', flex: 1 }}>
              Confirmar
            </Button>
          </Box>

        </DialogContent>
      </Dialog>

    </Box>
  );
};