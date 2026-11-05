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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

export const ClientesDueno = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [multas, setMultas] = useState([]);

  // Modales
  const [modalBloqueoOpen, setModalBloqueoOpen] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');

  // Modal visualización y validación de comprobante (CUU 4.1 Paso 2)
  const [modalComprobanteOpen, setModalComprobanteOpen] = useState(false);
  const [multaComprobante, setMultaComprobante] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [showRechazoInput, setShowRechazoInput] = useState(false);

  const loadData = () => {
    setClientes(mockStore.getClientes());
    setMultas(mockStore.getMultas());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Bloqueo
  const handleOpenBloqueo = (cliente) => {
    setClienteSeleccionado(cliente);
    setMotivoBloqueo('');
    setModalBloqueoOpen(true);
  };

  const handleConfirmarBloqueo = () => {
    if (!clienteSeleccionado) return;
    mockStore.bloquearCliente(clienteSeleccionado.id, motivoBloqueo);
    loadData();
    setModalBloqueoOpen(false);
  };

  const handleDesbloquear = (cliente) => {
    mockStore.desbloquearCliente(cliente.id);
    loadData();
  };

  // Comprobantes de Multas (CUU 4.1)
  const handleVerComprobante = (multa) => {
    setMultaComprobante(multa);
    setMotivoRechazo('');
    setShowRechazoInput(false);
    setModalComprobanteOpen(true);
  };

  const handleAprobarPago = () => {
    if (!multaComprobante) return;
    mockStore.aprobarComprobanteMulta(multaComprobante.id);
    loadData();
    setModalComprobanteOpen(false);
  };

  const handleRechazarPago = () => {
    if (!multaComprobante) return;
    mockStore.rechazarComprobanteMulta(multaComprobante.id, motivoRechazo);
    loadData();
    setModalComprobanteOpen(false);
  };

  // Helper para buscar si el cliente tiene comprobante pendiente de revisión
  const getMultaConComprobante = (email) => {
    if (!email) return null;
    return multas.find(m => m.clienteEmail?.toLowerCase() === email.toLowerCase() && m.estado === 'Comprobante Subido');
  };

  const getStatusChip = (estado, strikes) => {
    const chipStyles = {
      size: 'small',
      fontWeight: 700,
      borderRadius: 2,
      sx: { px: 1.5, py: 0.5, fontSize: '0.7rem' },
    };

    switch (estado) {
      case 'activo':
        return <Chip label={`Activo (${strikes || 0} strikes)`} color="success" variant="filled" {...chipStyles} />;
      case 'multado':
        return <Chip label="Multado (3 strikes)" color="warning" variant="filled" {...chipStyles} />;
      case 'bloqueado':
        return <Chip label="Bloqueado" icon={<BlockIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />;
      default:
        return <Chip label={estado} {...chipStyles} />;
    }
  };

  // Card para mobile
  const ClienteCard = ({ cliente }) => {
    const multaPendienteRevision = getMultaConComprobante(cliente.email);

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
          gap: 1.5,
          transition: 'border-color 0.2s ease, background-color 0.2s ease',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: 'rgba(255, 255, 255, 0.15)' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {cliente.nombre}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {cliente.email}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.5 }}>
              Tel: {cliente.telefono}
            </Typography>
          </Box>
          <Box>{getStatusChip(cliente.estado, cliente.strikes)}</Box>
        </Box>

        {multaPendienteRevision && (
          <Alert
            severity="warning"
            icon={<ReceiptLongIcon fontSize="inherit" />}
            sx={{ py: 0.5, px: 1.5, fontSize: '0.8rem', backgroundColor: 'rgba(255, 152, 0, 0.12)', color: '#ffb74d' }}
          >
            Subió comprobante por multa de $ {Number(multaPendienteRevision.monto).toLocaleString('es-AR')}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
          {multaPendienteRevision && (
            <Button
              variant="contained"
              color="warning"
              size="small"
              startIcon={<VisibilityIcon fontSize="small" />}
              fullWidth
              onClick={() => handleVerComprobante(multaPendienteRevision)}
              sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#000' }}
            >
              Controlar Comprobante
            </Button>
          )}

          {cliente.estado === 'bloqueado' ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              fullWidth
              startIcon={<CheckCircleIcon fontSize="small" />}
              onClick={() => handleDesbloquear(cliente)}
              sx={{ fontWeight: 700, fontSize: '0.8rem' }}
            >
              Desbloquear
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              size="small"
              fullWidth
              startIcon={<BlockIcon fontSize="small" />}
              onClick={() => handleOpenBloqueo(cliente)}
              sx={{ fontWeight: 700, fontSize: '0.8rem', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              Bloquear
            </Button>
          )}
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
        {/* ENCABEZADO */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, letterSpacing: '0.5px' }}>
              GESTIÓN DE CLIENTES
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Consultá el estado, sanciones y controlá comprobantes de multas recibidas
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
          >
            Volver a Turnos
          </Button>
        </Box>

        {/* ALERTA DE COMPROBANTES PENDIENTES DE CONTROL */}
        {multas.some(m => m.estado === 'Comprobante Subido') && (
          <Alert severity="info" sx={{ backgroundColor: 'rgba(25, 118, 210, 0.12)', border: '1px solid rgba(25, 118, 210, 0.35)', color: '#90caf9' }}>
            Hay clientes que han cargado su comprobante de transferencia bancaria para el pago de multas. Controlá el ticket y aprobá o rechazá el comprobante.
          </Alert>
        )}

        {/* MOBILE: CARDS (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {clientes.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </Box>

        {/* DESKTOP: TABLE (≥ md) */}
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
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre y Apellido</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Estado de Cuenta</TableCell>
                  <TableCell align="center">Comprobante de Pago</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => {
                  const multaPendienteRevision = getMultaConComprobante(cliente.email);

                  return (
                    <TableRow key={cliente.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>{cliente.nombre}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{cliente.telefono}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{cliente.email}</TableCell>
                      <TableCell align="center">{getStatusChip(cliente.estado, cliente.strikes)}</TableCell>
                      <TableCell align="center">
                        {multaPendienteRevision ? (
                          <Tooltip title="Ver y controlar comprobante cargado por el cliente">
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              startIcon={<VisibilityIcon fontSize="small" />}
                              onClick={() => handleVerComprobante(multaPendienteRevision)}
                              sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#000' }}
                            >
                              Controlar ($ {Number(multaPendienteRevision.monto).toLocaleString('es-AR')})
                            </Button>
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Sin comprobantes
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {cliente.estado === 'bloqueado' ? (
                          <Tooltip title="Desbloquear acceso al cliente (CUU 5.2)">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckCircleIcon fontSize="small" />}
                              onClick={() => handleDesbloquear(cliente)}
                              sx={{ fontWeight: 700, fontSize: '0.8rem' }}
                            >
                              Desbloquear
                            </Button>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Bloquear cuenta de cliente (CUU 5.1)">
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<BlockIcon fontSize="small" />}
                              onClick={() => handleOpenBloqueo(cliente)}
                              sx={{ fontWeight: 700, fontSize: '0.8rem', borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                            >
                              Bloquear
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* BOTÓN VOLVER */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home-staff')}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
          >
            ← Volver
          </Button>
        </Box>
      </Paper>

      {/* MODAL BLOQUEO DE CLIENTE (CUU 5.1) */}
      <Dialog
        open={modalBloqueoOpen}
        onClose={() => setModalBloqueoOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '460px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: '#ef5350', fontWeight: 800, textAlign: 'center' }}>
          Bloquear Cliente
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Estás por bloquear a <strong style={{ color: 'white' }}>{clienteSeleccionado?.nombre}</strong>. Ingresá el motivo del bloqueo:
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Ej: Inconducta recurrente, turnos falsos..."
            value={motivoBloqueo}
            onChange={(e) => setMotivoBloqueo(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setModalBloqueoOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleConfirmarBloqueo} sx={{ fontWeight: 800 }}>
            Confirmar Bloqueo
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL CONTROL DE COMPROBANTE DE PAGO (CUU 4.1) */}
      <Dialog
        open={modalComprobanteOpen}
        onClose={() => setModalComprobanteOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '520px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 800, textAlign: 'center', pb: 1 }}>
          Control de Pago - Multa
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            El cliente ha presentado un comprobante de transferencia bancaria para saldar su sanción.
          </Typography>

          {/* FICHA DEL COMPROBANTE Y DETALLES */}
          <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>CLIENTE</Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>{multaComprobante?.clienteEmail}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>MONTO SANCIONADO</Typography>
              <Typography variant="body1" sx={{ color: '#ef5350', fontWeight: 800 }}>
                $ {multaComprobante ? Number(multaComprobante.monto).toLocaleString('es-AR') : '5.000'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>MOTIVO SANCION</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>{multaComprobante?.motivo}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            
            {/* VISTA PREVIA DEL COMPROBANTE */}
            <Box sx={{ p: 2, border: '1px dashed rgba(76, 175, 80, 0.4)', borderRadius: 2, backgroundColor: 'rgba(76, 175, 80, 0.05)', textAlign: 'center' }}>
              {multaComprobante?.comprobante?.previewUrl ? (
                <Box sx={{ mb: 1.5 }}>
                  <Box
                    component="img"
                    src={multaComprobante.comprobante.previewUrl}
                    alt="Comprobante de pago"
                    sx={{
                      maxHeight: '220px',
                      maxWidth: '100%',
                      borderRadius: 1.5,
                      border: '1px solid rgba(255,255,255,0.2)',
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    }}
                  />
                </Box>
              ) : (
                <ReceiptLongIcon sx={{ fontSize: 40, color: '#4caf50', mb: 0.5 }} />
              )}
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                {multaComprobante?.comprobante?.nombre || 'comprobante_transferencia.pdf'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                Transferencia recibida a Alias: barberazo.oficial.mp
              </Typography>
              <Typography variant="caption" sx={{ color: '#81c784', fontWeight: 600, display: 'block', mt: 0.5 }}>
                ✓ Archivo adjunto verificado
              </Typography>
            </Box>
          </Paper>

          {showRechazoInput && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#ff8a80', fontWeight: 600 }}>
                Motivo del rechazo del comprobante (se le notificará al cliente):
              </Typography>
              <TextField
                multiline
                rows={2}
                fullWidth
                size="small"
                placeholder="Ej: El importe transferido no coincide o la cuenta de destino es errónea..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
            {!showRechazoInput ? (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<CloseIcon />}
                onClick={() => setShowRechazoInput(true)}
                sx={{ fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
              >
                Rechazar Comprobante
              </Button>
            ) : (
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleRechazarPago}
                sx={{ fontWeight: 800 }}
              >
                Confirmar Rechazo
              </Button>
            )}

            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckCircleIcon />}
              onClick={handleAprobarPago}
              sx={{ fontWeight: 800 }}
            >
              Aprobar Comprobante
            </Button>
          </Box>

          <Button
            variant="text"
            size="small"
            onClick={() => setModalComprobanteOpen(false)}
            sx={{ color: 'rgba(255,255,255,0.6)' }}
          >
            Cerrar sin cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
