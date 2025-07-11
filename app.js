import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import heroController from './controllers/heroController.js'
import mascotaController from './controllers/mascotaController.js'

const app = express()

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Superhéroes',
      version: '1.0.0',
      description: 'API para gestionar superhéroes y sus mascotas',
      contact: {
        name: 'API Support',
        email: 'support@superheroes.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo'
      }
    ]
  },
  apis: ['./controllers/*.js'] // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

app.use(express.json())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', heroController)
app.use('/api', mascotaController)

const PORT = 3001
app.listen(PORT, _ => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
    console.log(`Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`)
})
