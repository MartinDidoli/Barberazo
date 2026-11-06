import { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const CreateService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const borderRadius = "10px";

  // Si viene con estado de edición
  const servicioAEditar = location.state?.servicio || null;
  const isEditing = Boolean(servicioAEditar);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [duracion, setDuracion] = useState("");
  const [activo, setActivo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (servicioAEditar) {
      setNombre(servicioAEditar.nombre || "");
      setDescripcion(servicioAEditar.desc || "");
      setPrecio(servicioAEditar.precio ? String(servicioAEditar.precio) : "");
      setDuracion(servicioAEditar.duracion ? String(servicioAEditar.duracion) : "");
      setActivo(servicioAEditar.estado === "Activo");
    }
  }, [servicioAEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!nombre.trim() || !precio.trim() || !duracion.trim()) {
      setErrorMessage("Por favor completá el nombre, precio y duración del servicio.");
      return;
    }

    if (isEditing) {
      // CUU 7.2: Modificar Servicio
      mockStore.modificarServicio(servicioAEditar.id, {
        nombre,
        desc: descripcion,
        precio,
        duracion,
        estado: activo ? "Activo" : "Inactivo",
      });
      setSuccessMessage("¡Servicio modificado con éxito! Redirigiendo...");
    } else {
      // CUU 7.1: Crear Servicio
      mockStore.crearServicio({
        nombre,
        desc: descripcion,
        precio,
        duracion,
        estado: activo ? "Activo" : "Inactivo",
      });
      setSuccessMessage("¡Servicio registrado con éxito! Redirigiendo...");
    }

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
          p: { xs: 3, md: 4.5 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        {/* ENCABEZADO */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 800, letterSpacing: "0.5px" }}
          >
            {isEditing ? "Modificar Servicio" : "Nuevo Servicio"}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}
          >
            {isEditing
              ? "Actualizá la información, costo o duración del servicio ofrecido"
              : "Completá los datos del nuevo servicio a incorporar al catálogo"}
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
            label="Nombre del Servicio"
            variant="outlined"
            size="small"
            fullWidth
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setErrorMessage("");
            }}
            required
          />

          <TextField
            id="service-descripcion"
            label="Descripción del Servicio"
            variant="outlined"
            size="small"
            multiline
            rows={3}
            fullWidth
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Detalles sobre el procedimiento, productos utilizados, etc."
          />

          {/* PRECIO Y DURACIÓN */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              id="service-precio"
              label="Precio ($ ARS)"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={precio}
              onChange={(e) => {
                setPrecio(e.target.value);
                setErrorMessage("");
              }}
              required
            />

            <TextField
              id="service-duracion"
              label="Duración (minutos)"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              value={duracion}
              onChange={(e) => {
                setDuracion(e.target.value);
                setErrorMessage("");
              }}
              required
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
              Estado de disponibilidad
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
              {isEditing ? "Guardar Modificaciones" : "Registrar Servicio"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
