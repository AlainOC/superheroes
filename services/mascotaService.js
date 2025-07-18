import Mascota from '../models/Mascota.js'

// Enfermedades posibles
const ENFERMEDADES = [
  { nombre: 'Sarna', efecto: -5 },
  { nombre: 'Gripe', efecto: -10 },
  { nombre: 'Bola de estómago', efecto: -15 },
  { nombre: 'Pata rota', efecto: -8 },
  { nombre: 'Pulgas', efecto: -4 },
  { nombre: 'Resfriado', efecto: -6 }
]

// Items custom posibles
const ITEMS_CUSTOM = [
  { nombre: 'Collar', tipo: 'free' },
  { nombre: 'Capa', tipo: 'pay' },
  { nombre: 'Gafas', tipo: 'free' },
  { nombre: 'Botas', tipo: 'pay' },
  { nombre: 'Sombrero', tipo: 'free' },
  { nombre: 'Chaleco', tipo: 'pay' }
]

export const getAllMascotas = async (usuarioId = null) => {
  const todas = await Mascota.find();
  if (!usuarioId) return todas.filter(m => !m.adoptadaPor);
  return todas.filter(m => !m.adoptadaPor || m.adoptadaPor === usuarioId);
}
export const getMascotaById = async id => await Mascota.findOne({ id: Number(id) })
export const createMascota = async (nombre, heroe) => {
  const last = await Mascota.findOne().sort({ id: -1 })
  const nextId = last ? last.id + 1 : 1
  const mascota = new Mascota({ id: nextId, nombre, heroe })
  await mascota.save()
  return mascota
}
export const updateMascota = async (id, nombre, heroe) => {
  const mascota = await Mascota.findOne({ id: Number(id) })
  if (!mascota) return null
  mascota.nombre = nombre
  mascota.heroe = heroe
  await mascota.save()
  return mascota
}
export const deleteMascota = async id => {
  const result = await Mascota.deleteOne({ id: Number(id) })
  return result.deletedCount > 0
}

export const alimentarMascota = async id => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  if (mascota.felicidad >= 100) {
    await enfermarMascota(id)
    await mascota.save()
    return { mascota, mensaje: '¡La mascota ya está muy feliz! Pero se enfermó por sobrealimentación.' }
  }
  mascota.felicidad = Math.min(mascota.felicidad + 10, 100)
  mascota.vida = Math.min(mascota.vida + 5, 100)
  await mascota.save()
  return { mascota, mensaje: 'Mascota alimentada y más feliz.' }
}

export const pasearMascota = async id => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  mascota.felicidad = Math.min(mascota.felicidad + 15, 100)
  if (mascota.enfermedades.length > 0) {
    mascota.enfermedades.shift()
    await mascota.save()
    return { mascota, mensaje: '¡Paseo exitoso! Se curó una enfermedad.' }
  }
  await mascota.save()
  return { mascota, mensaje: '¡Paseo exitoso! La mascota está más feliz.' }
}

export const personalizarMascota = async (id, itemNombre) => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  const item = ITEMS_CUSTOM.find(i => i.nombre === itemNombre)
  if (!item) return { mascota, mensaje: 'Item no válido.' }
  mascota.itemsCustom.push(item)
  await mascota.save()
  return { mascota, mensaje: 'Item personalizado agregado.' }
}

export const enfermarMascota = async (id, enfermedadNombre = null) => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  let enfermedad
  if (enfermedadNombre) {
    enfermedad = ENFERMEDADES.find(e => e.nombre.toLowerCase() === enfermedadNombre.toLowerCase())
    if (!enfermedad) return { mascota, mensaje: 'Esa enfermedad no existe.' }
    if (mascota.enfermedades.includes(enfermedad.nombre)) {
      return { mascota, mensaje: 'La mascota ya tiene esa enfermedad.' }
    }
  } else {
    const posibles = ENFERMEDADES.filter(e => !mascota.enfermedades.includes(e.nombre))
    if (posibles.length === 0) return { mascota, mensaje: 'Ya tiene todas las enfermedades posibles.' }
    enfermedad = posibles[Math.floor(Math.random() * posibles.length)]
  }
  mascota.enfermedades.push(enfermedad.nombre)
  mascota.vida = Math.max(mascota.vida + enfermedad.efecto, 0)
  await mascota.save()
  return { mascota, mensaje: `Mascota enfermó de ${enfermedad.nombre}` }
}

export const curarMascota = async (id, enfermedadNombre) => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  const idx = mascota.enfermedades.indexOf(enfermedadNombre)
  if (idx === -1) return { mascota, mensaje: 'La mascota no tiene esa enfermedad.' }
  mascota.enfermedades.splice(idx, 1)
  await mascota.save()
  return { mascota, mensaje: 'Mascota curada de ' + enfermedadNombre }
}

export const revivirMascota = async id => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  if (mascota.vida > 0) {
    return { mascota, mensaje: 'La mascota no está muerta.' }
  }
  mascota.vida = 50
  mascota.felicidad = 50
  mascota.enfermedades = []
  mascota.causaMuerte = null
  await mascota.save()
  return { mascota, mensaje: '¡Mascota revivida con éxito!' }
}

export const matarMascota = async (id, causa) => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  mascota.vida = 0
  mascota.causaMuerte = causa || 'Desconocida'
  await mascota.save()
  return { mascota, mensaje: `Mascota muerta por: ${mascota.causaMuerte}` }
}

export const pocionVidaMascota = async (id, cantidad) => {
  const mascota = await Mascota.findById(id)
  if (!mascota) return null
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return { mascota, mensaje: 'Cantidad de vida inválida.' }
  }
  const vidaAntes = mascota.vida
  mascota.vida = Math.min(mascota.vida + cantidad, 100)
  await mascota.save()
  return { mascota, mensaje: `Poción aplicada. Vida: ${vidaAntes} -> ${mascota.vida}` }
} 