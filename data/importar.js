import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Hero from '../models/Hero.js';
import Item from '../models/Item.js';
import Mascota from '../models/Mascota.js';

const mongoUrl = 'mongodb+srv://Alain:Alain2006@cluster0.afg7ums.mongodb.net/superheroesdb?retryWrites=true&w=majority&appName=Cluster0';

async function importarDatos() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Conectado a MongoDB Atlas');

  // Importar héroes
  const heroesData = JSON.parse(fs.readFileSync(path.resolve('./data/heroes.json'), 'utf-8'));
  await Hero.deleteMany({});
  await Hero.insertMany(heroesData);
  console.log('Héroes importados');

  // Importar items
  const itemsData = JSON.parse(fs.readFileSync(path.resolve('./data/items.json'), 'utf-8'));
  await Item.deleteMany({});
  await Item.insertMany(itemsData);
  console.log('Items importados');

  // Importar mascotas
  const mascotasData = JSON.parse(fs.readFileSync(path.resolve('./data/mascotas.json'), 'utf-8'));
  await Mascota.deleteMany({});
  await Mascota.insertMany(mascotasData);
  console.log('Mascotas importadas');

  await mongoose.disconnect();
  console.log('Importación completada y conexión cerrada.');
}

importarDatos().catch(err => {
  console.error('Error al importar datos:', err);
  process.exit(1);
}); 