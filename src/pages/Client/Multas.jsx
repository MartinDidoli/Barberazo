import {Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar, Chip} from '@mui/material'
import { useNavigate } from "react-router-dom";

import Navbar from '../../components/navbar/Navbar';

export const Multas = () => {
    const navigate = useNavigate();
    const ejemploMultas = [
        { id: 1, fecha: '2026-01-10', monto: '$50', estado: 'Pendiente' },
        { id: 2, fecha: '2026-02-05', monto: '$120', estado: 'Pagado' },
        { id: 3, fecha: '2026-03-12', monto: '$80', estado: 'Pendiente' },
    ];
    return (
        <>
            <h1>Multas</h1>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TableContainer component={Paper} sx={{ flex: 1 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Estado</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                            {ejemploMultas.map((multa) => (
                                <TableRow key={multa.id}>
                                    <TableCell>{multa.fecha}</TableCell>
                                    <TableCell>{multa.monto}</TableCell>
                                    <TableCell>{multa.estado}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                    {ejemploMultas.map((multa) => (
                        <Box key={multa.id} sx={{ width: '140px' }}>
                            {multa.estado === 'Pendiente' && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
                                >
                                    Pagar
                                </Button>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate('/home')}
                    sx={{
                        bgcolor: '#fca5a5',
                        color: '#000000',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#f87171' }
                    }}
                >
                    Volver
                </Button>
            </Box>
        </>
    );
}
                  