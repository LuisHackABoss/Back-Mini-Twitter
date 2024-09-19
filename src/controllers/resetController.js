import { initDb } from '../db/initDb.js';
import { notAuthorizedError } from '../services/errorService.js';

export const resetController = async (req, res, next) => {
  try {
    // Verifica que el usuario tenga el rol de 'admin'.
    if (req.user.role !== 'admin') {
      notAuthorizedError();
    }

    // Envía una respuesta de éxito antes de ejecutar el inicio de la base de datos porque el proceso puede tardar.
    res.status(200).send('Database reset successfully');

    // Ejecuta el script de inicialización de la base de datos.
    await initDb();
  } catch (error) {
    next(error); // Maneja cualquier error que ocurra durante el proceso.
  }
};
