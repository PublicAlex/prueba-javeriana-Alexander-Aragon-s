# Decisiones Técnicas y Uso de IA

## Decisiones Técnicas

### Lenguaje: Python 3.12+
- Ampliamente usado en el medio académico y empresarial.
- Django es el framework web más maduro del ecosistema Python.
- Django ORM abstrae la base de datos y permite cambiar de motor sin modificar código.

### Framework: Django 5 + Django REST Framework (DRF)
- DRF es el estándar de facto para construir APIs REST en Django.
- Proporciona serializers, viewsets, autenticación y documentación automática.
- Baterías incluidas: admin, ORM, migraciones, testing.

### Base de Datos: SQLite (desarrollo), PostgreSQL (producción)
- SQLite no requiere instalación ni configuración — ideal para pruebas técnicas.
- Django permite cambiar a PostgreSQL cambiando una variable de entorno.

### Pruebas: pytest + pytest-django
- pytest es más conciso que unittest y tiene mejor soporte de fixtures.
- Se prueban tanto los services como los endpoints.

### Manejo de Errores
- DRF validation errors para errores de entrada.
- HTTPException personalizada para errores de negocio (stock insuficiente, libro no encontrado).
- Middleware global para capturar excepciones no manejadas.

### Frontend: React 19 + Vite 8
- Vite es el bundler más rápido del ecosistema, con recarga en milisegundos.
- React con componentes funcionales y hooks — estándar actual de la industria.
- Proxy de desarrollo en Vite para evitar CORS durante desarrollo local.
- Sin dependencias pesadas: solo React, sin frameworks CSS ni librerías de componentes.

### Transacciones Atómicas
- Uso de `transaction.atomic()` para asegurar que préstamo y decremento sean una operación indivisible.
- Evita condiciones de carrera cuando dos usuarios toman el último ejemplar simultáneamente.

---

## Herramientas de IA Utilizadas

### 1. GitHub Copilot (VS Code)
- **Uso:** Autocompletado de código boilerplate (serializers, views, tests).
- **Validación:** Se revisó cada sugerencia antes de aceptarla. Se modificaron nombres de variables y se ajustaron tipos.

### 2. Claude (Anthropic) / ChatGPT
- **Uso:**
  - Generación del esquema de modelos de datos inicial.
  - Diseño de la estructura de la API REST.
  - Creación de casos de prueba.
- **Validación:**
  - Se verificó que los endpoints sugeridos cumplieran con los requerimientos funcionales.
  - Se contrastó el diseño contra la documentación oficial de Django REST Framework.
  - Se ejecutaron las pruebas generadas para confirmar que pasaban.

### 3. Prompt Engineering Aplicado
- Se usaron cadenas de pensamiento: "Primero valida disponibilidad, luego crea el préstamo, luego decrementa el stock."
- Se pidieron alternativas: "¿Cuál es la mejor forma de manejar la concurrencia en préstamos?"
- Se iteró sobre el diseño hasta que la solución fuera correcta y legible.

### Lecciones Aprendidas
- La IA es excelente para generar estructuras repetitivas (CRUD, tests) pero requiere supervisión humana para la lógica de negocio crítica.
- Las transacciones y el manejo de errores fueron identificados por revisión humana, no por la IA.
- La IA tiende a generar código genérico — hay que personalizarlo al contexto del problema.

---

## Mejoras Pendientes (si hubiera más tiempo)

| Mejora | Tiempo estimado | Prioridad |
|--------|----------------|-----------|
| Autenticación y autorización (JWT) | 3 h | Alta |
| Paginación en listados | 1 h | Media |
| Dockerización (Dockerfile + docker-compose) | 2 h | Media |
| Frontend web (React) | 8 h | ✅ Completado |
| Documentación automática (Swagger/OpenAPI con drf-spectacular) | 1 h | Baja |
| CI/CD (GitHub Actions: lint + test) | 2 h | Media |
| Rate limiting | 1 h | Baja |
| Logging estructurado (estructurado a JSON) | 1 h | Baja |
| Pruebas de carga / estrés | 3 h | Baja |
| Migración a PostgreSQL + variables de entorno | 1 h | Media |
| Endpoint para historial de préstamos por usuario | 2 h | Media |
| Notificaciones de vencimiento (email) | 4 h | Baja |

**Total estimado:** ~29 horas adicionales para una versión completa y lista para producción.
