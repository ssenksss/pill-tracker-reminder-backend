// -- UusersRoutes
import express from 'express'
import { UsersController } from '../controllers/usersController'
import { userRegisterValidation, userLoginValidation } from '../middleware/validators'
import { authenticateToken } from '../middleware/authMiddleware'

const router = express.Router()

// Javne rute
router.post('/register', userRegisterValidation, UsersController.register) // Registracija
router.post('/login', userLoginValidation, UsersController.login)          // Prijava

//  Zaštićene rute (JWT token mora biti validan)
router.get('/', authenticateToken, UsersController.getAllUsers)
router.get('/:id', authenticateToken, UsersController.getUserById)
router.post('/', authenticateToken, UsersController.createUser)
router.put('/:id', authenticateToken, UsersController.updateUser)
router.delete('/:id', authenticateToken, UsersController.deleteUser)

export default router
