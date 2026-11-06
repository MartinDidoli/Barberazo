import { useState, useEffect } from 'react';
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
  Rating,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import StarIcon from '@mui/icons-material/Star';

export const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(mockStore.getReviews());
  }, []);

  // Mobile Card Component
  const ReviewCard = ({ review }) => (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        transition: 'border-color 0.2s ease, background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
        },
      }}
    >
      {/* Top: Cliente + Rating */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1.05rem' }}>
            {review.cliente}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
            {review.servicio || 'Servicio'} • Atendió: <strong style={{ color: 'white' }}>{review.barbero || 'Barbero'}</strong>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
          <Rating
            value={Number(review.rating)}
            readOnly
            size="small"
            emptyIcon={<StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />}
          />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5 }}>
            {review.fecha}
          </Typography>
        </Box>
      </Box>

      {/* Comentario */}
      <Box sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', lineHeight: 1.5 }}>
          "{review.comment || review.reseña}"
        </Typography>
      </Box>
    </Paper>
  );

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
              RESEÑAS DE CLIENTES
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Opiniones, calificaciones y comentarios sobre la atención del local
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            ← Volver a Turnos
          </Button>
        </Box>

        {/* MOBILE: CARDS (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {reviews.length === 0 ? (
            <Paper elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 2, p: 4, textAlign: 'center' }}>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>No hay reseñas registradas aún.</Typography>
            </Paper>
          ) : (
            reviews.map((review) => <ReviewCard key={review.id || review.cliente} review={review} />)
          )}
        </Box>

        {/* DESKTOP: TABLE (≥ md) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Servicio & Barbero</TableCell>
                  <TableCell align="center">Calificación</TableCell>
                  <TableCell>Opinión / Comentario</TableCell>
                  <TableCell align="center">Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                      No hay reseñas registradas aún.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id || review.cliente} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 700 }}>
                        {review.cliente}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                          {review.servicio || 'Corte'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#90caf9' }}>
                          {review.barbero || 'Franco Barbero'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Rating
                            value={Number(review.rating || review.numEstrellas)}
                            readOnly
                            size="small"
                            emptyIcon={<StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', maxWidth: '380px' }}>
                        "{review.comment || review.reseña}"
                      </TableCell>
                      <TableCell align="center" sx={{ color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
                        {review.fecha || 'Reciente'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
