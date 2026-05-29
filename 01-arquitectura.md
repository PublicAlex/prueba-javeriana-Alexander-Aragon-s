# Documento de Arquitectura — Sistema de Gestión de Préstamos Bibliotecarios

## Estructura del proyecto

```
prueba javeriana/
├── backend/                  # Django REST API
│   ├── biblioteca_api/       # Configuración del proyecto Django
│   ├── prestamos/            # App principal (modelos, vistas, servicios, tests)
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── api.js            # Cliente HTTP
│   │   ├── BookList.jsx      # Listar libros
│   │   ├── BookAvailability.jsx
│   │   ├── RegisterLoan.jsx
│   │   ├── ReturnBook.jsx
│   │   ├── OverdueLoans.jsx
│   │   ├── App.jsx           # Navegación por tabs
│   │   └── App.css
│   └── vite.config.js        # Proxy /api → localhost:8000
├── 01-arquitectura.md
├── 02-decisiones-tecnicas.md
└── README.md
```

## 1. Arquitectura Elegida

**Estilo:** Arquitectura Monolítica Modular con API REST

```
┌─────────────────────────────────────────────────────┐
│                   Cliente (Frontend)                 │
│          (Web / Mobile / Postman / curl)             │
└────────────────────────┬────────────────────────────┘
                         │ HTTP / JSON
                         ▼
┌─────────────────────────────────────────────────────┐
│                 API REST (Django)                    │
│  ┌───────────────────────────────────────────────┐  │
│  │              Django REST Framework             │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │  Views   │ │  Serial  │ │  Permissions  │  │  │
│  │  │          │ │ izers    │ │  & Auth      │  │  │
│  │  └────┬─────┘ └────┬─────┘ └──────┬───────┘  │  │
│  │       └─────────────┼──────────────┘          │  │
│  │                     ▼                          │  │
│  │              ┌──────────────┐                  │  │
│  │              │   Services   │                  │  │
│  │              │ (Lógica de   │                  │  │
│  │              │  negocio)    │                  │  │
│  │              └──────┬───────┘                  │  │
│  └─────────────────────┼─────────────────────────┘  │
└────────────────────────┼────────────────────────────┘
                         │ ORM (Django Models)
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Base de Datos                      │
│              SQLite (desarrollo) / PostgreSQL (prod) │
└─────────────────────────────────────────────────────┘
```

### ¿Por qué monolítico?
- El alcance del proyecto es acotado (5 endpoints).
- Un solo equipo pequeño lo desarrolla y mantiene.
- Menos sobrecarga operativa que una arquitectura de microservicios.
- Fácil de desplegar y debuggear.

### Separación por capas
| Capa | Responsabilidad |
|------|----------------|
| **Models** | Definición de datos y reglas a nivel de base de datos |
| **Serializers** | Validación de entrada/salida y transformación JSON |
| **Services** | Lógica de negocio (disponibilidad, vencimientos, etc.) |
| **Views (API)** | Puntos de entrada HTTP, delegan en Services |
| **Tests** | Pruebas unitarias y de integración |

---

## 2. Modelo de Datos

### Libro (Book)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| isbn | CharField(13) | PK, único |
| titulo | CharField(200) | NOT NULL |
| area_conocimiento | CharField(100) | NOT NULL |
| ejemplares_disponibles | IntegerField | >= 0, default 0 |

### Préstamo (Loan)
| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | AutoField | PK |
| isbn | ForeignKey(Book) | NOT NULL |
| identificacion_usuario | CharField(50) | NOT NULL |
| fecha_prestamo | DateField | auto_now_add |
| fecha_vencimiento | DateField | NOT NULL |
| estado | CharField(10) | Choices: ACTIVO / DEVUELTO |

---

## 3. Endpoints de la API REST

| Método | Endpoint | Descripción | Cuerpo (JSON) |
|--------|----------|-------------|---------------|
| `POST` | `/api/prestamos/` | Registrar préstamo | `{ "isbn", "identificacion_usuario", "fecha_vencimiento" }` |
| `POST` | `/api/prestamos/<id>/devolver/` | Registrar devolución | — |
| `GET` | `/api/prestamos/vencidos/` | Listar préstamos vencidos | — |
| `GET` | `/api/libros/<isbn>/disponibilidad/` | Consultar disponibilidad | — |
| `GET` | `/api/libros/` | Listar libros (opcional) | — |

### Códigos de respuesta
- `200` — OK
- `201` — Creado
- `400` — Error de validación / Bad Request
- `404` — No encontrado
- `409` — Conflicto (sin ejemplares disponibles)

---

## 4. Flujo de Registrar Préstamo

```
1. POST /api/prestamos/ { isbn, id_usuario, fecha_vencimiento }
2. View recibe request → pasa a Serializer
3. Serializer valida datos (ISBN existe, campos requeridos)
4. View llama a Service.crear_prestamo(...)
5. Service:
   a. Verifica ejemplares_disponibles > 0
   b. Crea Loan con estado=ACTIVO
   c. Decrementa ejemplares_disponibles en 1
   d. Retorna Loan
6. View responde 201 con datos del préstamo
```

## 5. Flujo de Registrar Devolución

```
1. POST /api/prestamos/<id>/devolver/
2. View obtiene Loan por ID (404 si no existe)
3. Verifica estado == ACTIVO (400 si ya devuelto)
4. Service:
   a. Cambia estado a DEVUELTO
   b. Incrementa ejemplares_disponibles en 1
   c. Guarda cambios
5. View responde 200
```

## 6. Consideraciones de Seguridad y Calidad

- Uso de transacciones atómicas para préstamo/devolución (evitar condiciones de carrera).
- Validación de fechas: fecha_vencimiento debe ser posterior a fecha_prestamo.
- Manejo centralizado de excepciones (middleware personalizado o DRF exception handler).
- Logging de operaciones críticas.
- Pruebas unitarias para cada servicio y endpoint.
