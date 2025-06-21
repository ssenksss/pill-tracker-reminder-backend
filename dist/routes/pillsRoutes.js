"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pillsController_1 = require("../controllers/pillsController");
const router = express_1.default.Router();
router.get('/', pillsController_1.PillsController.getAllPills);
router.get('/:id', pillsController_1.PillsController.getPillById);
router.post('/', pillsController_1.PillsController.createPill);
router.put('/:id', pillsController_1.PillsController.updatePill);
router.delete('/:id', pillsController_1.PillsController.deletePill);
exports.default = router;
