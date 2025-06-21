"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.execute('SELECT id, name, dosage, frequency, time, note, image,count FROM pills');
        res.json(rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, dosage, frequency, time, note, image } = req.body;
        const [result] = yield db_1.default.execute(`INSERT INTO pills (name, dosage, frequency, time, note, image,count)
       VALUES (?, ?, ?, ?, ?, ?)`, [name, dosage, frequency, time, note, image]);
        res.status(201).json({
            id: result.insertId,
            name,
            dosage,
            frequency,
            time,
            note,
            image,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, dosage, frequency, time, note, image } = req.body;
        const [result] = yield db_1.default.execute(`UPDATE pills SET name = ?, dosage = ?, frequency = ?, time = ?, note = ?, image = ?,count = ? WHERE id = ?`, [name, dosage, frequency, time, note, image, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pill not found' });
        }
        res.json({ id, name, dosage, frequency, time, note, image });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.execute('DELETE FROM pills WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pill not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
