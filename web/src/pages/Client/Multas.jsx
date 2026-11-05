import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Snackbar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { mockStore } from "../../services/mockStore";
import PaymentIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import InfoIcon from '@mui/icons-material/Info';

export const Multas = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => mockStore.getCurrentUser());
  const [multas, setMultas] = useState(() => mockStore.getMultas(mockStore.getCurrentUser()?.email));
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  // Modales CUU 4.1
  const [datosPagoModalOpen, setDatosPagoModalOpen] = useState(false);
  const [cargarModalOpen, setCargarModalOpen] = useState(false);
  const [multaSeleccionada, setMultaSeleccionada] = useState(null);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const loadData = () => {
    const currentUser = mockStore.getCurrentUser();
    setUser(currentUser);
    setMultas(mockStore.getMultas(currentUser?.email));
  };

  const tieneMultaPendiente = multas.some(m => m.estado === 'Pendiente' || m.estado === 'Comprobante Subido');
  const strikes = user?.strikes || 0;

  // Paso 1: Abrir modal con los datos de transferencia
  const handleIniciarPago = (multa) => {
    setMultaSeleccionada(multa);
    setDatosPagoModalOpen(true);
  };

  // Paso 2: Pasar de ver datos a cargar comprobante
  const handleIrACargarComprobante = () => {
    setDatosPagoModalOpen(false);
    setArchivoSeleccionado(null);
    setCargarModalOpen(true);
  };

  // Paso 3: Confirmar carga de archivo
  const handleConfirmarCarga = () => {
    if (!multaSeleccionada) return;
    const nombreArchivo = archivoSeleccionado ? archivoSeleccionado.name : 'comprobante_transferencia.pdf';
    
    // Si es imagen o archivo que podemos convertir a DataURL para previsualizar:
    if (archivoSeleccionado) {
      const reader = new FileReader();
      reader.onload = (e) => {
        mockStore.subirComprobanteMulta(multaSeleccionada.id, {
          nombre: nombreArchivo,
          fecha: new Date().toLocaleDateString('es-AR'),
          previewUrl: e.target.result,
          tipo: archivoSeleccionado.type,
        });
        loadData();
      };
      reader.readAsDataURL(archivoSeleccionado);
    } else {
      mockStore.subirComprobanteMulta(multaSeleccionada.id, {
        nombre: nombreArchivo,
        fecha: new Date().toLocaleDateString('es-AR'),
        previewUrl: null,
      });
      loadData();
    }

    setCargarModalOpen(false);
    setSnackMessage('¡Comprobante enviado! El dueño revisará la transferencia para dar de alta tu cuenta.');
    setSnackOpen(true);
  };

  // Copiar alias al portapapeles
  const handleCopiarAlias = (texto) => {
    navigator.clipboard?.writeText(texto);
    setSnackMessage('¡CBU/Alias copiado al portapapeles!');
    setSnackOpen(true);
  };

  // ===== CHIP SYSTEM =====
  const getStatusChip = (estado, tieneRechazo) => {
    const chipStyles = {
      size: 'small',
      fontWeight: 700,
      borderRadius: 2,
      sx: { px: 1.5, py: 0.5, fontSize: '0.7rem' },
    };

    if (tieneRechazo && estado === 'Pendiente') {
      return (
        <Chip label="Comprobante Rechazado" icon={<InfoIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />
      );
    }

    switch (estado) {
      case 'Pendiente':
        return (
          <Chip label="Pendiente de Pago" icon={<PaymentIcon fontSize="small" />} color="error" variant="filled" {...chipStyles} />
        );
      case 'Comprobante Subido':
        return (
          <Chip label="En Revisión" icon={<HourglassTopIcon fontSize="small" />} color="warning" variant="filled" {...chipStyles} />
        );
      case 'Pagado':
        return (
          <Chip label="Aprobado / Pagado" icon={<CheckCircleIcon fontSize="small" />} color="success" variant="filled" {...chipStyles} />
        );
      default:
        return <Chip label={estado} {...chipStyles} />;
    }
  };

  // ===== MOBILE CARD COMPONENT =====
  const MultaCard = ({ multa }) => {
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
        {/* Top: Date + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
              Fecha
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
              {multa.fecha}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>{getStatusChip(multa.estado, multa.comprobanteRechazado)}</Box>
        </Box>

        {/* Middle: Reason + Amount */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
              Motivo
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
              {multa.motivo}
            </Typography>
            {multa.comprobanteRechazado && multa.motivoRechazo && (
              <Typography variant="caption" sx={{ color: '#ff8a80', display: 'block', mt: 0.5 }}>
                ⚠️ Rechazado: {multa.motivoRechazo}
              </Typography>
            )}
          </Box>
          <Typography variant="h6" sx={{ color: '#ef5350', fontWeight: 800, whiteSpace: 'nowrap' }}>
            $ {Number(multa.monto).toLocaleString('es-AR')}
          </Typography>
        </Box>

        {/* Bottom: Action */}
        <Box sx={{ pt: 1, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {multa.estado === 'Pendiente' ? (
            <Tooltip title="Ver datos de transferencia y cargar comprobante">
              <Button
                variant="contained"
                color="success"
                startIcon={<PaymentIcon fontSize="small" />}
                size="small"
                fullWidth
                sx={{ fontWeight: 700, fontSize: '0.8rem' }}
                onClick={() => handleIniciarPago(multa)}
              >
                Pagar Multa
              </Button>
            </Tooltip>
          ) : multa.estado === 'Comprobante Subido' ? (
            <Button
              variant="outlined"
              color="warning"
              disabled
              startIcon={<HourglassTopIcon fontSize="small" />}
              size="small"
              fullWidth
              sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}
            >
              Comprobante en Revisión
            </Button>
          ) : (
            <Button
              variant="filled"
              color="success"
              disabled
              startIcon={<CheckCircleIcon fontSize="small" />}
              size="small"
              fullWidth
              sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 1 }}
            >
              Pagado / Habilitado
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
          maxWidth: { xs: '100%', md: '1150px', lg: '1350px', xl: '1500px' },
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
              GESTIÓN DE MULTAS Y PENALIZACIONES
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Cliente: <strong style={{ color: 'white' }}>{user?.name}</strong> ({user?.email})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/appointments')}
              sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
            >
              Mis Turnos
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/home')}
              sx={{ backgroundColor: '#1976d2', fontWeight: 700 }}
            >
              Reservar Turno
            </Button>
          </Box>
        </Box>

        {/* TARJETAS DE RESUMEN (STRIKES Y ESTADO) */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Strikes Acumulados
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: strikes >= 2 ? '#ffb74d' : 'white' }}>
                  {strikes} / 3
                </Typography>
                <Chip
                  label={strikes >= 3 ? 'Límite Excedido' : strikes === 2 ? 'Riesgo de Multa' : 'Normal'}
                  size="small"
                  color={strikes >= 2 ? 'warning' : 'default'}
                  variant="outlined"
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1, display: 'block' }}>
                * Cancelar un turno con menos de 24 hs suma 1 strike. Al 3er strike se aplica multa.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Estado de la Cuenta
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: tieneMultaPendiente ? '#ef5350' : '#4caf50' }}>
                  {tieneMultaPendiente ? 'MULTADO' : 'HABILITADO'}
                </Typography>
                <Chip
                  label={tieneMultaPendiente ? 'Turnos bloqueados' : 'Puede reservar'}
                  size="small"
                  color={tieneMultaPendiente ? 'error' : 'success'}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1, display: 'block' }}>
                {tieneMultaPendiente
                  ? 'Aboná la multa pendiente y cargá el comprobante para reactivar tu cuenta.'
                  : 'Tu cuenta está al día sin penalizaciones pendientes.'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* ALERTA VISIBLE SI ESTÁ MULTADO */}
        {tieneMultaPendiente && (
          <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 83, 80, 0.12)', border: '1px solid rgba(239, 83, 80, 0.3)', color: '#ffcdd2' }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Acceso a nuevos turnos restringido</AlertTitle>
            Tenés una multa pendiente de pago. Presioná en "Pagar Multa" para consultar los datos de transferencia y adjuntar tu comprobante. El dueño validará el pago para habilitarte.
          </Alert>
        )}

        {/* MOBILE: CARD LAYOUT (< md) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
          {multas.length === 0 ? (
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
                No registrás multas en tu historial.
              </Typography>
            </Paper>
          ) : (
            multas.map((multa) => <MultaCard key={multa.id} multa={multa} />)
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
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Motivo de la Sanción</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {multas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'rgba(255,255,255,0.5)' }}>
                      No registrás multas en tu historial.
                    </TableCell>
                  </TableRow>
                ) : (
                  multas.map((multa) => (
                    <TableRow
                      key={multa.id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell sx={{ color: 'rgba(255,255,255,0.85)' }}>{multa.fecha}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>
                        {multa.motivo}
                        {multa.comprobanteRechazado && multa.motivoRechazo && (
                          <Typography variant="caption" sx={{ color: '#ff8a80', display: 'block', mt: 0.5 }}>
                            ⚠️ Rechazado: {multa.motivoRechazo}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: '#ef5350', fontWeight: 800 }}>
                        $ {Number(multa.monto).toLocaleString('es-AR')}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(multa.estado, multa.comprobanteRechazado)}
                      </TableCell>
                      <TableCell align="center">
                        {multa.estado === 'Pendiente' ? (
                          <Tooltip title="Ver datos de transferencia y cargar comprobante">
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<PaymentIcon fontSize="small" />}
                              size="small"
                              sx={{ fontWeight: 700, fontSize: '0.8rem', px: 2.5 }}
                              onClick={() => handleIniciarPago(multa)}
                            >
                              Pagar Multa
                            </Button>
                          </Tooltip>
                        ) : multa.estado === 'Comprobante Subido' ? (
                          <Button
                            variant="outlined"
                            color="warning"
                            disabled
                            startIcon={<HourglassTopIcon fontSize="small" />}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.9 }}
                          >
                            En Revisión
                          </Button>
                        ) : (
                          <Button
                            variant="filled"
                            color="success"
                            disabled
                            startIcon={<CheckCircleIcon fontSize="small" />}
                            size="small"
                            sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 1 }}
                          >
                            Pagado / Habilitado
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* BOTÓN VOLVER */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
            sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}
          >
            ← Volver al Inicio
          </Button>
        </Box>
      </Paper>

      {/* MODAL 1: DATOS DE TRANSFERENCIA (CUU 4.1) */}
      <Dialog
        open={datosPagoModalOpen}
        onClose={() => setDatosPagoModalOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '480px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 800, textAlign: 'center', pb: 1 }}>
          Datos para Transferencia
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            Realizá la transferencia por el monto de la sanción a la siguiente cuenta oficial de Barberazo:
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>MONTO A TRANSFERIR</Typography>
              <Typography variant="h6" sx={{ color: '#ef5350', fontWeight: 800 }}>
                $ {multaSeleccionada ? Number(multaSeleccionada.monto).toLocaleString('es-AR') : '5.000'}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>ALIAS</Typography>
                <Typography variant="body1" sx={{ color: 'white', fontWeight: 700 }}>barberazo.oficial.mp</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => handleCopiarAlias('barberazo.oficial.mp')} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Copiar
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>CBU / CVU</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>0000003100084729184729</Typography>
              </Box>
              <Button size="small" variant="outlined" startIcon={<ContentCopyIcon fontSize="small" />} onClick={() => handleCopiarAlias('0000003100084729184729')} sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Copiar
              </Button>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>TITULAR</Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Barberazo SRL - CUIT 30-71649281-9</Typography>
            </Box>
          </Paper>

          <Alert severity="info" sx={{ fontSize: '12px', backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#90caf9' }}>
            Una vez efectuada la transferencia, presioná "Cargar Comprobante" para adjuntar el ticket en PDF, JPG o PNG.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setDatosPagoModalOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="success"
            fullWidth
            startIcon={<UploadFileIcon />}
            onClick={handleIrACargarComprobante}
            sx={{ fontWeight: 800 }}
          >
            Cargar Comprobante
          </Button>
        </DialogActions>
      </Dialog>

      {/* MODAL 2: CARGAR COMPROBANTE (CUU 4.1) */}
      <Dialog
        open={cargarModalOpen}
        onClose={() => setCargarModalOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: '480px',
              p: 2,
              borderRadius: 3,
              backgroundColor: '#161b22',
              border: '1px solid rgba(255,255,255,0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ color: 'white', fontWeight: 800, textAlign: 'center', pb: 1 }}>
          Adjuntar Comprobante de Pago
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            Subí el comprobante emitido por tu banco o billetera virtual (PDF, JPG, PNG).
          </Typography>

          {/* ZONA DE CARGA */}
          <Box
            component="label"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              border: '2px dashed rgba(255,255,255,0.25)',
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.05)',
              },
            }}
          >
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setArchivoSeleccionado(e.target.files[0]);
                }
              }}
            />
            <UploadFileIcon sx={{ fontSize: 48, color: archivoSeleccionado ? '#4caf50' : '#90caf9', mb: 1 }} />
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>
              {archivoSeleccionado ? archivoSeleccionado.name : 'Hacé clic para seleccionar archivo'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
              {archivoSeleccionado ? `${(archivoSeleccionado.size / 1024).toFixed(1)} KB` : 'Formatos aceptados: PDF, JPG, PNG (máx. 5MB)'}
            </Typography>
          </Box>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
            * Al confirmar, se registrará el pago pendiente y se notificará al dueño para que controle la transferencia.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" fullWidth onClick={() => setCargarModalOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
            Volver
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConfirmarCarga}
            sx={{ fontWeight: 800, backgroundColor: '#1976d2' }}
          >
            Enviar Comprobante
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
      />
    </Box>
  );
};
