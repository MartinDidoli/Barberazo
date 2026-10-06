import { useState } from 'react';
import {
  Box,
  Button,
  Rating,
  TextField,
  Typography,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const labels = {
  1: 'Malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

export const AddReview = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtenemos los datos del turno si vinieron por navigation state, o default para preview
  const turno = location.state?.turno || {
    servicio: 'Corte de Pelo Degradé',
    barbero: 'Franco Barbero',
    fecha: '05/10/2026',
  };

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setTimeout(() => {
      navigate('/appointments');
    }, 1200);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 70px)', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '560px',
          p: { xs: 3, md: 4.5 },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
            DEJAR RESEÑA
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Tu opinión nos ayuda a mantener el mejor nivel de servicio
          </Typography>
        </Box>

        {/* DETALLE DEL TURNO EVALUADO */}
        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Typography variant="caption" sx={{ color: '#90caf9', fontWeight: 700, textTransform: 'uppercase' }}>
            Servicio a calificar
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700, mt: 0.5 }}>
            {turno.servicio}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Atendido por: <strong style={{ color: 'white' }}>{turno.barbero}</strong> — Fecha: {turno.fecha}
          </Typography>
        </Box>

        {enviado && (
          <Alert severity="success" sx={{ backgroundColor: 'rgba(46, 160, 67, 0.15)', color: '#81c784' }}>
            ¡Muchas gracias! Tu reseña fue registrada exitosamente.
          </Alert>
        )}

        {/* FORMULARIO DE RESEÑA */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* ESTRELLAS DE CALIFICACIÓN */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              ¿Cómo calificarías la atención recibida?
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating
                name="service-rating"
                value={rating}
                precision={1}
                size="large"
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                sx={{
                  fontSize: '2.5rem',
                  '& .MuiRating-iconFilled': {
                    color: '#ffb74d',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#ffa726',
                  },
                }}
              />
              <Typography sx={{ color: '#ffb74d', fontWeight: 700, minWidth: '90px' }}>
                {labels[hover !== -1 ? hover : rating]}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          {/* COMENTARIO */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              Comentario u observaciones (opcional)
            </Typography>
            <TextField
              multiline
              rows={4}
              placeholder="Contanos qué te pareció el corte, la puntualidad o las instalaciones..."
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
          </Box>

          {/* BOTONES DE ACCIÓN */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 1 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/appointments')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#1976d2', fontWeight: 700, px: 3 }}
            >
              Publicar Reseña
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
