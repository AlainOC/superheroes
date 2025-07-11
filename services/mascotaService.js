import Mascota from '../models/Mascota.js'

let mascotas = []
let nextId = 1

const nombresMascotas = [
  'Krypto', 'Ace', 'Streaky', 'Comet', 'Beppo', 'Dex-Starr', 'Jumpa', 'Bat-Cow', 'Titus', 'Hoppy',
  "Ch'p", 'Proty', 'Toppo', 'Storm', 'Lockjaw', 'Redwing', 'Zabu', 'Lockheed', 'Throg', 'Hairball',
  'Rocket', 'Cosmo', 'Howard', 'Chewie', 'Goose', 'Old Lace', 'Lockjaw Jr.', 'Frog Thor', 'Devil Dinosaur', 'Ms. Lion'
]

const generarMascotasAleatorias = () => {
  mascotas = []
  nextId = 1
  for (let i = 0; i < 30; i++) {
    mascotas.push(new Mascota(nextId++, nombresMascotas[i], null))
  }
}

generarMascotasAleatorias()

export const getAllMascotas = () => mascotas
export const getMascotaById = id => mascotas.find(m => m.id === id)
export const createMascota = (nombre, heroe) => {
  const mascota = new Mascota(nextId++, nombre, heroe)
  mascotas.push(mascota)
  return mascota
}
export const updateMascota = (id, nombre, heroe) => {
  const mascota = getMascotaById(id)
  if (!mascota) return null
  mascota.nombre = nombre
  mascota.heroe = heroe
  return mascota
}
export const deleteMascota = id => {
  const idx = mascotas.findIndex(m => m.id === id)
  if (idx === -1) return false
  mascotas.splice(idx, 1)
  return true
} 