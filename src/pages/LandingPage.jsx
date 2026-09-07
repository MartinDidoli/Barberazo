import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
	const navigate = useNavigate()
	return (
		<>
			<h1>BIENVENIDOS A BARBERAZO</h1>
			<img src="" alt="imagen de barberazo"></img>
			<p>Mensaje motivacional</p>
			<Button variant="contained" color='primary'  onClick={()=> navigate("/login")}>Ingresar</Button>
		</>
	)
}
