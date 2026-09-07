import {Button, TextField, Box} from '@mui/material';

export const LoginPage = () => {
	const borderRadius="10px"
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
			<p>¿Olvidaste tu contraseña?<a src="" target='_blank'>Recuperar contraseña aquí</a></p>
			<Button variant="contained">Ingresar</Button>
			<p>¿No tenés cuenta?</p>
			<Button variant="outlined">Registarse</Button>
		</>
	)
}
