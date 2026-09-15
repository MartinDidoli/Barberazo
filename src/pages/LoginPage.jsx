import { Button, TextField, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
	const borderRadius="10px"
	const navigate = useNavigate();
	return (
		<>
			<Box component="form" sx={{display: "flex", flexDirection: "column", gap: 2}}>
				<TextField
					id="input-email"
					label="Email"
					variant="filled"
					sx={{ backgroundColor: "#f2f2f2 ", borderRadius: borderRadius}}
				/>
				<TextField
					id="input-password"
					label="Contraseña"
					variant="filled"
					sx={{ backgroundColor: '#f5f5f5', borderRadius: borderRadius}}
				/>
			</Box>
			<Typography variant="body2" sx={{ textAlign: 'center' }}>
  				¿Olvidaste tu contraseña? <span style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/forgot-password')}>Recuperar contraseña aquí</span>
			</Typography>
			<Button variant="contained" onClick={() => navigate('/home')}>Ingresar</Button>
			<p>¿No tenés cuenta?</p>
			<Button variant="outlined" onClick={() => navigate('/register')}>Registrarse</Button>
		</>
	)
}
