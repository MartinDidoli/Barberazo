import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  SvgIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';

export const HomeStaff = () => {
  const navigate = useNavigate();

  const currentUser = mockStore.getCurrentUser();
  const rolUsuario = currentUser?.role || 'dueño';
  const nombreUsuario = currentUser?.name || (rolUsuario === 'dueño' ? 'Martín Dueño' : 'Franco Barbero');

  // Turnos del día cargados desde el almacén central
  const [turnos, setTurnos] = useState([]);

  // Estado para el menú hamburguesa en mobile
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  const handleOpenMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  const handleNavigateMobile = (path) => {
    handleCloseMobileMenu();
    navigate(path);
  };

  const loadTurnos = () => {
    setTurnos(mockStore.getTurnos());
  };

  useEffect(() => {
    loadTurnos();
  }, []);

  // CU 1.3: Confirmar Asistencia (Disponible para Empleado y Dueño)
  const handleMarcarAsistencia = (id, asistio) => {
    mockStore.marcarAsistencia(id, asistio);
    loadTurnos();
  };

  // CU 1.6: Cancelar turno por el local (Exclusivo Dueño, sin multa al cliente)
  const handleCancelarDueno = (id) => {
    mockStore.cancelarTurnoDueno(id);
    loadTurnos();
  };

  // ===== UNIFIED CHIP SYSTEM - All statuses FILLED with icons =====
  const getStatusChip = (estado) => {
    const chipStyles = {
      size: 'small',
      fontWeight: 700,
      borderRadius: 2,
      sx: { px: 1.5, py: 0.5, fontSize: '0.7rem' },
    };

    switch (estado) {
      case 'pendiente':
        return (
          <Chip label="Pendiente" icon={<InfoIcon fontSize="small" />} color="warning" variant="filled" {...chipStyles} />
        );
      case 'completado':
        return (
          <Chip label="Asistió" icon={<CheckCircleIcon fontSize="small" />} color="success" variant="filled" {...chipStyles} />
        );
      case 'no_asistio':
        return (
          <Chip label="No asistió" icon={<CancelIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />
        );
      case 'cancelado_sin_multa':
        return (
          <Chip label="Cancelado por local" icon={<BlockIcon fontSize="small" />} color="default" variant="filled" {...chipStyles} />
        );
      case 'cancelo_cliente':
        return (
          <Chip label="Canceló cliente" icon={<CancelIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />
        );
      default:
        return <Chip label={estado} {...chipStyles} />;
    }
  };

  // ===== NAV ITEMS =====
  const navItemsDueno = [
    { label: 'Servicios', emoji: '✂️', path: '/servicios-dueno' },
    { label: 'Nuevas Fechas', emoji: '📅', path: '/habilitar-fecha' },
    { label: 'Empleados', emoji: '👥', path: '/empleados-dueno' },
    { label: 'Clientes', emoji: '👤', path: '/clientes-dueno' },
    { label: 'Reseñas', emoji: '⭐', path: '/reviews' },
  ];

  const navItemsEmpleado = [
    { label: 'Clientes', emoji: '👤', path: '/clientes-dueno' },
    { label: 'Reseñas', emoji: '⭐', path: '/reviews' },
  ];

  const navItems = rolUsuario === 'dueño' ? navItemsDueno : navItemsEmpleado;

  // ===== ACTION BUTTONS (shared between card and table) =====
  const renderActions = (turno, isCard = false) => {
    if (turno.estado === 'pendiente') {
      const buttonSx = isCard
        ? { flex: 1, minWidth: 100, fontWeight: 700, fontSize: '0.8rem' }
        : { fontSize: '11px', fontWeight: 600 };

      return (
        <Box sx={{ display: 'flex', justifyContent: isCard ? 'stretch' : 'center', gap: 1, flexWrap: 'wrap' }}>
          {/* CU 1.6: Cancelar (solo Dueño) */}
          {rolUsuario === 'dueño' && (
            <Tooltip title="Cancelar turno (sin multa al cliente)">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CancelIcon fontSize="small" />}
                sx={{ ...buttonSx, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                onClick={() => handleCancelarDueno(turno.id)}
              >
                Cancelar
              </Button>
            </Tooltip>
          )}
          {/* CU 1.3: No asistió */}
          <Tooltip title="Marcar como no asistió">
            <Button
              variant="outlined"
              size="small"
              startIcon={<CancelIcon fontSize="small" />}
              sx={{
                ...buttonSx,
                borderColor: 'rgba(239, 83, 80, 0.5)',
                color: '#ff8a80',
                borderWidth: 2,
                '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.1)', borderWidth: 2 },
              }}
              onClick={() => handleMarcarAsistencia(turno.id, false)}
            >
              No asistió
            </Button>
          </Tooltip>
          {/* CU 1.3: Asistió */}
          <Tooltip title="Confirmar asistencia">
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircleIcon fontSize="small" />}
              sx={buttonSx}
              onClick={() => handleMarcarAsistencia(turno.id, true)}
            >
              Asistió
            </Button>
          </Tooltip>
        </Box>
      );
    }

    // Turno ya procesado
    return (
      <Button
        variant="outlined"
        disabled
        color="default"
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: '0.8rem',
          borderColor: 'rgba(255,255,255,0.15)',
          color: 'rgba(255,255,255,0.4)',
          ...(isCard ? { width: '100%' } : {}),
        }}
      >
        Turno procesado
      </Button>
    );
  };

  // ===== MOBILE CARD COMPONENT =====
  const TurnoCard = ({ turno }) => {
    const serviciosText = Array.isArray(turno.servicios)
      ? turno.servicios.join(' + ')
      : turno.servicio || 'Servicio';

    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.15)' },
        }}
      >
        {/* Top: Client + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
              Cliente
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {turno.cliente}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>{getStatusChip(turno.estado)}</Box>
        </Box>

        {/* Middle: Service + Price */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
              Servicio
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              {serviciosText}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 800, whiteSpace: 'nowrap' }}>
            $ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}
          </Typography>
        </Box>

        {/* Time row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.85)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Horario:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>{turno.horario} hs</Typography>
        </Box>

        {/* Bottom: Actions */}
        <Box sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {renderActions(turno, true)}
        </Box>
      </Paper>
    );
  };

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
        {/* ENCABEZADO Y TÍTULO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
                TURNOS DEL DÍA
              </Typography>
              <Chip
                label={rolUsuario === 'dueño' ? 'PANEL DUEÑO' : 'PANEL EMPLEADO'}
                size="small"
                color={rolUsuario === 'dueño' ? 'secondary' : 'info'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 0.5 }}>
              Sesión activa: <strong style={{ color: 'white' }}>{nombreUsuario}</strong>
            </Typography>
          </Box>

          {/* NAVEGACIÓN DESKTOP (≥ md) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="outlined"
                size="small"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* NAVEGACIÓN MOBILE (MENÚ HAMBURGUESA DROPDOWN) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              aria-label="Abrir menú de opciones"
              aria-controls={isMobileMenuOpen ? 'mobile-staff-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={isMobileMenuOpen ? 'true' : undefined}
              onClick={handleOpenMobileMenu}
              sx={{
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 2,
                p: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                },
              }}
            >
              <SvgIcon sx={{ fontSize: 24 }}>
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
              </SvgIcon>
            </IconButton>

            {/* Dropdown del menú hamburguesa */}
            <Menu
              id="mobile-staff-menu"
              anchorEl={mobileMenuAnchor}
              open={isMobileMenuOpen}
              onClose={handleCloseMobileMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 190,
                    backgroundColor: '#161b22',
                    backgroundImage: 'none',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                    py: 0.5,
                    '& .MuiMenuItem-root': {
                      fontSize: '14px',
                      fontWeight: 600,
                      py: 1.2,
                      px: 2,
                      gap: 1.5,
                      color: 'white',
                      transition: 'background-color 0.15s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.18)',
                      },
                    },
                  },
                },
              }}
            >
              {navItems.map((item) => (
                <MenuItem key={item.path} onClick={() => handleNavigateMobile(item.path)}>
                  <Box component="span" sx={{ fontSize: '16px' }}>{item.emoji}</Box>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        {/* MOBILE: CARD LAYOUT (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {turnos.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                No hay turnos registrados para hoy.
              </Typography>
            </Paper>
          ) : (
            turnos.map((turno) => <TurnoCard key={turno.id} turno={turno} />)
          )}
        </Box>

        {/* DESKTOP: TABLE LAYOUT (≥ md) */}
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
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Servicio</TableCell>
                  <TableCell>Horario</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {turnos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                      No hay turnos registrados para hoy.
                    </TableCell>
                  </TableRow>
                ) : (
                  turnos.map((turno) => (
                    <TableRow key={turno.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s ease' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'white' }}>{turno.cliente}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>
                        {Array.isArray(turno.servicios) ? turno.servicios.join(' + ') : turno.servicio || 'Servicio'}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>{turno.horario} hs</TableCell>
                      <TableCell sx={{ color: '#90caf9', fontWeight: 700 }}>
                        $ {typeof turno.monto === 'number' ? turno.monto.toLocaleString('es-AR') : turno.monto}
                      </TableCell>
                      <TableCell align="center">{getStatusChip(turno.estado)}</TableCell>
                      <TableCell align="center">
                        {renderActions(turno, false)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </Paper>
    </Box>
  );
};
