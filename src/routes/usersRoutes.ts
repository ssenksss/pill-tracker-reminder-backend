import express from 'express';
import { UsersController } from '../controllers/UsersController';
import { userRegisterValidation, userLoginValidation } from '../middleware/validators';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', userRegisterValidation, UsersController.register);
router.post('/login', userLoginValidation, UsersController.login);
router.get('/', authenticateToken, UsersController.getAllUsers);
router.get('/:id', UsersController.getUserById);
router.post('/', UsersController.createUser);
router.put('/:id', UsersController.updateUser);
router.delete('/:id', UsersController.deleteUser);

export default router;
