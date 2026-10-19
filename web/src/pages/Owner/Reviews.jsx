import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Reviews = () => {
  const navigate = useNavigate();

    const reviews = [
    { cliente: 'Rodrigo Bozio', numEstrellas: '1', reseña: 'Malisimo el corte'},
    { cliente: 'Lucas Martino', numEstrellas: '3', reseña: 'Me arruinó la barba'},
    { cliente: 'Mateo Bertin', numEstrellas: '2', reseña: 'Meh'},
    { cliente: 'Martin Didoli', numEstrellas: '4', reseña: 'Regular el corte'},
  ];

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          padding: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "900px",
            backgroundColor: "transparent",
            border: { xs: "none", md: "1px solid rgba(255,255,255,0.2)" },
            padding: { xs: 1, md: 4 },
            borderRadius: 2,
          }}
        >
          {/* ENCABEZADO */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            {/* Flecha volver (Mobile) */}
            <Button
              onClick={() => navigate("/home-staff")}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "white",
                fontSize: "24px",
                minWidth: "40px",
                p: 0,
              }}
            >
              ←
            </Button>
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: "bold",
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              RESEÑAS
            </Typography>
          </Box>

          {/* VISTA DESKTOP (Tabla) */}
          <TableContainer
            component={Paper}
            sx={{
              display: { xs: "none", md: "block" },
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "rgba(144, 202, 249, 0.2)" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Cliente
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Num Estrellas
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Reseña
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.cliente}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      {review.cliente}
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      {review.numEstrellas}
                    </TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      {review.reseña}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* VISTA MOBILE (Lista apilada) */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              gap: 3,
            }}
          >
            {reviews.map((review) => (
              <Box
                key={review.cliente}
                sx={{
                  borderBottom: "1px solid rgba(255,255,255,0.2)",
                  pb: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ color: "white" }}>
                  <strong>Cliente:</strong> {review.cliente}
                </Typography>
                <Typography sx={{ color: "white" }}>
                  <strong>Numero de estrellas:</strong> {review.numEstrellas}
                </Typography>
                <Typography sx={{ color: "white" }}>
                  <strong>Reseña:</strong>
                  <br />
                  {review.reseña}
                </Typography>

                
              </Box>
            ))}
          </Box>

          {/* Botón Volver Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/home-staff")}
              sx={{
                backgroundColor: "#ffcccc",
                color: "black",
                "&:hover": { backgroundColor: "#ffb3b3" },
                fontWeight: "bold",
                width: "120px",
              }}
            >
              Volver
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};
