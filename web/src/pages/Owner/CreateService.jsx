import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const CreateService = () => {
  const navigate = useNavigate();
  const borderRadius = "10px";

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");
  const [activo, setActivo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!nombre.trim() || !precio.trim() || !duracion.trim()) {
      setErrorMessage("Por favor completá el nombre, precio y duración del servicio.");
      return;
    }

    setSuccessMessage("¡Servicio guardado con éxito! Redirigiendo...");
    setTimeout(() => {
      navigate("/servicios-dueno");
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "540px",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* ENCABEZADO */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 800, letterSpacing: "0.5px" }}
          >
            NUEVO / EDITAR SERVICIO
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}
          >
            Completá los datos del servicio ofrecido en la barbería
          </Typography>
        </Box>

        {/* FORMULARIO */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ borderRadius: borderRadius }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ borderRadius: borderRadius }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            id="service-nombre"
            label="Ingrese nombre aquí"
            variant="outlined"
            size="small"
            fullWidth
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrorMessage("");
            }}
          />

          <TextField
            id="service-descripcion"
            label="Ingrese descripción aquí"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* PRECIO Y DURACIÓN (LATERALES EN DESKTOP, VERTICALES EN MOBILE) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              id="service-precio"
              label="Ingrese precio aquí"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={precio}
              onChange={(e) => {
                setPrecio(e.target.value);
                setErrorMessage("");
              }}
            />

            <TextField
              id="service-duracion"
              label="Ingrese duración"
              variant="outlined"
              size="small"
              fullWidth
              value={duracion}
              onChange={(e) => {
                setDuracion(e.target.value);
                setErrorMessage("");
              }}
            />
          </Box>

          {/* SWITCH DE ESTADO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Typography variant="body2" sx={{ color: "white", fontWeight: 600 }}>
              Estado del servicio
            </Typography>
            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <Switch
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  color="success"
                />
              }
              label={
                <Typography
                  variant="body2"
                  sx={{
                    color: activo ? "#81c784" : "rgba(255,255,255,0.5)",
                    fontWeight: 700,
                    ml: 0.5,
                  }}
                >
                  {activo ? "Activo" : "Inactivo"}
                </Typography>
              }
            />
          </Box>

          {/* BOTONES DE ACCIÓN */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mt: 1,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/servicios-dueno")}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                borderRadius: borderRadius,
                px: 3,
                py: 1,
                fontWeight: 600,
              }}
            >
              Volver
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1976d2",
                borderRadius: borderRadius,
                px: 4,
                py: 1,
                fontWeight: 800,
              }}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
