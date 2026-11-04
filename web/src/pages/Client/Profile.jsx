import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";

export const Profile = () => {
  const navigate = useNavigate();
  const borderRadius = "10px";

  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [alertNotice, setAlertNotice] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const user = mockStore.getCurrentUser();
    const fullName = user?.name || "Rodrigo Bozio";
    const parts = fullName.trim().split(" ");
    setNombre(parts[0] || "");
    setApellido(parts.slice(1).join(" ") || "");
    setTelefono(user?.telefono || "341 555-1234");
    setEmail(user?.email || "cliente@barberazo.com");
  }, []);

  const handleEditToggle = () => {
    setAlertNotice(null);

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Validación al guardar (CUU 9.1)
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      setAlertNotice({
        severity: "error",
        text: "Nombre, apellido y email son obligatorios.",
      });
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setAlertNotice({
        severity: "error",
        text: "La nueva contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    const currentUser = mockStore.getCurrentUser() || {};
    const updatedUser = {
      ...currentUser,
      name: `${nombre.trim()} ${apellido.trim()}`.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
    };
    mockStore.setCurrentUser(updatedUser);

    setCurrentPassword("");
    setNewPassword("");
    setIsEditing(false);
    setAlertNotice({
      severity: "success",
      text: "Perfil actualizado correctamente.",
    });
  };

  const handleCancelEdit = () => {
    const user = mockStore.getCurrentUser();
    const fullName = user?.name || "Rodrigo Bozio";
    const parts = fullName.trim().split(" ");
    setNombre(parts[0] || "");
    setApellido(parts.slice(1).join(" ") || "");
    setTelefono(user?.telefono || "341 555-1234");
    setEmail(user?.email || "cliente@barberazo.com");
    setCurrentPassword("");
    setNewPassword("");
    setAlertNotice(null);
    setIsEditing(false);
  };

  // CUU 9.2: Eliminar Perfil
  const handleConfirmDelete = () => {
    setDeleteDialogOpen(false);
    mockStore.logout();
    navigate("/login");
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
          maxWidth: "680px",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3.5,
        }}
      >
        {/* ENCABEZADO */}
        <Box>
          <Typography
            variant="h5"
            sx={{ color: "white", fontWeight: 800, letterSpacing: "0.5px" }}
          >
            MI PERFIL
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", mt: 0.5 }}>
            {isEditing
              ? "Modificá tus datos personales y guardá los cambios"
              : "Consultá y administrá la información de tu cuenta"}
          </Typography>
        </Box>

        {alertNotice && (
          <Alert
            severity={alertNotice.severity}
            onClose={() => setAlertNotice(null)}
            sx={{ borderRadius: borderRadius }}
          >
            {alertNotice.text}
          </Alert>
        )}

        {/* GRILLA DE CAMPOS */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* FILA 1: NOMBRE Y APELLIDO */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                Nombre:
              </Typography>
              <TextField
                id="profile-nombre"
                variant="outlined"
                size="small"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={!isEditing}
                slotProps={{
                  input: {
                    readOnly: !isEditing,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                Apellido:
              </Typography>
              <TextField
                id="profile-apellido"
                variant="outlined"
                size="small"
                fullWidth
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={!isEditing}
                slotProps={{
                  input: {
                    readOnly: !isEditing,
                  },
                }}
              />
            </Box>
          </Box>

          {/* FILA 2: TELÉFONO Y EMAIL */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                Teléfono:
              </Typography>
              <TextField
                id="profile-telefono"
                variant="outlined"
                size="small"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={!isEditing}
                slotProps={{
                  input: {
                    readOnly: !isEditing,
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                Email:
              </Typography>
              <TextField
                id="profile-email"
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                slotProps={{
                  input: {
                    readOnly: !isEditing,
                  },
                }}
              />
            </Box>
          </Box>

          {/* FILA 3: CONTRASEÑA ACTUAL Y NUEVA CONTRASEÑA (VISIBLE SOLO SI EDITA) */}
          {isEditing && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                  Contraseña actual:
                </Typography>
                <TextField
                  id="profile-current-password"
                  type="password"
                  placeholder="Ingresá tu contraseña actual"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
                  Nueva contraseña:
                </Typography>
                <TextField
                  id="profile-new-password"
                  type="password"
                  placeholder="Ingresá tu nueva contraseña"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* BOTONES INFERIORES */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mt: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/home")}
            sx={{
              borderColor: "rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.85)",
              borderRadius: borderRadius,
              px: 3,
              fontWeight: 600,
            }}
          >
            Volver
          </Button>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {isEditing && (
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
                sx={{
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "white",
                  borderRadius: borderRadius,
                  fontWeight: 600,
                }}
              >
                Cancelar
              </Button>
            )}

            {/* CUU 9.2: ELIMINAR PERFIL */}
            <Button
              variant="contained"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                borderRadius: borderRadius,
                fontWeight: 700,
                px: 2.5,
              }}
            >
              Eliminar Perfil
            </Button>

            {/* CUU 9.1: EDITAR PERFIL */}
            <Button
              variant="contained"
              color="success"
              onClick={handleEditToggle}
              sx={{
                borderRadius: borderRadius,
                fontWeight: 700,
                px: 2.5,
              }}
            >
              {isEditing ? "Guardar Cambios" : "Editar Perfil"}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR PERFIL (CUU 9.2) */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
              maxWidth: "440px",
              p: 2,
              borderRadius: 3,
              backgroundColor: "#161b22",
              border: "1px solid rgba(239, 83, 80, 0.5)",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#ef5350", fontWeight: 800, textAlign: "center" }}>
          Eliminar Perfil
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
            ¿Estás seguro de que querés eliminar tu perfil? Esta acción cerrará tu sesión y dará de baja tu cuenta.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 1, display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderColor: "rgba(255,255,255,0.3)", color: "white", borderRadius: borderRadius }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleConfirmDelete}
            sx={{ fontWeight: 700, borderRadius: borderRadius }}
          >
            Confirmar Baja
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
