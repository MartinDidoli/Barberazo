import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Chip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockStore } from '../../services/mockStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(mockStore.getCurrentUser());

  // Actualizar usuario ante cambios de ruta o storage
  useEffect(() => {
    setCurrentUser(mockStore.getCurrentUser());
  }, [location.pathname]);

  const roleColor = {
    cliente: 'primary',
    empleado: 'info',
    dueño: 'secondary',
  }[currentUser?.role] || 'default';

  const handleLogout = () => {
    mockStore.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  // El logo te lleva al Home según rol si estás logueado, o a la Landing si no
  const handleLogoClick = () => {
    if (!currentUser) {
      navigate('/');
    } else if (currentUser.role === 'cliente') {
      navigate('/home');
    } else {
      navigate('/home-staff');
    }
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
        
        {/* LOGO & BRAND (Navegación inteligente) */}
        <Box 
          onClick={handleLogoClick}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
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
        </Box>

        {/* NAVEGACIÓN Y PERFIL DE USUARIO */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2.5 } }}>
          
          {currentUser ? (
            <>
              {/* Usuario logueado */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  {currentUser.name}
                </Typography>
                <Chip 
                  label={currentUser.role.toUpperCase()} 
                  size="small" 
                  color={roleColor}
                  sx={{ fontWeight: 'bold', fontSize: '10px' }}
                />
              </Box>

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
          ) : (
            // Usuario anónimo / sin sesión (no mostramos botón redundante en la landing ni en login)
            location.pathname !== '/login' && location.pathname !== '/' && (
              <Button 
                variant="contained" 
                size="small"
                onClick={() => navigate('/login')}
                sx={{ 
                  backgroundColor: '#1976d2', 
                  fontSize: '13px',
                  fontWeight: 700,
                  px: 2.5
                }}
              >
                Iniciar Sesión
              </Button>
            )
          )}

        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;