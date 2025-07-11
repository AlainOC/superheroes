# 🦸‍♂️ API de Superhéroes y Mascotas

Una API REST completa para gestionar superhéroes y sus mascotas fantásticas, con sistema de adopción única y documentación Swagger.

## 🚀 Características

- **CRUD completo** para Héroes y Mascotas
- **Sistema de adopción única** - Una mascota por héroe
- **30 mascotas fantásticas** predefinidas
- **Documentación Swagger** interactiva
- **Validaciones completas** de datos
- **Búsqueda por ciudad** de héroes
- **Sistema de enfrentamientos** contra villanos

## 📋 Endpoints Disponibles

### 🦸‍♂️ Héroes (9 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/heroes` | Obtener todos los héroes |
| GET | `/api/heroes/{id}` | Obtener héroe por ID |
| GET | `/api/heroes/city/{city}` | Buscar héroes por ciudad |
| POST | `/api/heroes` | Crear nuevo héroe |
| PUT | `/api/heroes/{id}` | Actualizar héroe |
| DELETE | `/api/heroes/{id}` | Eliminar héroe |
| POST | `/api/heroes/{id}/enfrentar` | Enfrentar villano |
| POST | `/api/heroes/{id}/adoptar` | Adoptar mascota |
| POST | `/api/heroes/{id}/abandonar` | Abandonar mascota |

### 🐉 Mascotas (5 endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/mascotas` | Obtener todas las mascotas |
| GET | `/api/mascotas/{id}` | Obtener mascota por ID |
| POST | `/api/mascotas` | Crear nueva mascota |
| PUT | `/api/mascotas/{id}` | Actualizar mascota |
| DELETE | `/api/mascotas/{id}` | Eliminar mascota |

## 🛠️ Instalación

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/api-superheroes.git
cd api-superheroes
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar el servidor**
```bash
node app.js
```

4. **Acceder a la API**
- API Base: http://localhost:3001
- Swagger UI: http://localhost:3001/api-docs

## 📊 Estructura del Proyecto

```
api-superheroes/
├── controllers/          # Controladores de la API
│   ├── heroController.js
│   └── mascotaController.js
├── models/              # Modelos de datos
│   ├── heroModel.js
│   └── mascotaModel.js
├── repositories/        # Capa de acceso a datos
│   ├── heroRepository.js
│   └── mascotaRepository.js
├── services/           # Lógica de negocio
│   ├── heroService.js
│   └── mascotaService.js
├── data/              # Datos JSON
│   ├── superheroes.json
│   └── mascotas.json
├── app.js             # Archivo principal
├── package.json       # Dependencias
└── README.md          # Este archivo
```

## 🎯 Ejemplos de Uso

### Crear un nuevo héroe
```bash
curl -X POST http://localhost:3001/api/heroes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Peter Parker",
    "alias": "Spider-Man",
    "city": "Nueva York",
    "team": "Los Vengadores"
  }'
```

### Adoptar una mascota
```bash
curl -X POST http://localhost:3001/api/heroes/1/adoptar \
  -H "Content-Type: application/json" \
  -d '{
    "mascotaId": 1
  }'
```

### Buscar héroes por ciudad
```bash
curl http://localhost:3001/api/heroes/city/Nueva%20York
```

## 🔒 Validaciones del Sistema

### Adopción de Mascotas
- ✅ Una mascota solo puede ser adoptada por un héroe
- ✅ Un héroe solo puede tener una mascota a la vez
- ✅ Debe abandonar la mascota actual antes de adoptar otra
- ✅ Validación de existencia de héroe y mascota

### Datos Requeridos
- **Héroe**: `name`, `alias` (obligatorios)
- **Mascota**: `tipo`, `superpoder` (obligatorios)

## 🐉 Mascotas Fantásticas Incluidas

El sistema incluye 30 mascotas fantásticas predefinidas:

- **Dragón** - Lanzar fuego
- **Fénix** - Resurrección
- **Unicornio** - Curación mágica
- **Grifo** - Vuelo supersónico
- **Kraken** - Control del océano
- **Minotauro** - Fuerza sobrehumana
- **Sirena** - Canto hipnótico
- **Centauro** - Velocidad extrema
- **Hidra** - Regeneración múltiple
- **Quimera** - Múltiples ataques
- Y 20 más...

## 🛡️ Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Swagger** - Documentación de API
- **express-validator** - Validación de datos
- **fs-extra** - Manejo de archivos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request.

## 📞 Contacto

- **Email**: support@superheroes.com
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)

---

¡Disfruta gestionando tu universo de superhéroes y mascotas! 🦸‍♂️🐉 