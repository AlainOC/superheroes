import mongoose from 'mongoose'

const HeroSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, // ID consecutivo
  nombre: { type: String, required: true },
  alias: { type: String },
  city: { type: String },
  team: { type: String }
})

const Hero = mongoose.model('Hero', HeroSchema)
export default Hero 