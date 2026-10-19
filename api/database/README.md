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
