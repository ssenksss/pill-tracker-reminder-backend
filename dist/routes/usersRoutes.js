"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const validators_1 = require("../middleware/validators");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/register', validators_1.userRegisterValidation, usersController_1.UsersController.register);
router.post('/login', validators_1.userLoginValidation, usersController_1.UsersController.login);
router.get('/', authMiddleware_1.authenticateToken, usersController_1.UsersController.getAllUsers);
router.get('/:id', usersController_1.UsersController.getUserById);
router.post('/', usersController_1.UsersController.createUser);
router.put('/:id', usersController_1.UsersController.updateUser);
router.delete('/:id', usersController_1.UsersController.deleteUser);
exports.default = router;
