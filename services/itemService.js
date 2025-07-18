import Item from '../models/Item.js'

export const getAllItems = async () => await Item.find()
export const getItemById = async id => await Item.findOne({ id: Number(id) })
export const createItem = async (nombre, tipo) => {
  const last = await Item.findOne().sort({ id: -1 })
  const nextId = last ? last.id + 1 : 1
  const item = new Item({ id: nextId, nombre, tipo })
  await item.save()
  return item
}
export const updateItem = async (id, nombre, tipo) => {
  const item = await Item.findOne({ id: Number(id) })
  if (!item) return null
  item.nombre = nombre
  item.tipo = tipo
  await item.save()
  return item
}
export const deleteItem = async id => {
  const result = await Item.deleteOne({ id: Number(id) })
  return result.deletedCount > 0
} 