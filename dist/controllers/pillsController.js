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
exports.PillsController = void 0;
const db_1 = __importDefault(require("../config/db"));
class PillsController {
    static getAllPills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM pills');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata lekova', error });
            }
        });
    }
    static getPillById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [rows] = yield db_1.default.query('SELECT * FROM pills WHERE id = ?', [id]);
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Lek nije pronađen' });
                }
                res.json(rows[0]);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata leka', error });
            }
        });
    }
    static createPill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pill = req.body;
                const [result] = yield db_1.default.query(`INSERT INTO pills (user_id, name, dosage, frequency, time, note, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    pill.user_id || null,
                    pill.name,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                    pill.image || null,
                ]);
                res.status(201).json({ message: 'Lek dodat', id: result.insertId });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dodavanja leka', error });
            }
        });
    }
    static updatePill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const pill = req.body;
                const [result] = yield db_1.default.query(`UPDATE pills SET user_id = ?, name = ?, dosage = ?, frequency = ?, time = ?, note = ?, image = ? WHERE id = ?`, [
                    pill.user_id || null,
                    pill.name,
                    pill.dosage || null,
                    pill.frequency || null,
                    pill.time || null,
                    pill.note || null,
                    pill.image || null,
                    id,
                ]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Lek nije pronađen za izmenu' });
                }
                res.json({ message: 'Lek izmenjen' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom izmene leka', error });
            }
        });
    }
    static deletePill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM pills WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Lek nije pronađen za brisanje' });
                }
                res.json({ message: 'Lek obrisan' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom brisanja leka', error });
            }
        });
    }
}
exports.PillsController = PillsController;
