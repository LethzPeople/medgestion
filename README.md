# MedGestión — Sistema de Gestión para Consultorio Odontológico

Sistema web para la gestión de turnos y pacientes de un consultorio odontológico. Permite administrar la agenda diaria, el historial de pacientes y las estadísticas mensuales del consultorio.

---

## Demo en video

[![Ver demo](https://img.shields.io/badge/▶_Ver_Demo-red?style=for-the-badge)]([URL_DEL_VIDEO](https://youtu.be/-yj8NJVdBjs))

---

## Funcionalidades

- **Dos roles de usuario:** Odontólogo y Secretaria, ambos con acceso completo al sistema
- **Panel principal:** Resumen del día con turnos, estadísticas del mes y gráfico de distribución de estados
- **Gestión de pacientes:** Listado con búsqueda, paginación, ficha completa con notas médicas y cobertura
- **Turnos:** Alta, edición y eliminación de turnos con filtros por fecha, estado y búsqueda por paciente
- **Calendario mensual:** Vista de calendario con turnos por día, navegación entre meses y detalle al hacer clic
- **Exportación CSV:** Reporte mensual de turnos descargable y compatible con Excel/Google Sheets
- **Historial de turnos en el perfil del paciente:** Cada ficha incluye el historial completo de consultas del paciente ordenado por fecha, con estado y motivo
- **Configuración de perfil:** Cada usuario puede editar su nombre desde el panel lateral
- **Diseño responsive:** Adaptado para desktop y dispositivos móviles con sidebar colapsable

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite |
| Estilos | Tailwind CSS (paleta Material Design 3) |
| Routing | React Router DOM v6 |
| Backend / Base de datos | PocketBase 0.21 (SQLite embebido) |
| Fechas | date-fns |
| Lenguaje | JavaScript ES Modules |

---

## Requisitos previos

- Node.js 18 o superior
- PocketBase 0.21 para Windows — descargarlo desde [pocketbase.io/docs](https://pocketbase.io/docs) y colocar `pocketbase.exe` en la raíz del proyecto

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd turnomedico
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz:

```
VITE_PB_URL=http://127.0.0.1:8090
```

### 4. Iniciar el backend (PocketBase)

Abrir una terminal y ejecutar:

```bash
./pocketbase.exe serve
```

PocketBase queda disponible en `http://127.0.0.1:8090`.  
Las migraciones de esquema se aplican automáticamente al iniciar.

### 5. Iniciar el frontend

En otra terminal:

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Crear usuarios

1. Acceder al panel admin de PocketBase: `http://127.0.0.1:8090/_/`
2. Ir a **Collections → users → New record**
3. Completar: email, contraseña, nombre, apellido
4. En el campo **rol** seleccionar `odontologo` o `secretaria`

> La primera vez, PocketBase pedirá crear un superusuario para el panel de administración.

---

## Estructura del proyecto

```
turnomedico/
├── src/
│   ├── components/
│   │   ├── layout/         # Sidebar + topbar responsive
│   │   ├── turnos/         # Formulario de turno
│   │   ├── clientes/       # Formulario de paciente
│   │   └── ui/             # Modal, Badge, Confirm, StatCard
│   ├── hooks/
│   │   ├── useAuth.jsx     # Contexto de autenticación y roles
│   │   ├── useTurnos.js    # CRUD de turnos con filtros
│   │   └── usePacientes.js # CRUD de pacientes con búsqueda
│   ├── pages/admin/        # Dashboard, Turnos, Calendario, Pacientes
│   └── lib/pb.js           # Instancia del cliente PocketBase
├── pb_migrations/          # Migraciones automáticas del esquema
├── pocketbase.exe          # Backend embebido (Windows)
└── .env                    # URL del backend
```
