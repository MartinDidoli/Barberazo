import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#111111', borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <img src="" alt="logo barberazo" style={{ height: '40px', width: '40px', borderRadius: '50%', border: '1px solid white' }} />
          
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
            BARBERAZO
          </Typography>
          
        </Link>

        <Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Bienvenido
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default Navbar;