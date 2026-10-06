import { Button, Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 2 }}>

      <Paper elevation={0} sx={{
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 2,
        padding: { xs: 3, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}>

        {/* Título, Imagen, Texto y Botón */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: { xs: 0, md: 8 }, gap: 3, textAlign: "center" }}>

          <Typography variant="h4" component="h1" sx={{ color: "white", fontWeight: "bold" }}>
            BIENVENIDOS A BARBERAZO!!
          </Typography>

          {/* Icon Badge */}
          <Box sx={{
            minHeight: "120px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: 2,
            padding: 3,
            backgroundColor: 'rgba(255,255,255,0.02)'
          }}>
            <Box sx={{
              fontSize: '48px',
              mb: 1,
              filter: 'drop-shadow(0 0 10px rgba(25, 118, 210, 0.6))'
            }}>
              ✂️💈
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '14px' }}>
              Estilo, Precisión y Profesionalismo
            </Typography>
          </Box>

          <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
            Para que te veas y sientas bien
          </Typography>

          {/* Botón Ingresar */}
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: "#007bff", color: "white", padding: "10px 40px", fontWeight: "bold", mt: 2, borderRadius: 2 }}
            onClick={() => navigate("/login")}
          >
            Ingresar
          </Button>

        </Box>
      </Paper>
    </Box>
  );
};