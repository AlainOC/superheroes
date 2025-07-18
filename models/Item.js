import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // ID consecutivo
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['free', 'pay'], required: true }
})

const Item = mongoose.model('Item', ItemSchema)
export default Item 