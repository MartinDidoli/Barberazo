import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HabilitarFecha = () => {
  const navigate = useNavigate();

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#007bff' }
    },
    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: { xs: 2, md: 4 } }}>
      
      <Paper elevation={0} sx={{ 
        width: '100%', 
        maxWidth: '800px', 
        backgroundColor: 'transparent', 
        border: '1px solid rgba(255,255,255,0.2)', 
        padding: { xs: 3, md: 5 }, 
        borderRadius: 2 
      }}>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* COLUMNA IZQUIERDA: Calendario y botón Volver */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              CALENDARIO
            </Typography>
            
            {/* Simulador de Calendario */}
            <Box sx={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Acá va el componente Calendario</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={() => navigate('/home-staff')}
                sx={{ width: '120px' }}
              >
                Volver
              </Button>
            </Box>

          </Box>

          {/* COLUMNA DERECHA: Inputs y Acciones */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, justifyContent: 'center' }}>
            
            <Box>
              <Typography sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Fecha Seleccionada</Typography>
              <TextField variant="outlined" fullWidth placeholder="Elegí una fecha..." sx={darkInputStyle} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', width: '90px' }}>Hora desde:</Typography>
              <TextField variant="outlined" size="small" sx={{ ...darkInputStyle, flex: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ color: 'white', fontWeight: 'bold', width: '90px' }}>Hora hasta:</Typography>
              <TextField variant="outlined" size="small" sx={{ ...darkInputStyle, flex: 1 }} />
            </Box>

            {/* Botones de acción principal */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="error" 
                fullWidth 
                onClick={() => alert('Abre POP-UP MOTIVO DESHABILITACION (CUU 6.2)')}
                sx={{ fontWeight: 'bold' }}
              >
                Deshabilitar
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                fullWidth 
                onClick={() => alert('Invoca CUU 6.1')}
                sx={{ fontWeight: 'bold' }}
              >
                Habilitar
              </Button>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              onClick={() => alert('Abre POP-UP ASIGNAR EMPLEADO (CUU 6.3)')}
              sx={{ backgroundColor: '#0056b3', color: 'white', fontWeight: 'bold', mt: 1 }}
            >
              Asignar empleado
            </Button>

          </Box>

        </Box>
      </Paper>
    </Box>
  );
};