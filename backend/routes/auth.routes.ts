import {Router} from 'express';
import { AuthController } from '../controller/auth.controller';

const router = Router();

router.post('/register', AuthController.register);
router.get('/login', AuthController.login);

export const AuthRoutes = router;