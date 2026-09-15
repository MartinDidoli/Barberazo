import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Appointments = () => {
  const navigate = useNavigate()

  const rows = [
    {
      name: "asdv",
      calories: "asd",
      fat: "adsgfdgfnh",
      /* BOTON HARDCODEADO DE NAVEGACION */
      carbs: <Button color= 'primary' variant="contained" onClick={()=>navigate('/add-review')}> Dejar reseña</Button>,
    },
    {
      name: "3regnh",
      calories: "fdgh",
      fat: "ergthyu7",
      carbs: "esgrthy",
    },
    {
      name: "dxcfg",
      calories: "sdfg",
      fat: "345ty",
      carbs: "3refgf",
    },
    {
      name: "dfsfdbg",
      calories: "sfdgbn",
      fat: "sdgg",
      carbs: "cbvnj",
    },
    {
      name: "efrgd",
      calories: "sgfb",
      fat: "cvxbcnv",
      carbs: "r4thy",
    },
  ];

  return (
    <>
      <h1>Mis turnos</h1>
      {/* TABLE de turnos */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">3regsfg</TableCell>
              <TableCell align="right">123wegh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" onClick={()=>navigate('/home')}>
          Volver
      </Button>
    </>
  );
};
