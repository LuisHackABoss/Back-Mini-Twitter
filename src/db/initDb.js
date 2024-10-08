// Importar el pool de conexiones
import { getPool } from './getPool.js';
// Importamos el módulo de crypto para generar un uuid.
import crypto from 'crypto';
// Importar el módulo bcrypt.
import bcrypt from 'bcrypt';

// Importar los utilidades para crear y borrar directorios
import { createUploadsPathUtil } from '../utils/createUploadsPathUtil.js';
import { deleteUploadsPathUtil } from '../utils/deleteUploadsPathUtil.js';

// Importar las variables de entorno
import { MYSQL_DATABASE } from '../../env.js';

export const initDb = async () => {
  try {
    // Obtener el pool de conexiones
    const pool = await getPool();

    // Poner en uso la base de datos
    console.log('Poniendo en uso la base de datos 📑');
    await pool.query(`USE ${MYSQL_DATABASE}`);
    console.log('Base de datos en uso ✅ 📑');

    // Eliminar las tablas tweets y users si existen
    console.log('Borrando tablas existentes 🗑 📑');
    await pool.query(`DROP TABLE IF EXISTS tweets, users`);
    console.log('Tablas borradas ✅ 📑');

    // Crear las tablas
    console.log('Creando tablas de nuevo 📑');

    // Crear la tabla users (si no existe)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY NOT NULL,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar CHAR(40),
        bio VARCHAR(150),
        hobbies VARCHAR(100),
        role ENUM('admin', 'user') DEFAULT 'user',
        active BOOLEAN DEFAULT false,
        registrationCode CHAR(36),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Crear la tabla tweets (si no existe)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tweets (
        id CHAR(36) PRIMARY KEY NOT NULL,
        userId CHAR(36) NOT NULL,
        text VARCHAR(280) NOT NULL,
        image CHAR(40),
        FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        );
    `);
    console.log('Tablas creadas ✅ 📑');

    // Borramos el directorio uploads y todo su contenido
    console.log('Borrando directorio de subida 🗑 📂');
    await deleteUploadsPathUtil();
    console.log('Directorio de subida borrado ✅ 📂');

    // Crear el directorio uploads y sus subdirectorios users y tweets
    console.log('Creando directorios de subida 📂');
    await createUploadsPathUtil();
    console.log('Directorios de subida creados ✅ 📂');

    // Crear un usuario admin
    console.log('Creando usuario admin 🧑‍💼');
    const adminId = crypto.randomUUID();
    const password = 'Admin@1234';
    // Hasheamos la contraseña.
    const hashedPass = await bcrypt.hash(password, 10);
    await pool.query(
      `
      INSERT INTO users (id, username, email, password, role, active)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [adminId, 'admin', 'admin@yopmail.com', hashedPass, 'admin', true]
    );
    console.log('Usuario admin creado ✅ 🧑‍💼');

    console.log('Todo ha ido bien 🚀');

    // process.exit(0); // Cierro el proceso indicando que todo ha ido bien
  } catch (error) {
    console.error(error);
    // process.exit(1); // Cierro el proceso indicando que ha habido un error
  }
};
// No voy a usar el script para resetear la DDBB por lo que no voy a cerrar el proceso ni la llamada a la función
// initDb();
