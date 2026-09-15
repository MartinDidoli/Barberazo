import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate()
  return (
    <>
      <h1>Mi perfil</h1>
      <Box>
        {/* Fila 1 */}
        <Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="1" variant="outlined" label=""></TextField>
          </Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="2" variant="outlined" label=""></TextField>
          </Box>
        </Box>

        {/* Fila 2 */}
        <Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="3" variant="outlined" label=""></TextField>
          </Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="4" variant="outlined" label=""></TextField>
          </Box>
        </Box>

        {/* Fila 3 */}
        <Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="5" variant="outlined" label=""></TextField>
          </Box>
          <Box>
            <h5>Algo</h5>
            <TextField id="6" variant="outlined" label=""></TextField>
          </Box>
        </Box>
      </Box>

      <Button onClick={()=>navigate('/home')}>Volver</Button>
      <Box>
        <Button>Editar Perfil</Button>
        <Button>Eliminar Perfil</Button>
      </Box>
    </>
  );
};
