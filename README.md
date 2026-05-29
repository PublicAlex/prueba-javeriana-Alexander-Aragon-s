# Sistema de Gestión de Préstamos Bibliotecarios

API REST + Frontend React para gestionar préstamos de libros en una biblioteca universitaria.

## Estructura del proyecto

```
prueba javeriana/
├── backend/                    # Django REST API
│   ├── biblioteca_api/         # Configuración del proyecto Django
│   ├── prestamos/              # App principal
│   ├── manage.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx / App.css
│   │   ├── BookList.jsx
│   │   ├── BookAvailability.jsx
│   │   ├── RegisterLoan.jsx
│   │   ├── ReturnBook.jsx
│   │   └── OverdueLoans.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── .github/workflows/deploy.yml
├── docker-compose.yml
├── 01-arquitectura.md
├── 02-decisiones-tecnicas.md
└── README.md
```

## Requisitos

- Python 3.12+
- Node.js 18+
- pip

## Instalación y ejecución

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Cargar datos de ejemplo
python manage.py seed_data

# Iniciar servidor
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:8000`. Las llamadas a `/api/*` desde el frontend se redirigen automáticamente al backend vía proxy de Vite.

### Docker

```bash
# Construir e iniciar ambos servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Detener
docker compose down
```

La app completa estará disponible en `http://localhost` (frontend) y `http://localhost:8000` (API directa).

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`    | `/api/libros/`                     | Listar todos los libros |
| `GET`    | `/api/libros/<isbn>/disponibilidad/` | Consultar disponibilidad |
| `POST`   | `/api/prestamos/`                  | Registrar un préstamo |
| `POST`   | `/api/prestamos/<id>/devolver/`    | Devolver un libro |
| `GET`    | `/api/prestamos/vencidos/`         | Listar préstamos vencidos |

### Ejemplos con curl

```bash
# Consultar disponibilidad
curl http://localhost:8000/api/libros/9780134685991/disponibilidad/

# Listar libros
curl http://localhost:8000/api/libros/

# Registrar préstamo
curl -X POST http://localhost:8000/api/prestamos/ \
  -H "Content-Type: application/json" \
  -d '{"isbn": "9780134685991", "identificacion_usuario": "12345", "fecha_vencimiento": "2026-06-15"}'

# Devolver libro
curl -X POST http://localhost:8000/api/prestamos/1/devolver/

# Listar vencidos
curl http://localhost:8000/api/prestamos/vencidos/
```

## Tests

```bash
cd backend
pytest
```

## CI/CD

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que:

1. Construye las imágenes Docker del backend y frontend.
2. Detiene los contenedores anteriores.
3. Inicia los nuevos contenedores.
4. Verifica que backend y frontend respondan correctamente.

**Runner:** Configurado como `self-hosted` para desplegar en tu servidor Ubuntu (los self-hosted runners de GitHub Actions son **gratuitos e ilimitados**). Si prefieres usar runners de GitHub, cambia a `runs-on: ubuntu-latest`.

## Documentos de Diseño

- [`01-arquitectura.md`](01-arquitectura.md) — Arquitectura, modelo de datos, flujos
- [`02-decisiones-tecnicas.md`](02-decisiones-tecnicas.md) — Decisiones técnicas, uso de IA y mejoras pendientes
"# prueba-javeriana-Alexander-Aragon-s" 
