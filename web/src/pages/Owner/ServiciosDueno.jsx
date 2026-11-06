import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

export const ServiciosDueno = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);

  const loadData = () => {
    setServicios(mockStore.getServiciosList());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEditar = (servicio) => {
    navigate('/servicios-dueno/newService', { state: { servicio } });
  };

  const handleCrear = () => {
    navigate('/servicios-dueno/newService');
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
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px' }}>
              GESTIÓN DE SERVICIOS
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Catálogo de servicios, precios, tiempos de atención y disponibilidad (CUU 7.1 y 7.2)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/home-staff')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Volver a Turnos
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCrear}
              sx={{ backgroundColor: '#1976d2', fontWeight: 700 }}
            >
              Nuevo Servicio
            </Button>
          </Box>
        </Box>

        {/* GRILLA DE CARDS RESPONSIVE (Tanto en Desktop como en Mobile) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 1fr))',
              md: 'repeat(auto-fill, minmax(320px, 1fr))',
            },
            gap: 2.5,
          }}
        >
          {servicios.map((servicio) => {
            const isActivo = servicio.estado === 'Activo';

            return (
              <Paper
                key={servicio.id}
                elevation={0}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2.5,
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 2,
                  transition: 'border-color 0.2s ease, background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.18)',
                  },
                }}
              >
                {/* Cabecera de la Card: Nombre y Chip de Estado */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, lineHeight: 1.2 }}>
                      {servicio.nombre}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 1, minHeight: 40, lineHeight: 1.4 }}>
                      {servicio.desc || 'Sin descripción detallada.'}
                    </Typography>
                  </Box>
                  <Chip
                    label={isActivo ? 'Activo' : 'Inactivo'}
                    size="small"
                    color={isActivo ? 'success' : 'default'}
                    variant={isActivo ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 700, fontSize: '11px', flexShrink: 0 }}
                  />
                </Box>

                {/* Métricas: Precio y Duración */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoneyIcon sx={{ color: '#90caf9', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1 }}>
                        Precio
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#90caf9', fontWeight: 800 }}>
                        $ {Number(servicio.precio).toLocaleString('es-AR')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <AccessTimeIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }} />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1 }}>
                        Duración
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                        {servicio.duracion} min
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Botón Editar */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<EditIcon fontSize="small" />}
                  onClick={() => handleEditar(servicio)}
                  sx={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#1565c0',
                    },
                  }}
                >
                  Editar Servicio
                </Button>
              </Paper>
            );
          })}
        </Box>

        {/* BOTÓN VOLVER INFERIOR */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
          >
            ← Volver a Turnos
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
