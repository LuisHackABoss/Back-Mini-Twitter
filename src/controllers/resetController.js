import { notAuthorizedError } from '../services/errorService.js';

export const resetController = async (req, res, next) => {
  try {
    // Verifica que el usuario tenga el rol de 'admin'.
    if (req.user.role !== 'admin') {
      notAuthorizedError();
    }

    // Ejecuta el script de inicialización de la base de datos.
    await initDb();

    res.status(200).send('Database reset successfully');
  } catch (error) {
    next(error); // Maneja cualquier error que ocurra durante el proceso.
  }
};
