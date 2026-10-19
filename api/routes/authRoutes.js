const express = require('express');
const router = express.Router();

// Rutas de autenticación
router.get('/status', (req, res) => res.json({ status: 'ok', route: 'auth' }));

module.exports = router;
