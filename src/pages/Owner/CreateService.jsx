import { Box, Button, Switch, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CreateService = () => {
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
          Nuevo Servicio / Editar Servicio
        </Typography>
      </Box>
       <Box sx={{display: 'flex', flexDirection: 'column', padding: '30px', backgroundColor: '#272727c4'}}>
        <TextField label="Ingrese nombre aqui" variant="standard" color="success" />
        <TextField label="Ingrese descripción aqui" variant="standard"  color="success"/>
        <Box sx={{margin: 'auto'}}>
          {/* Estos dos van a ir laterales en desktop y verticales en mobile */}
          <TextField label="Ingrese precio aqui" variant="standard" color="primary" />
          <TextField label="Ingrese  duración" variant="standard" color="secondary"/>
        </Box>
        <Switch {..."Está activo?"} defaultChecked />
        <Box>
          <Button
            variant="contained"
            color="error"
            sx={{}}
            onClick={() => {
              navigate("/servicios-dueno");
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
