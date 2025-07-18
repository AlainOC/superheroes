import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import heroController from './controllers/heroController.js'
import mascotaController from './controllers/mascotaController.js'
import itemController from './controllers/itemController.js'
import mongoose from 'mongoose'
import { registro, login, perfil, ranking, authMiddleware } from './controllers/usuarioController.js'
import cors from 'cors'

const app = express()
app.use(cors())

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Superheroes',
    version: '1.0.0',
    description: 'Documentación de la API de Superhéroes y Mascotas',
  },
  servers: [
    {
      url: 'http://localhost:3001',
    },
  ],
  components: {
    securitySchemes: {
      bearer: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: 'Ingresa tu token JWT aquí. Ejemplo: Bearer <token>'
      },
    },
  },
  security: [{ bearer: [] }],
}

const options = {
  swaggerDefinition,
  apis: ['./controllers/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

app.use(express.json())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Conexión a MongoDB Atlas con usuario y contraseña nuevos y base de datos superheroesdb
const mongoUrl = 'mongodb+srv://Alain:Alain2006@cluster0.afg7ums.mongodb.net/superheroesdb?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB Atlas')
}).catch(err => {
  console.error('Error al conectar a MongoDB Atlas:', err)
})

app.use('/api', heroController)
app.use('/api', mascotaController)
app.use('/api', itemController)
app.post('/api/usuarios/registro', registro);
app.post('/api/usuarios/login', login);
app.get('/api/usuarios/perfil', authMiddleware, perfil);
app.get('/api/usuarios/ranking', ranking);

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    console.log(`Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`)
})
