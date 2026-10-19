import { Box, Button, Switch, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NewEmployee = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          pt: 8,
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Nuevo Empleado / Editar Empleado
        </Typography>
      </Box>
       <Box sx={{display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#272727c4'}}>
        <TextField label="Nombre" variant="standard" color="success" />
        <TextField label="Apellido" variant="standard" color="success" />
        <TextField label="Mail" variant="standard"  color="success"/>
        <TextField label="Telefono" variant="standard" color="success" />
        <TextField label="Contraseña" variant="standard" color="success" />
        <Box>
          <Button
            variant="contained"
            color="error"
            sx={{}}
            onClick={() => {
              navigate("/empleados-dueno");
            }}
          >
            Volver
          </Button>
          <Button
            variant="contained"
            sx={{}}
            onClick={() => {
              alert("Guarda cambios, y vuelve para atras");
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </>
  );
};

/* 
import { Button, TextField, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

*/
