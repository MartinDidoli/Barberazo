// mockStore.js - Almacén interactivo con persistencia en localStorage para Barberazo

const STORAGE_KEYS = {
  CURRENT_USER: 'barberazo_current_user',
  TURNOS: 'barberazo_turnos',
  MULTAS: 'barberazo_multas',
  STRIKES: 'barberazo_strikes',
  REVIEWS: 'barberazo_reviews',
};

// Cuentas de prueba predefinidas
export const TEST_ACCOUNTS = {
  cliente: {
    email: 'cliente@barberazo.com',
    name: 'Rodrigo Bozio',
    role: 'cliente',
    status: 'Activo',
    strikes: 2, // Comienza con 2 strikes para que una cancelación simule llegar a 3 y multar
    label: 'Cliente (Rodrigo - Activo)',
  },
  multado: {
    email: 'multado@barberazo.com',
    name: 'Lucas Martino',
    role: 'cliente',
    status: 'Multado',
    strikes: 3,
    label: 'Cliente (Lucas - Multado)',
  },
  empleado: {
    email: 'empleado@barberazo.com',
    name: 'Franco Barbero',
    role: 'empleado',
    status: 'Activo',
    strikes: 0,
    label: 'Empleado (Franco)',
  },
  dueno: {
    email: 'dueno@barberazo.com',
    name: 'Martín Dueño',
    role: 'dueño',
    status: 'Activo',
    strikes: 0,
    label: 'Dueño (Martín)',
  },
};

// Turnos iniciales mock
const INITIAL_TURNOS = [
  {
    id: 1,
    cliente: 'Rodrigo Bozio',
    clienteEmail: 'cliente@barberazo.com',
    servicios: ['Corte de Pelo Degradé'],
    barbero: 'Franco Barbero',
    fecha: '12/10/2026',
    horario: '18:40',
    monto: 12000,
    duracion: 30,
    estado: 'pendiente',
    horasRestantes: 18, // < 24hs para provocar strike al cancelar
    resenaDejada: false,
  },
  {
    id: 2,
    cliente: 'Rodrigo Bozio',
    clienteEmail: 'cliente@barberazo.com',
    servicios: ['Perfilado de Barba'],
    barbero: 'Lucas Martino',
    fecha: '05/10/2026',
    horario: '12:00',
    monto: 8000,
    duracion: 20,
    estado: 'completado',
    resenaDejada: false,
  },
  {
    id: 3,
    cliente: 'Rodrigo Bozio',
    clienteEmail: 'cliente@barberazo.com',
    servicios: ['Corte + Barba'],
    barbero: 'Franco Barbero',
    fecha: '28/09/2026',
    horario: '15:30',
    monto: 18000,
    duracion: 50,
    estado: 'completado',
    resenaDejada: true,
  },
  {
    id: 4,
    cliente: 'Rodrigo Bozio',
    clienteEmail: 'cliente@barberazo.com',
    servicios: ['Diseño de Cejas'],
    barbero: 'Martín Barbero',
    fecha: '15/09/2026',
    horario: '11:00',
    monto: 6000,
    duracion: 15,
    estado: 'cancelado_cliente',
    resenaDejada: false,
  },
  {
    id: 5,
    cliente: 'Lucas Martino',
    clienteEmail: 'multado@barberazo.com',
    servicios: ['Corte de Pelo', 'Barba'],
    barbero: 'Franco Barbero',
    fecha: '14/10/2026',
    horario: '11:15',
    monto: 20000,
    duracion: 50,
    estado: 'pendiente',
    horasRestantes: 48,
    resenaDejada: false,
  },
  {
    id: 6,
    cliente: 'Alejandro Rozas',
    clienteEmail: 'alejandro@barberazo.com',
    servicios: ['Corte Clásico'],
    barbero: 'Martín Barbero',
    fecha: '12/10/2026',
    horario: '12:45',
    monto: 12000,
    duracion: 30,
    estado: 'cancelado_sin_multa',
    resenaDejada: false,
  },
];

// Multas iniciales
const INITIAL_MULTAS = [
  {
    id: 101,
    clienteEmail: 'multado@barberazo.com',
    fecha: '06/10/2026',
    motivo: 'Acumulación de 3 cancelaciones tardías (< 24 hs)',
    monto: 5000,
    estado: 'Pendiente',
  },
  {
    id: 102,
    clienteEmail: 'cliente@barberazo.com',
    fecha: '15/08/2026',
    motivo: 'Cancelación tardía anterior',
    monto: 5000,
    estado: 'Pagado',
  },
];

// --- GESTIÓN DE SESIÓN ---

export const mockStore = {
  // Inicialización segura
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.TURNOS)) {
      localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(INITIAL_TURNOS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MULTAS)) {
      localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify(INITIAL_MULTAS));
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem('barberazo_role');
      localStorage.removeItem('barberazo_user_name');
      localStorage.removeItem('barberazo_user_status');
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      localStorage.setItem('barberazo_role', user.role);
      localStorage.setItem('barberazo_user_name', user.name);
      localStorage.setItem('barberazo_user_status', user.status);
    }
  },

  login(email) {
    this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    let account = Object.values(TEST_ACCOUNTS).find(
      (a) => a.email.toLowerCase() === cleanEmail
    );

    // Fallback si ingresa otro email
    if (!account) {
      account = {
        email: cleanEmail || 'cliente@barberazo.com',
        name: 'Cliente ' + (cleanEmail.split('@')[0] || 'Nuevo'),
        role: 'cliente',
        status: 'Activo',
        strikes: 0,
      };
    }

    // Verificar si tiene multas pendientes para ajustar su status
    const multas = this.getMultas(account.email);
    const tienePendiente = multas.some((m) => m.estado === 'Pendiente');
    if (tienePendiente) {
      account.status = 'Multado';
    }

    this.setCurrentUser(account);
    return account;
  },

  logout() {
    this.setCurrentUser(null);
  },

  // --- GESTIÓN DE TURNOS ---

  getTurnos() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TURNOS)) || [];
    } catch {
      return INITIAL_TURNOS;
    }
  },

  getTurnosForCurrentUser() {
    const user = this.getCurrentUser();
    const all = this.getTurnos();
    if (!user) return [];
    if (user.role === 'empleado' || user.role === 'dueño') {
      return all;
    }
    return all.filter((t) => t.clienteEmail === user.email);
  },

  crearTurno({ servicios, barbero, fecha, horario, monto, duracion, observaciones }) {
    this.init();
    const user = this.getCurrentUser() || TEST_ACCOUNTS.cliente;
    const turnos = this.getTurnos();

    const nuevoTurno = {
      id: Date.now(),
      cliente: user.name,
      clienteEmail: user.email,
      servicios: servicios.map((s) => s.name || s),
      barbero: barbero || 'Franco Barbero',
      fecha: fecha || '12/10/2026',
      horario: horario || '18:40',
      monto: monto || 12000,
      duracion: duracion || 30,
      observaciones: observaciones || '',
      estado: 'pendiente',
      horasRestantes: 28, // Turno nuevo con más de 24hs
      resenaDejada: false,
    };

    const actualizados = [nuevoTurno, ...turnos];
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(actualizados));
    return nuevoTurno;
  },

  // CU 1.5 - Cancelación por cliente con regla de < 24hs y 3 strikes
  cancelarTurnoCliente(turnoId) {
    this.init();
    const turnos = this.getTurnos();
    const turno = turnos.find((t) => t.id === turnoId);
    const user = this.getCurrentUser();

    if (!turno) return { error: 'Turno no encontrado' };

    // Actualizar estado del turno
    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: 'cancelado_cliente' } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));

    // Verificar si pasaron menos de 24 horas (o turno.horasRestantes < 24)
    const penalizaStrike = (turno.horasRestantes || 0) < 24;
    let newStrikes = (user?.strikes || 0);
    let seMulta = false;

    if (penalizaStrike && user) {
      newStrikes += 1;

      if (newStrikes >= 3) {
        seMulta = true;
        newStrikes = 3;
        user.status = 'Multado';

        // Generar la multa en la lista
        const multas = this.getMultas();
        const nuevaMulta = {
          id: Date.now(),
          clienteEmail: user.email,
          fecha: new Date().toLocaleDateString('es-AR'),
          motivo: 'Cancelación tardía acumulada (< 24 hs - 3 Strikes)',
          monto: 5000,
          estado: 'Pendiente',
        };
        localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify([nuevaMulta, ...multas]));
      }

      user.strikes = newStrikes;
      this.setCurrentUser(user);
    }

    return {
      success: true,
      penalizaStrike,
      newStrikes,
      seMulta,
    };
  },

  // CU 1.6 - Cancelación por Dueño (sin multa)
  cancelarTurnoDueno(turnoId) {
    this.init();
    const turnos = this.getTurnos();
    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: 'cancelado_sin_multa' } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));
    return { success: true };
  },

  // CU 1.3 - Confirmar Asistencia
  marcarAsistencia(turnoId, asistio) {
    this.init();
    const turnos = this.getTurnos();
    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: asistio ? 'completado' : 'no_asistio' } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));
    return { success: true };
  },

  // CU 1.4 - Dejar Reseña
  guardarResena(turnoId, rating, comment) {
    this.init();
    const turnos = this.getTurnos();
    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, resenaDejada: true } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));

    // Guardar detalle de reseña
    const reviewsRaw = localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]';
    const reviews = JSON.parse(reviewsRaw);
    reviews.push({
      turnoId,
      rating,
      comment,
      fecha: new Date().toLocaleDateString('es-AR'),
    });
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return { success: true };
  },

  // --- GESTIÓN DE MULTAS ---

  getMultas(userEmail) {
    this.init();
    let multas = [];
    try {
      multas = JSON.parse(localStorage.getItem(STORAGE_KEYS.MULTAS)) || [];
    } catch {
      multas = INITIAL_MULTAS;
    }

    if (userEmail) {
      return multas.filter((m) => m.clienteEmail === userEmail);
    }
    return multas;
  },

  pagarMulta(multaId) {
    this.init();
    const multas = this.getMultas();
    const multasActualizadas = multas.map((m) =>
      m.id === multaId ? { ...m, estado: 'Pagado' } : m
    );
    localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify(multasActualizadas));

    // Si no quedan más multas pendientes para el usuario actual, se lo habilita
    const user = this.getCurrentUser();
    if (user) {
      const pendientes = multasActualizadas.filter(
        (m) => m.clienteEmail === user.email && m.estado === 'Pendiente'
      );
      if (pendientes.length === 0) {
        user.status = 'Activo';
        user.strikes = 0;
        this.setCurrentUser(user);
      }
    }

    return { success: true };
  },
};
