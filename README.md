# Sistema de Gestión de Préstamos Bibliotecarios

API REST + Frontend React para gestionar préstamos de libros en una biblioteca universitaria.
Desplegado en Azure VM con CI/CD automatizado vía GitHub Actions.

## Enlaces

| Servicio | URL |
|----------|-----|
| Frontend | `http://20.213.19.46:80` o `http://mibiblioteca.duckdns.org` |
| API directa | `http://20.213.19.46:8000/api/libros/` |

## Estructura del proyecto



```
prueba javeriana/
├── backend/                    # Django REST API (Python)
│   ├── biblioteca_api/         # Configuración del proyecto Django
│   ├── prestamos/              # App principal (models, services, views, tests)
│   ├── manage.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # React + Vite (Node.js)
│   ├── src/
│   │   ├── api.js              # Cliente HTTP
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
├── .gitignore
├── 01-arquitectura.md
├── 02-decisiones-tecnicas.md
└── README.md
```

## Requisitos

- Python 3.12+
- Node.js 18+
- pip

## Instalación y ejecución local

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate    # Linux/Mac
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y el backend en `http://localhost:8000`.
Las llamadas a `/api/*` se redirigen automáticamente vía proxy de Vite.

### Docker (local o servidor)

```bash
docker compose up -d
# App en http://localhost
# API en http://localhost:8000
```

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET`    | `/api/libros/`                     | Listar todos los libros |
| `GET`    | `/api/libros/<isbn>/disponibilidad/` | Consultar disponibilidad |
| `POST`   | `/api/prestamos/`                  | Registrar un préstamo |
| `POST`   | `/api/prestamos/<id>/devolver/`    | Devolver un libro |
| `GET`    | `/api/prestamos/vencidos/`         | Listar préstamos vencidos |

### Ejemplos

```bash
curl http://20.213.19.46:8000/api/libros/
curl http://20.213.19.46:8000/api/libros/9780134685991/disponibilidad/
curl -X POST http://20.213.19.46:8000/api/prestamos/ \
  -H "Content-Type: application/json" \
  -d '{"isbn": "9780134685991", "identificacion_usuario": "12345", "fecha_vencimiento": "2026-06-15"}'
```

## Tests

```bash
cd backend
pytest
```

## CI/CD

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que se ejecuta automáticamente en cada `git push` a `main`:

1. **Checkout** del código en el servidor vía self-hosted runner
2. **`docker compose build`** — construye las imágenes (backend Django + frontend React)
3. **`docker compose down`** — detiene contenedores anteriores
4. **`docker compose up -d`** — levanta los nuevos contenedores
5. **Verificación** — `curl` a los endpoints para confirmar que responden
6. **Limpieza** — `docker image prune` elimina imágenes viejas

**Runner:** Self-hosted en Azure VM (Ubuntu). Los self-hosted runners de GitHub Actions son **gratuitos e ilimitados** en minutos y paralelismo.

## Infraestructura

| Componente | Detalle |
|------------|---------|
| Servidor | Azure Virtual Machine (Ubuntu) |
| IP Pública | `20.213.19.46` |
| DNS | `mibiblioteca.duckdns.org` (DuckDNS, gratuito) |
| Contenedores | Docker Compose (backend + frontend) |
| Frontend | Nginx (servir SPA + proxy reverso `/api/`) |
| Backend | Gunicorn + Django (4 workers) |
| Base de datos | SQLite (montado en volumen Docker) |
| CI/CD | GitHub Actions + self-hosted runner |
| Puertos abiertos | 80 (HTTP), 8000 (API directa) |

## Documentos de Diseño

- [`01-arquitectura.md`](01-arquitectura.md) — Arquitectura, modelo de datos, flujos
- [`02-decisiones-tecnicas.md`](02-decisiones-tecnicas.md) — Decisiones técnicas, uso de IA y mejoras pendientes
