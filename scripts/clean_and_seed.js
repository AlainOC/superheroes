import mongoose from 'mongoose';
import Hero from '../models/Hero.js';
import Mascota from '../models/Mascota.js';
import Item from '../models/Item.js';

const mongoUrl = 'mongodb+srv://Alain:Alain2006@cluster0.afg7ums.mongodb.net/superheroesdb?retryWrites=true&w=majority&appName=Cluster0';

async function cleanAndSeed() {
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Limpiar colecciones
  await Hero.deleteMany({});
  await Mascota.deleteMany({});
  await Item.deleteMany({});

  // Poblar héroes
  const heroes = [
    { id: 1, nombre: 'Clark Kent', alias: 'Superman', city: 'Metrópolis', team: 'Liga de la Justicia' },
    { id: 2, nombre: 'Tony Stark', alias: 'Iron Man', city: 'Nueva York', team: 'Los Vengadores' },
    { id: 3, nombre: 'Bruce Wayne', alias: 'Batman', city: 'Gotham City', team: 'Liga de la Justicia' }
  ];
  await Hero.insertMany(heroes);

  // Poblar mascotas
  const mascotas = [
    { id: 1, nombre: 'Krypto', heroe: null },
    { id: 2, nombre: 'Ace', heroe: null },
    { id: 3, nombre: 'Streaky', heroe: null }
  ];
  await Mascota.insertMany(mascotas);

  // Poblar items
  const items = [
    { id: 1, nombre: 'Collar', tipo: 'free' },
    { id: 2, nombre: 'Capa', tipo: 'pay' },
    { id: 3, nombre: 'Gafas', tipo: 'free' }
  ];
  await Item.insertMany(items);

  console.log('Base de datos limpiada y poblada con datos de ejemplo.');
  await mongoose.disconnect();
}

cleanAndSeed(); 