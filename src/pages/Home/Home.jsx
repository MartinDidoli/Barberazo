import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Home = () => {

  const navigate = useNavigate()
  return (
    <>
      {/* ---------------------------------------------------------------------- */}
      {/* NavBar provisorio, charlarlo */}

      <Box element="nav" sx={{ backgroundColor: "#2513ff" }}>
        {/* Mis turnos */}
        <Button variant="contained" onClick={()=>navigate('/appointments')}>Mis Turnos</Button>
        {/* Multas */}
        <Button variant="contained">Multas</Button>
        {/* Perfil */}
        <Button variant="contained" onClick={()=>navigate('/profile')}>Perfil</Button>
      </Box>
      {/* ---------------------------------------------------------------------- */}

      <h1>Home</h1>

      {/* Calendario */}
      <Box element="p" sx={{ backgroundColor: "blue" }}>
        Aca va el calendario
      </Box>
      {/* Servicios */}
      <Box element="p" sx={{ backgroundColor: "green" }}>
        Aca va servicios
      </Box>

      {/* Horarios */}
      <Box element="p" sx={{ backgroundColor: "yellow" }}>
        Aca va elhorarios
      </Box>

      {/* Observaciones */}
      <Box element="p" sx={{ backgroundColor: "grey" }}>
        Aca vaobservaciones
      </Box>
      {/* Monto */}
      <Box element="p" sx={{ backgroundColor: "red" }}>
        Aca va monto
      </Box>
      {/* Confirmar */}
      <Box sx={{ backgroundColor: "green" }}>
        Aca va el boton
        <Button
          variant="primary"
          onClick={() => {
            alert("Abre un pop up, ARMALO LUCAS");
          }}
        >
          Confirmar
        </Button>
      </Box>
    </>
  );
};
