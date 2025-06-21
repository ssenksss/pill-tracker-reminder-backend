"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pillLogsController_1 = require("../controllers/pillLogsController");
const router = express_1.default.Router();
router.get('/', pillLogsController_1.PillLogsController.getAllLogs);
router.get('/:id', pillLogsController_1.PillLogsController.getLogById);
router.post('/', pillLogsController_1.PillLogsController.createLog);
router.put('/:id', pillLogsController_1.PillLogsController.updateLog);
router.delete('/:id', pillLogsController_1.PillLogsController.deleteLog);
exports.default = router;
