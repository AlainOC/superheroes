import Hero from '../models/Hero.js'

export const getAllHeroes = async () => await Hero.find()
export const getHeroById = async id => await Hero.findOne({ id: Number(id) })
export const createHero = async (nombre, alias, city, team) => {
  const last = await Hero.findOne().sort({ id: -1 })
  const nextId = last ? last.id + 1 : 1
  const hero = new Hero({ id: nextId, nombre, alias, city, team })
  await hero.save()
  return hero
}
export const updateHero = async (id, nombre, alias, city, team) => {
  const hero = await Hero.findOne({ id: Number(id) })
  if (!hero) return null
  hero.nombre = nombre
  hero.alias = alias
  hero.city = city
  hero.team = team
  await hero.save()
  return hero
}
export const deleteHero = async id => {
  const result = await Hero.deleteOne({ id: Number(id) })
  return result.deletedCount > 0
} 