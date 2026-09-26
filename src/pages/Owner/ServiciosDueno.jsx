import { Box, Button, Typography, Paper, Fab } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ServiciosDueno = () => {
  const navigate = useNavigate();

  const servicios = [
    { id: 1, nombre: 'BARBA', desc: '"Perfilado y rebajado de volumen"', precio: '$8000', duracion: '20min', estado: 'Activo' },
    { id: 2, nombre: 'BRASHING', desc: '"No tengo idea lo que es"', precio: '$11111', duracion: '15 min', estado: 'Inactivo' },
    { id: 3, nombre: 'NOMBRE', desc: 'DESCRIPCION', precio: 'PRECIO', duracion: 'DURACIÓN', estado: 'ESTADO' },
    { id: 4, nombre: 'NOMBRE', desc: 'DESCRIPCION', precio: 'PRECIO', duracion: 'DURACIÓN', estado: 'ESTADO' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: { xs: 2, md: 4 }, position: 'relative' }}>
      
      <Paper elevation={0} sx={{ 
        width: '100%', 
        maxWidth: '900px', 
        backgroundColor: 'transparent', 
        border: { xs: 'none', md: '1px solid rgba(255,255,255,0.2)' }, 
        padding: { xs: 1, md: 4 }, 
        borderRadius: 2 
      }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', mb: 4 }}>
          {/* Flecha volver (Mobile) */}
          <Button 
            onClick={() => navigate('/home-staff')} 
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white', fontSize: '24px', minWidth: '40px', p: 0 }}
          >
            ←
          </Button>
          
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1, textAlign: 'center' }}>
            SERVICIOS
          </Typography>
        </Box>

        {/* GRILLA DE SERVICIOS */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
          {servicios.map((servicio) => (
            <Paper key={servicio.id} sx={{ 
              width: { xs: '100%', sm: '250px' }, 
              backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.2)', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>{servicio.nombre}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', minHeight: '40px' }}>{servicio.desc}</Typography>
                <Typography sx={{ color: 'white', fontWeight: 'bold', mt: 1 }}>{servicio.precio}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{servicio.duracion}</Typography>
                <Typography sx={{ color: servicio.estado === 'Activo' ? '#4caf50' : '#f44336', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {servicio.estado}
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => alert('Redirige a EDITAR SERVICIO (CUU 7.2)')}
                sx={{ borderRadius: 0, fontWeight: 'bold' }}
              >
                Editar
              </Button>
            </Paper>
          ))}
        </Box>

        {/* ACCIONES INFERIORES (Solo Desktop) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '2px solid rgba(255,255,255,0.1)' }}>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#ffcccc', color: 'black', '&:hover': { backgroundColor: '#ffb3b3' }, fontWeight: 'bold', width: '150px' }}
            onClick={() => navigate('/home-staff')}
          >
            Volver
          </Button>

          <Button 
            variant="contained" 
            sx={{ backgroundColor: '#0056b3', fontWeight: 'bold', padding: '10px 30px' }}
            onClick={() => alert('Redirige a CREAR SERVICIO (CUU 7.1)')}
          >
            CREAR NUEVO SERVICIO
          </Button>
        </Box>

      </Paper>

      {/* BOTÓN FLOTANTE (Solo Mobile) */}
      < Fab 
        color="primary" 
        aria-label="add" 
        sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', bottom: 32, right: 32, backgroundColor: '#0056b3' }}
        onClick={() => alert('Redirige a CREAR SERVICIO (CUU 7.1)')}
      >
        < Typography sx={{ fontSize: '30px', color: 'white', mt: -0.5 }}>+</Typography>
      </Fab>

    </Box>
  );
};