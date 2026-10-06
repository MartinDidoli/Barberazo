import { AppBar, Toolbar, Typography, Box, Button, Chip } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = localStorage.getItem('barberazo_role') || 'cliente';
  const currentUser = localStorage.getItem('barberazo_user_name') || 'Rodrigo Bozio';

  const roleColor = {
    cliente: 'primary',
    empleado: 'info',
    dueño: 'secondary',
  }[currentRole] || 'default';

  const handleLogout = () => {
    localStorage.removeItem('barberazo_role');
    localStorage.removeItem('barberazo_user_name');
    localStorage.removeItem('barberazo_user_status');
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'rgba(14, 17, 23, 0.95)', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        
        {/* LOGO & BRAND */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box 
            sx={{ 
              width: 38, 
              height: 38, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '18px',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 12px rgba(25, 118, 210, 0.5)'
            }}
          >
            ✂
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 800, letterSpacing: '1px', lineHeight: 1.1 }}>
              BARBERAZO
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '1.5px', textTransform: 'uppercase', fontSize: '9px' }}>
              Barber Shop & Style
            </Typography>
          </Box>
        </Link>

        {/* NAVEGACIÓN Y PERFIL DE USUARIO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
          
          {location.pathname !== '/login' && (
            <>
              {/* Indicador del usuario autenticado */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {currentUser}
                </Typography>
                <Chip 
                  label={currentRole.toUpperCase()} 
                  size="small" 
                  color={roleColor}
                  sx={{ fontWeight: 'bold', fontSize: '10px' }}
                />
              </Box>

              {/* Botón tradicional de Cerrar Sesión */}
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleLogout}
                sx={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  borderColor: 'rgba(255,255,255,0.25)',
                  fontSize: '12px',
                  '&:hover': { borderColor: '#ef5350', color: '#ff8a80' }
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;