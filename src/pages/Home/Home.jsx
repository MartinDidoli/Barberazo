import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  const darkInputStyle = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: 'white' },
      '&.Mui-focused fieldset': { borderColor: '#0056b3' }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: { xs: 2, md: 4 } }}>
      
      <Paper elevation={0} sx={{ padding: { xs: 2, md: 4 }, width: '100%', maxWidth: '900px', borderRadius: 2, backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>

          {/* Menú Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/appointments')}>
              MIS TURNOS
            </Button>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}>
              MULTAS
            </Button>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={() => navigate('/profile')}>
              PERFIL
            </Button>
          </Box>

          {/* Menú hamburguesa */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', fontSize: '24px', minWidth: '40px', padding: '0 10px' }}>
              ☰
            </Button>
          </Box>

        </Box>

        {/* CUERPO PRINCIPAL */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          
          {/* COLUMNA IZQUIERDA (Calendario) */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 4 }}>
            
            <Box sx={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2, minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Acá va el componente Calendario</Typography>
            </Box>

            {/* Monto Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
              <Typography fontWeight="bold" sx={{ color: 'white' }}>Monto:</Typography>
              <TextField variant="outlined" size="small" value="$ 12.000" InputProps={{ readOnly: true }} sx={{ width: '150px', ...darkInputStyle }} />
            </Box>

          </Box>

          {/* COLUMNA DERECHA */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Servicios */}
            <Box>
              <Typography fontWeight="bold" textAlign="center" mb={1} sx={{ color: 'white' }}>SERVICIOS</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
                  <Button variant="outlined" sx={{ mb: 1, width: '100%', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Barba</Button>
                  <Typography variant="body2" sx={{ color: 'white' }}>$8.000</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
                  <Button variant="outlined" sx={{ mb: 1, width: '100%', borderColor: '#4caf50', color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>Pelo</Button>
                  <Typography variant="body2" sx={{ color: 'white' }}>$12.000</Typography>
                </Box>
              </Box>
            </Box>

            {/* Horarios */}
            <Box>
              <Typography fontWeight="bold" textAlign="center" mb={1} sx={{ color: 'white' }}>HORARIOS</Typography>
              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}>
                <Button variant="outlined" sx={{ minWidth: '80px', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>18:40</Button>
                <Button variant="outlined" sx={{ minWidth: '80px', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>19:00</Button>
                <Button variant="outlined" sx={{ minWidth: '80px', borderColor: '#4caf50', color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>12:00</Button>
                <Button variant="outlined" sx={{ minWidth: '80px', borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>15:00</Button>
              </Box>
            </Box>

            {/* Observaciones */}
            <Box>
              <Typography fontWeight="bold" textAlign="center" mb={1} sx={{ color: 'white' }}>OBSERVACIONES</Typography>
              <TextField multiline rows={3} fullWidth placeholder="Ingrese observaciones aquí..." variant="outlined" sx={darkInputStyle} />
            </Box>

            {/* Monto Mobile */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 2, mt: 2 }}>
              <Typography fontWeight="bold" sx={{ color: 'white' }}>Monto:</Typography>
              <TextField variant="outlined" size="small" value="$ 12.000" InputProps={{ readOnly: true }} sx={{ width: '150px', ...darkInputStyle }} />
            </Box>

            {/* Confirmar */}
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: 2 }}>
              <Button variant="contained" size="large" sx={{ backgroundColor: '#0056b3', color: 'white', width: { xs: '100%', md: 'auto' }, padding: '12px 40px', fontWeight: 'bold' }} onClick={() => alert('Abre un pop up, ARMALO LUCAS')}>
                Confirmar
              </Button>
            </Box>

          </Box>

        </Box>
      </Paper>
    </Box>
  );
};