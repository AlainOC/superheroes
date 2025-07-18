import mongoose from 'mongoose'

const MascotaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  heroe: { type: String, default: null },
  felicidad: { type: Number, default: 50 },
  personalidad: { type: String, default: 'normal' },
  vida: { type: Number, default: 100 },
  enfermedades: { type: [String], default: [] },
  itemsCustom: {
    type: [
      {
        nombre: String,
        tipo: { type: String, enum: ['free', 'pay'] }
      }
    ],
    default: []
  },
  causaMuerte: { type: String, default: null },
  adoptadaPor: { type: String, default: null }, // id del usuario que la adoptó
  id: { type: Number, unique: true } // ID consecutivo
})

const Mascota = mongoose.model('Mascota', MascotaSchema)
export default Mascota 