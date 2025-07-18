import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  mascotasAdoptadas: { type: [Number], default: [] }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);
export default Usuario; 