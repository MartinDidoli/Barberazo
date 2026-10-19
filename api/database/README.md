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
