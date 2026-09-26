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

          {/* Placeholder */}
          <Box sx={{ 
            minHeight: "120px", 
            width: "100%", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            border: "1px dashed rgba(255,255,255,0.3)",
            borderRadius: 2,
            padding: 2
          }}>
            <img src="" alt="imagen de barberazo" style={{ maxHeight: "100%", maxWidth: "100%" }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', position: 'absolute' }}>[ Íconos ]</Typography>
          </Box>

          <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
            Mensaje motivacional genérico
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