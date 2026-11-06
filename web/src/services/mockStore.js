// mockStore.js - Almacén interactivo con persistencia en localStorage para Barberazo

const STORAGE_KEYS = {
  CURRENT_USER: 'barberazo_current_user',
  TURNOS: 'barberazo_turnos',
  MULTAS: 'barberazo_multas',
  STRIKES: 'barberazo_strikes',
  REVIEWS: 'barberazo_reviews',
};

const parseTurnoDate = (fecha) => {
  if (!fecha || typeof fecha !== 'string') return null;
  const match = fecha.match(/^\d{2}\/\d{2}\/\d{4}$/);
  if (!match) return null;

  const [day, month, year] = fecha.split('/').map(Number);
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const turnoReviewVencido = (turno) => {
  if (!turno || turno.estado !== 'completado') return false;

  const turnoDate = parseTurnoDate(turno.fecha);
  if (!turnoDate) return false;

  const diffDays = Math.floor((new Date().getTime() - turnoDate.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 30;
};

// Cuentas de prueba predefinidas
export const TEST_ACCOUNTS = {
  cliente: {
    email: 'cliente@barberazo.com',
    password: '123456',
    name: 'Rodrigo Bozio',
    role: 'cliente',
    status: 'Activo',
    strikes: 2, // Comienza con 2 strikes para que una cancelación simule llegar a 3 y multar
    label: 'Cliente (Rodrigo - Activo)',
  },
  multado: {
    email: 'multado@barberazo.com',
    password: '123456',
    name: 'Lucas Martino',
    role: 'cliente',
    status: 'Multado',
    strikes: 3,
    label: 'Cliente (Lucas - Multado)',
  },
  bloqueado: {
    email: 'bloqueado@barberazo.com',
    password: '123456',
    name: 'Angel Di Maria',
    role: 'cliente',
    status: 'Bloqueado',
    strikes: 1,
    label: 'Cliente (Angel - Bloqueado)',
  },
  empleado: {
    email: 'empleado@barberazo.com',
    password: '123456',
    name: 'Franco Barbero',
    role: 'empleado',
    status: 'Activo',
    strikes: 0,
    label: 'Empleado (Franco)',
  },
  dueno: {
    email: 'dueno@barberazo.com',
    password: '123456',
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
    fecha: '08/11/2026',
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
    fecha: '02/11/2026',
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
    fecha: '26/10/2026',
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
    fecha: '15/10/2026',
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
    fecha: '10/11/2026',
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
    fecha: '08/11/2026',
    horario: '12:45',
    monto: 12000,
    duracion: 30,
    estado: 'cancelado_sin_multa',
    resenaDejada: false,
  },
  {
    id: 7,
    cliente: 'Rodrigo Bozio',
    clienteEmail: 'cliente@barberazo.com',
    servicios: ['Diseño de Cejas'],
    barbero: 'Martín Barbero',
    fecha: '01/09/2026',
    horario: '11:00',
    monto: 6000,
    duracion: 15,
    estado: 'completado',
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

  login(email, password) {
    this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const customUsersRaw = localStorage.getItem('barberazo_custom_users') || '[]';
    let customUsers = [];
    try {
      customUsers = JSON.parse(customUsersRaw);
    } catch {
      customUsers = [];
    }

    let account = customUsers.find(
      (a) => a.email.toLowerCase() === cleanEmail && (a.password || '123456') === cleanPassword
    );

    if (!account) {
      account = Object.values(TEST_ACCOUNTS).find((a) => {
        return a.email.toLowerCase() === cleanEmail && (a.password || '123456') === cleanPassword;
      });
    }

    if (!account) {
      return null;
    }

    if ((account.status || '').toLowerCase() === 'bloqueado') {
      return { ...account, blocked: true };
    }

    // Verificar si tiene multas pendientes para ajustar su status
    const multas = this.getMultas(account.email);
    const tienePendiente = multas.some((m) => m.estado === 'Pendiente');
    const accountToSave = { ...account };
    if (tienePendiente) {
      accountToSave.status = 'Multado';
    }
    delete accountToSave.password;

    this.setCurrentUser(accountToSave);
    return accountToSave;
  },

  register({ nombre, apellido, email, telefono, password }) {
    this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    const customUsersRaw = localStorage.getItem('barberazo_custom_users') || '[]';
    let customUsers = [];
    try {
      customUsers = JSON.parse(customUsersRaw);
    } catch {
      customUsers = [];
    }

    if (
      customUsers.some((u) => u.email.toLowerCase() === cleanEmail) ||
      Object.values(TEST_ACCOUNTS).some((u) => u.email.toLowerCase() === cleanEmail)
    ) {
      return { error: 'El correo electrónico ya se encuentra registrado' };
    }

    const newUser = {
      email: cleanEmail,
      password: password || '123456',
      name: `${nombre.trim()} ${apellido.trim()}`.trim() || 'Nuevo Cliente',
      role: 'cliente',
      status: 'Activo',
      strikes: 0,
      telefono: telefono ? telefono.trim() : '',
      label: `Cliente (${nombre.trim()} - Activo)`,
    };

    customUsers.push(newUser);
    localStorage.setItem('barberazo_custom_users', JSON.stringify(customUsers));

    const userToSave = { ...newUser };
    delete userToSave.password;
    this.setCurrentUser(userToSave);

    return { success: true, user: userToSave };
  },

  logout() {
    this.setCurrentUser(null);
  },

  // --- GESTIÓN DE TURNOS ---

  getTurnos() {
    this.init();
    try {
      const turnos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TURNOS)) || [];
      const actualizados = turnos.map((turno) => {
        if (turno.estado === 'completado' && !turno.resenaDejada && turnoReviewVencido(turno)) {
          return { ...turno, resenaDejada: true };
        }
        return turno;
      });

      if (JSON.stringify(actualizados) !== JSON.stringify(turnos)) {
        localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(actualizados));
      }

      return actualizados;
    } catch {
      const actualizados = INITIAL_TURNOS.map((turno) =>
        turno.estado === 'completado' && !turno.resenaDejada && turnoReviewVencido(turno)
          ? { ...turno, resenaDejada: true }
          : turno
      );
      localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(actualizados));
      return actualizados;
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

    // Verificar si pasaron menos de 24 horas
    let horas = turno.horasRestantes;
    if (typeof horas !== 'number') {
      const match = (turno.fecha || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        const [_, day, month, year] = match;
        const [h = 12, m = 0] = (turno.horario || '12:00').split(':').map(Number);
        const fechaTurno = new Date(Number(year), Number(month) - 1, Number(day), h, m);
        horas = (fechaTurno.getTime() - Date.now()) / (1000 * 60 * 60);
      } else {
        horas = 12; // por defecto si no se puede parsear asumimos < 24hs
      }
    }
    const penalizaStrike = horas < 24;
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
    const turno = turnos.find((t) => t.id === turnoId);

    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, estado: asistio ? 'completado' : 'no_asistio' } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));

    if (!asistio && turno) {
      const clienteEmail = (turno.clienteEmail || '').trim().toLowerCase();
      const user = this.getCurrentUser();
      const accountEntry = Object.entries(TEST_ACCOUNTS).find(([, acc]) =>
        (acc.email || '').trim().toLowerCase() === clienteEmail
      );

      const targetUser = accountEntry
        ? { ...accountEntry[1] }
        : (user && (user.email || '').trim().toLowerCase() === clienteEmail ? { ...user } : null);

      if (targetUser) {
        const strikesActuales = Number(targetUser.strikes || 0);
        const nuevosStrikes = Math.min(strikesActuales + 1, 3);
        targetUser.strikes = nuevosStrikes;

        if (nuevosStrikes >= 3) {
          targetUser.status = 'Multado';
        } else {
          targetUser.status = 'Activo';
        }

        if (accountEntry) {
          TEST_ACCOUNTS[accountEntry[0]] = targetUser;
        }

        const currentUser = this.getCurrentUser();
        if (currentUser && (currentUser.email || '').trim().toLowerCase() === clienteEmail) {
          this.setCurrentUser(targetUser);
        }
      }
    }

    return { success: true };
  },

  // CU 1.4 - Dejar Reseña
  guardarResena(turnoId, rating, comment) {
    this.init();
    const turnos = this.getTurnos();
    const turnoActual = turnos.find((t) => t.id === turnoId);

    if (!turnoActual || turnoActual.estado !== 'completado' || turnoActual.resenaDejada || turnoReviewVencido(turnoActual)) {
      return { success: false, error: 'La reseña ya no puede enviarse porque el turno venció o ya fue registrado.' };
    }

    const turnosActualizados = turnos.map((t) =>
      t.id === turnoId ? { ...t, resenaDejada: true } : t
    );
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosActualizados));

    // Guardar detalle de reseña
    const reviewsRaw = localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]';
    const reviews = JSON.parse(reviewsRaw);
    reviews.push({
      id: Date.now(),
      turnoId,
      cliente: turnoActual.cliente || 'Rodrigo Bozio',
      clienteEmail: turnoActual.clienteEmail || 'cliente@barberazo.com',
      barbero: turnoActual.barbero || 'Franco Barbero',
      servicio: Array.isArray(turnoActual.servicios) ? turnoActual.servicios.join(' + ') : turnoActual.servicio || 'Corte de Pelo',
      rating,
      comment,
      fecha: new Date().toLocaleDateString('es-AR'),
    });
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return { success: true };
  },

  getReviews() {
    this.init();
    const defaultReviews = [
      { id: 1, cliente: 'Rodrigo Bozio', barbero: 'Franco Barbero', servicio: 'Corte + Barba', rating: 5, comment: 'Excelente atención de Franco, muy detallista con el degradé.', fecha: '28/10/2026' },
      { id: 2, cliente: 'Lucas Martino', barbero: 'Franco Barbero', servicio: 'Perfilado de Barba', rating: 4, comment: 'Muy buen trabajo y rápido. El local impecable.', fecha: '25/10/2026' },
      { id: 3, cliente: 'Mateo Bertin', barbero: 'Martín Dueño', servicio: 'Corte Clásico', rating: 4, comment: 'Quedó muy prolijo. Recomendado.', fecha: '20/10/2026' },
      { id: 4, cliente: 'Martín Didoli', barbero: 'Lucas Martino', servicio: 'Diseño de Cejas', rating: 3, comment: 'El servicio estuvo bien aunque hubo 10 minutos de demora.', fecha: '15/10/2026' },
      { id: 5, cliente: 'Alejandro Rozas', barbero: 'Franco Barbero', servicio: 'Lavado y Peinado', rating: 5, comment: 'Puntualidad y gran trato, como siempre.', fecha: '10/10/2026' },
    ];

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!raw || JSON.parse(raw).length === 0) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(defaultReviews));
        return defaultReviews;
      }
      return JSON.parse(raw);
    } catch {
      return defaultReviews;
    }
  },

  getClientes() {
    this.init();
    const defaultClientes = [
      { id: 1, nombre: 'Rodrigo Bozio', telefono: '115135', email: 'cliente@barberazo.com', estado: 'activo', strikes: 2 },
      { id: 2, nombre: 'Mateo Bertin', telefono: '2352352352', email: 'elcap@utn.com', estado: 'activo', strikes: 0 },
      { id: 3, nombre: 'Lucas Martino', telefono: '232524524', email: 'multado@barberazo.com', estado: 'multado', strikes: 3 },
      { id: 4, nombre: 'Alejandro Rozas', telefono: '5675685685', email: 'bloqueado@barberazo.com', estado: 'bloqueado', strikes: 1 },
    ];
    try {
      const raw = localStorage.getItem('barberazo_clientes_list');
      if (!raw) {
        localStorage.setItem('barberazo_clientes_list', JSON.stringify(defaultClientes));
        return defaultClientes;
      }
      return JSON.parse(raw);
    } catch {
      return defaultClientes;
    }
  },

  guardarClientes(clientes) {
    localStorage.setItem('barberazo_clientes_list', JSON.stringify(clientes));
  },

  bloquearCliente(clienteId, motivo) {
    const clientes = this.getClientes();
    const actualizados = clientes.map(c => c.id === clienteId ? { ...c, estado: 'bloqueado', motivoBloqueo: motivo } : c);
    this.guardarClientes(actualizados);
    return { success: true };
  },

  desbloquearCliente(clienteId) {
    const clientes = this.getClientes();
    const actualizados = clientes.map(c => c.id === clienteId ? { ...c, estado: 'activo', motivoBloqueo: '' } : c);
    this.guardarClientes(actualizados);
    return { success: true };
  },

  // Subir comprobante por el cliente
  subirComprobanteMulta(multaId, archivoInfo) {
    this.init();
    const multas = this.getMultas();
    const actualizadas = multas.map(m => {
      if (m.id === multaId) {
        return {
          ...m,
          estado: 'Comprobante Subido',
          comprobante: archivoInfo || {
            nombre: 'comprobante_transferencia.pdf',
            fecha: new Date().toLocaleDateString('es-AR'),
            url: null,
          }
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify(actualizadas));
    return { success: true };
  },

  // Aprobar comprobante por el Dueño
  aprobarComprobanteMulta(multaId) {
    this.init();
    const multas = this.getMultas();
    const multa = multas.find(m => m.id === multaId);
    const actualizadas = multas.map(m => m.id === multaId ? { ...m, estado: 'Pagado' } : m);
    localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify(actualizadas));

    // Reiniciar strikes y estado al cliente en la lista general y en el user actual si coincide
    if (multa?.clienteEmail) {
      const email = multa.clienteEmail.toLowerCase();
      // Actualizar en lista de clientes
      const clientes = this.getClientes();
      const clientesActualizados = clientes.map(c => {
        if (c.email.toLowerCase() === email) {
          return { ...c, estado: 'activo', strikes: 0 };
        }
        return c;
      });
      this.guardarClientes(clientesActualizados);

      // Actualizar TEST_ACCOUNTS si existe
      Object.keys(TEST_ACCOUNTS).forEach(key => {
        if (TEST_ACCOUNTS[key].email.toLowerCase() === email) {
          TEST_ACCOUNTS[key].strikes = 0;
          TEST_ACCOUNTS[key].status = 'Activo';
        }
      });

      // Actualizar current user si está logueado
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.email.toLowerCase() === email) {
        currentUser.strikes = 0;
        currentUser.status = 'Activo';
        this.setCurrentUser(currentUser);
      }
    }

    return { success: true };
  },

  // Rechazar comprobante por el Dueño
  rechazarComprobanteMulta(multaId, motivoRechazo) {
    this.init();
    const multas = this.getMultas();
    const actualizadas = multas.map(m => {
      if (m.id === multaId) {
        return {
          ...m,
          estado: 'Pendiente',
          comprobanteRechazado: true,
          motivoRechazo: motivoRechazo || 'El monto o los datos de la transferencia no coinciden con la multa.',
        };
      }
      return m;
    });
    localStorage.setItem(STORAGE_KEYS.MULTAS, JSON.stringify(actualizadas));
    return { success: true };
  },

  // --- GESTIÓN DE FECHAS Y HORARIOS (CUU 6.1, 6.2, 6.3) ---
  getFechasConfig() {
    this.init();
    // Noviembre 2026: 30 días. Por defecto: sábados y domingos deshabilitados. Lunes a viernes habilitados de 08:00 a 21:00.
    // Días de Noviembre 2026:
    // Dom: 1, 8, 15, 22, 29
    // Sáb: 7, 14, 21, 28
    const finesDeSemana = [1, 7, 8, 14, 15, 21, 22, 28, 29];
    const defaultDias = {};
    for (let d = 1; d <= 30; d++) {
      const isFinde = finesDeSemana.includes(d);
      defaultDias[d] = {
        dia: d,
        habilitado: !isFinde,
        horaDesde: isFinde ? '' : '08:00',
        horaHasta: isFinde ? '' : '21:00',
        motivoCancelacion: isFinde ? 'Fin de semana cerrado' : '',
        empleadosAsignados: isFinde ? [] : ['Franco Barbero', 'Lucas Martino'],
      };
    }

    try {
      const raw = localStorage.getItem('barberazo_fechas_noviembre');
      if (!raw) {
        localStorage.setItem('barberazo_fechas_noviembre', JSON.stringify(defaultDias));
        return defaultDias;
      }
      return JSON.parse(raw);
    } catch {
      return defaultDias;
    }
  },

  guardarFechasConfig(config) {
    localStorage.setItem('barberazo_fechas_noviembre', JSON.stringify(config));
  },

  habilitarFecha(dia, horaDesde = '08:00', horaHasta = '21:00') {
    const config = this.getFechasConfig();
    config[dia] = {
      ...(config[dia] || {}),
      dia: Number(dia),
      habilitado: true,
      horaDesde,
      horaHasta,
      motivoCancelacion: '',
    };
    this.guardarFechasConfig(config);
    return { success: true };
  },

  deshabilitarFecha(dia, motivo) {
    const config = this.getFechasConfig();
    config[dia] = {
      ...(config[dia] || {}),
      dia: Number(dia),
      habilitado: false,
      motivoCancelacion: motivo || 'Feriado / Cierre extraordinario',
    };
    this.guardarFechasConfig(config);

    // Cancelar turnos asociados a esa fecha si hubiera
    const turnos = this.getTurnos();
    const diaStr = String(dia).padStart(2, '0');
    const turnosCancelados = turnos.map(t => {
      // Formato fecha puede ser "08/11/2026" o "8 de Noviembre, 2026"
      if (t.fecha?.includes(`${diaStr}/11/2026`) || t.fecha?.startsWith(`${dia} de Noviembre`)) {
        return { ...t, estado: 'cancelado_sin_multa' };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEYS.TURNOS, JSON.stringify(turnosCancelados));

    return { success: true };
  },

  asignarEmpleadoAFecha(dia, empleadoNombre, horaDesde, horaHasta) {
    const config = this.getFechasConfig();
    const diaObj = config[dia] || { dia: Number(dia), habilitado: true, empleadosAsignados: [] };
    const empleados = diaObj.empleadosAsignados || [];
    if (!empleados.includes(empleadoNombre)) {
      empleados.push(empleadoNombre);
    }
    diaObj.empleadosAsignados = empleados;
    if (horaDesde) diaObj.horaDesde = horaDesde;
    if (horaHasta) diaObj.horaHasta = horaHasta;
    config[dia] = diaObj;
    this.guardarFechasConfig(config);
    return { success: true };
  },

  // --- GESTIÓN DE EMPLEADOS Y SERVICIOS (CUU 6.4) ---
  getEmpleadosList() {
    this.init();
    const defaultEmpleados = [
      { id: 1, nombre: 'Franco Barbero', telefono: '3415551234', email: 'empleado@barberazo.com', rol: 'Barbero Senior', servicios: ['Corte de Pelo', 'Perfilado de Barba', 'Corte + Barba'] },
      { id: 2, nombre: 'Lucas Martino', telefono: '3415558765', email: 'lucas@barberazo.com', rol: 'Barbero', servicios: ['Corte de Pelo', 'Diseño de Cejas'] },
      { id: 3, nombre: 'Martín Dueño', telefono: '3415559999', email: 'dueno@barberazo.com', rol: 'Dueño / Estilista', servicios: ['Corte de Pelo', 'Perfilado de Barba', 'Lavado y Peinado', 'Diseño de Cejas'] },
      { id: 4, nombre: 'Mateo Bertin', telefono: '3415550000', email: 'mateo@barberazo.com', rol: 'Asistente', servicios: ['Lavado y Peinado'] },
    ];
    try {
      const raw = localStorage.getItem('barberazo_empleados_staff');
      if (!raw) {
        localStorage.setItem('barberazo_empleados_staff', JSON.stringify(defaultEmpleados));
        return defaultEmpleados;
      }
      return JSON.parse(raw);
    } catch {
      return defaultEmpleados;
    }
  },

  guardarEmpleadosList(empleados) {
    localStorage.setItem('barberazo_empleados_staff', JSON.stringify(empleados));
  },

  // CUU 10.1: Crear empleado
  crearEmpleado({ nombre, apellido, email, telefono, password }) {
    this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanNombre = (nombre || '').trim();
    const cleanApellido = (apellido || '').trim();
    const cleanTel = (telefono || '').trim();
    const cleanPass = (password || '').trim();

    // 1.b Validación de datos
    if (!cleanNombre || !cleanApellido || !cleanEmail || !cleanPass) {
      return { error: 'Por favor completá todos los campos requeridos.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { error: 'El formato de correo electrónico no es válido.' };
    }

    if (cleanPass.length < 6) {
      return { error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    // 1.a Verificar si ya existe empleado con ese email
    const empleados = this.getEmpleadosList();
    if (empleados.some(e => e.email.toLowerCase() === cleanEmail)) {
      return { error: 'El empleado ya se encuentra registrado en el sistema con el mismo email.' };
    }

    // También chequear en clientes o TEST_ACCOUNTS
    if (Object.values(TEST_ACCOUNTS).some(a => a.email.toLowerCase() === cleanEmail)) {
      return { error: 'El email ingresado ya se encuentra en uso por otra cuenta en el sistema.' };
    }

    const nuevoEmpleado = {
      id: Date.now(),
      nombre: `${cleanNombre} ${cleanApellido}`,
      nombreSolo: cleanNombre,
      apellidoSolo: cleanApellido,
      email: cleanEmail,
      telefono: cleanTel || 'Sin teléfono',
      rol: 'Barbero',
      servicios: ['Corte de Pelo'],
    };

    const actualizados = [...empleados, nuevoEmpleado];
    this.guardarEmpleadosList(actualizados);
    return { success: true, empleado: nuevoEmpleado };
  },

  // CUU 10.2: Modificar empleado
  modificarEmpleado(id, { nombre, apellido, email, telefono }) {
    this.init();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanNombre = (nombre || '').trim();
    const cleanApellido = (apellido || '').trim();
    const cleanTel = (telefono || '').trim();

    // 1.b Validación de datos
    if (!cleanNombre || !cleanApellido || !cleanEmail) {
      return { error: 'Por favor completá los campos obligatorios (nombre, apellido y email).' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return { error: 'El formato de correo electrónico no es válido.' };
    }

    const empleados = this.getEmpleadosList();
    const empActual = empleados.find(e => e.id === Number(id));
    if (!empActual) return { error: 'Empleado no encontrado.' };

    // 1.a Verificar email duplicado en otros empleados o usuarios
    const emailEnUsoPorOtro = empleados.some(e => e.id !== Number(id) && e.email.toLowerCase() === cleanEmail);
    if (emailEnUsoPorOtro) {
      return { error: 'El email ingresado ya pertenece a otro empleado registrado.' };
    }

    const actualizados = empleados.map(e => {
      if (e.id === Number(id)) {
        return {
          ...e,
          nombre: `${cleanNombre} ${cleanApellido}`.trim(),
          nombreSolo: cleanNombre,
          apellidoSolo: cleanApellido,
          email: cleanEmail,
          telefono: cleanTel,
        };
      }
      return e;
    });

    this.guardarEmpleadosList(actualizados);
    return { success: true };
  },

  // CUU 10.3: Eliminar empleado con validación de turnos futuros
  eliminarEmpleado(empleadoId) {
    this.init();
    const empleados = this.getEmpleadosList();
    const emp = empleados.find(e => e.id === Number(empleadoId));
    if (!emp) return { error: 'Empleado no encontrado.' };

    // 1.a Validar turnos futuros pendientes asignados a este empleado
    const turnos = this.getTurnos();
    const turnosPendientes = turnos.filter(t => {
      const mismoBarbero = (t.barbero || '').toLowerCase() === (emp.nombre || '').toLowerCase();
      const estaPendiente = t.estado === 'pendiente';
      return mismoBarbero && estaPendiente;
    });

    if (turnosPendientes.length > 0) {
      return {
        error: `No es posible eliminar al empleado mientras tenga turnos asignados pendientes de cumplimiento (${turnosPendientes.length} turno(s) pendientes).`,
        turnosPendientes,
      };
    }

    const actualizados = empleados.filter(e => e.id !== Number(empleadoId));
    this.guardarEmpleadosList(actualizados);
    return { success: true };
  },

  vincularServiciosEmpleado(empleadoId, serviciosSeleccionados) {
    const empleados = this.getEmpleadosList();
    const actualizados = empleados.map(emp => {
      if (emp.id === empleadoId) {
        return { ...emp, servicios: serviciosSeleccionados };
      }
      return emp;
    });
    this.guardarEmpleadosList(actualizados);
    return { success: true };
  },

  // CUU 9.2: Validar si el cliente puede eliminar su perfil
  validarEliminarPerfilCliente(userEmail) {
    this.init();
    const email = (userEmail || '').trim().toLowerCase();

    // 1. Chequear si posee turnos pendientes
    const turnos = this.getTurnos();
    const turnosPendientes = turnos.filter(t => 
      (t.clienteEmail || '').toLowerCase() === email && t.estado === 'pendiente'
    );

    // 2. Chequear si posee multas sin abonar (Pendiente o Comprobante Subido)
    const multas = this.getMultas(email);
    const multasSinAbonar = multas.filter(m => m.estado === 'Pendiente' || m.estado === 'Comprobante Subido');

    if (turnosPendientes.length > 0 && multasSinAbonar.length > 0) {
      return {
        puedeEliminar: false,
        error: `No es posible eliminar la cuenta mientras posea turnos pendientes (${turnosPendientes.length} turno/s) y hasta que abone las multas impagas registradas.`,
      };
    }

    if (turnosPendientes.length > 0) {
      return {
        puedeEliminar: false,
        error: `No es posible eliminar la cuenta mientras posea turnos pendientes de cumplimiento (${turnosPendientes.length} turno/s activo/s). Cancelá tus turnos previamente.`,
      };
    }

    if (multasSinAbonar.length > 0) {
      return {
        puedeEliminar: false,
        error: 'No es posible eliminar la cuenta hasta que abone la multa pendiente de pago.',
      };
    }

    return { puedeEliminar: true };
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
