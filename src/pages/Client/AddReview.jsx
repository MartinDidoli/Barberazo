import { Box, Button, Rating, TextareaAutosize } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const AddReview = () => {
    const navigate = useNavigate()
  return (
    <>
      <h1>Dejar reseña</h1>
      <Box>
        <Rating
          name="hover-feedback"
          //   value={value}
          precision={1}
          //   getLabelText={getLabelText}
          /* onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }} */
          //   emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        {/* {value !== null && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
        )} */}

        <h3>¿Desea dejar una reseña?</h3>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="Minimum 3 rows"
          style={{ width: 200 }}
        />
        <Box>
            <Button variant='outlined' color='primary' onClick={()=>navigate('/appointments')}>Volver</Button>
            <Button variant='contained' color='primary'onClick={()=>navigate('/appointments')}>Confirmar</Button>
        </Box>
      </Box>
    </>
  );
};
