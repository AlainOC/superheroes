import fs from 'fs';
import path from 'path';

const usuariosFilePath = path.join(path.resolve(), 'data/usuarios.json');

class Usuario {
  constructor(id, nombre, email, passwordHash, mascotasAdoptadas = []) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
    this.mascotasAdoptadas = mascotasAdoptadas;
  }

  static getAll() {
    if (!fs.existsSync(usuariosFilePath)) return [];
    const data = fs.readFileSync(usuariosFilePath);
    return JSON.parse(data);
  }

  static saveAll(usuarios) {
    fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));
  }
}

export default Usuario; 