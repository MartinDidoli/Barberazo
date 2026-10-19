require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const fechaRoutes = require('./routes/fechaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const resenaRoutes = require('./routes/resenaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Barbería - Backend activo' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes); // Módulo 1 - Pedro
app.use('/api/fechas', fechaRoutes);       // Módulo 1 - Pedro
app.use('/api/empleados', empleadoRoutes); // Módulo 2 - Mateo
app.use('/api/clientes', clienteRoutes);   // Módulo 2 - Mateo
app.use('/api/turnos', turnoRoutes);       // Módulo 3 - Lucas
app.use('/api/resenas', resenaRoutes);     // Módulo 3 - Lucas
app.use('/api/pagos', pagoRoutes);         // Módulo 3 - Lucas (CUU4.1)

async function startServer() {
  try {
    await testConnection();
    console.log('Conexión a MySQL establecida');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar con MySQL:', error.message);
    process.exit(1);
  }
}

startServer();
