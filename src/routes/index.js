// Importamos las dependencias.
import express from 'express';

// Importamos los routers.
import { userRouter } from './userRoutes.js';
import { tweetRouter } from './tweetRoutes.js';
import { authUserController } from '../middlewares/index.js';
import { resetController } from '../controllers/resetController.js';

// Creamos un router y lo exportamos.
export const router = express.Router();

// Usamos los routers de usuarios.
router.use(userRouter);

// Usamos los routers de tweets.
router.use(tweetRouter);

// Ruta de reseteo de la base de datos.
router.post('/reset-db', authUserController, resetController);
