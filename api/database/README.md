<<<<<<< HEAD
# Configuración de Base de Datos para Alwaysdata (MariaDB 11.8)

Este directorio contiene los scripts SQL preparados y optimizados para **MariaDB 11.8 / MySQL**.

## Archivos disponibles

1. **`schema_basico.sql` (Recomendado)**:
   - Contiene únicamente las tablas esenciales y operativas:
     - `cliente`
     - `empleado`
     - `servicio`
     - `empleado_servicio`
     - `diaTrabajo`
     - `horarioTrabajo`
     - `turno`
     - `turno_servicio`
   - Incluye datos de prueba iniciales basados en el documento del MDF para poder probar de inmediato.

2. **`schema_completo.sql`**:
   - Contiene todas las 12 tablas del MDF (incluye `resena`, `cancelacion`, `multa`, y `parametros`) por si más adelante se requiere el modelo completo.

---

## Pasos para subir a Alwaysdata

### Paso 1: Crear la Base de Datos en Alwaysdata
1. Ingresá a tu panel de **Alwaysdata**: https://admin.alwaysdata.com/
2. En el menú lateral izquierdo, ve a **Bases de datos** -> **MySQL**.
3. Asegurate de que la versión esté configurada en **MariaDB 11.8**.
4. En la pestaña **Bases de datos**, haz clic en **Añadir una base de datos**.
   - Nombre sugerido: `barberazo` (o el nombre que prefieras; Alwaysdata le antepondrá tu usuario, ej: `tuusuario_barberazo`).
5. En la pestaña **Usuarios**:
   - Si no tenés un usuario, creá uno nuevo con contraseña.
   - Otorgale todos los permisos sobre la base de datos recién creada.

### Paso 2: Importar el Script SQL en phpMyAdmin
1. Desde Alwaysdata, abrí **phpMyAdmin** (botón directo en la sección MySQL).
2. Seleccioná la base de datos en el panel izquierdo (`tuusuario_barberazo`).
3. Ve a la pestaña superior **Importar**.
4. Haz clic en **Seleccionar archivo** y elegí `schema_basico.sql` (o pegá su contenido en la pestaña **SQL**).
5. Haz clic en **Continuar** / **Importar**.

### Paso 3: Conectar el Backend (`.env`)
En la carpeta `api/`, creá o editá tu archivo `.env`:

```env
PORT=3000

# Datos de Alwaysdata:
DB_HOST=mysql-tuusuario.alwaysdata.net
DB_PORT=3306
DB_USER=tuusuario
DB_PASSWORD=tu_contraseña_de_alwaysdata
DB_NAME=tuusuario_barberazo
```

¡Listo! Tu backend ya está configurado para conectarse mediante `api/config/db.js`.
=======
# Base de datos de Barberazo para alwaysdata

Esta carpeta contiene lo mínimo para crear la base en alwaysdata y probar la agenda. No es el MDF completo.

## Archivos

- `schema.sql`: crea las 8 tablas del núcleo.
- `seed.sql`: carga datos de prueba (opcional).

### Tablas incluidas

| Tabla | Para qué sirve |
|---|---|
| `cliente` | Datos y login de clientes |
| `empleado` | Datos y login de empleados/dueño |
| `servicio` | Catálogo de servicios |
| `dia_trabajo` | Fechas habilitadas por el dueño |
| `horario_trabajo` | Franjas horarias de cada empleado por día |
| `turno` | Reservas |
| `turno_servicio` | Servicios incluidos en un turno |
| `empleado_servicio` | Servicios que puede hacer cada empleado |

Quedaron afuera a propósito: `resena`, `multa`, `parametros` y la tabla `cancelacion`. La cancelación se guarda en `turno` (`estado`, `motivo_cancelacion`, `cancelado_por`). Se pueden agregar después sin tocar estas tablas.

## 1. Crear la base en alwaysdata

1. Entrá a **MySQL** en el panel de alwaysdata.
2. Clic en **+ Add a database**.
3. Elegí un nombre corto, por ejemplo `barberazo`.
4. Copiá el **nombre completo** que muestre el panel. Normalmente queda con el prefijo de la cuenta, por ejemplo `barberazo_barberazo`.
5. Andá a **Users**, creá un usuario para esa base y asignale **GRANT ALL**.

## 2. Importar el esquema

La forma más simple es por **phpMyAdmin** (el link amarillo del panel):

1. Abrí phpMyAdmin.
2. Seleccioná la base creada.
3. Pestaña **Import**.
4. Subí `api/database/schema.sql`.
5. Si querés datos de prueba, repetí con `api/database/seed.sql`.

También se puede por SSH, desde la cuenta de alwaysdata:

```bash
mysql -h mysql-barberazo.alwaysdata.net \
  -u USUARIO -p NOMBRE_COMPLETO_DE_LA_BASE \
  < api/database/schema.sql
```

> `schema.sql` no tiene `CREATE DATABASE` ni `USE` a propósito: la base ya se crea desde el panel y se selecciona antes de importar.

## 3. Configurar el backend

En `api/.env` (copiado de `.env.example`):

```env
DB_HOST=mysql-barberazo.alwaysdata.net
DB_PORT=3306
DB_NAME=barberazo_barberazo
DB_USER=barberazo_TU_USUARIO
DB_PASSWORD=TU_PASSWORD
```

No uses `localhost` en producción.

## 4. Verificar

En phpMyAdmin o por consola:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM servicio;
```

Con `seed.sql` deberían aparecer 5 servicios.

## Notas sobre MariaDB 11.8

- El servicio se llama "MySQL" en el panel, pero el motor es **MariaDB 11.8**.
- El esquema usa `utf8mb4_unicode_ci` (no `utf8mb4_0900_ai_ci`, que es de MySQL 8).
- Los `CHECK` funcionan desde MariaDB 10.2.
- Los estados están en mayúsculas (`SOLICITADO`, `ACTIVO`, etc.) para seguir la máquina de estados.
- La contraseña de los usuarios de prueba es `123456` (hash bcrypt incluido en `seed.sql`).

## Siguiente etapa

Cuando quieras completar el MDF, faltan:

- `resena` (con `UNIQUE` por turno)
- `multa` (con estado de pago y turno asociado)
- `parametros` (montos, strikes máximos y horarios generales)
- Una tabla `usuario` unificada, si después quieren centralizar el login de clientes y empleados.
>>>>>>> ffac734a8db72b7d52276cbacb3c436e65373c56
