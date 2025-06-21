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
exports.PillLogsController = void 0;
const db_1 = __importDefault(require("../config/db"));
class PillLogsController {
    static getAllLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [rows] = yield db_1.default.query('SELECT * FROM pill_logs');
                res.json(rows);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata logova', error });
            }
        });
    }
    static getLogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [rows] = yield db_1.default.query('SELECT * FROM pill_logs WHERE id = ?', [id]);
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Log nije pronađen' });
                }
                res.json(rows[0]);
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dohvata loga', error });
            }
        });
    }
    static createLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const log = req.body;
                const [result] = yield db_1.default.query('INSERT INTO pill_logs (pill_id, taken_at, status) VALUES (?, ?, ?)', [log.pill_id, log.taken_at, log.status]);
                res.status(201).json({ message: 'Log dodat', id: result.insertId });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom dodavanja loga', error });
            }
        });
    }
    static updateLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const log = req.body;
                const [result] = yield db_1.default.query('UPDATE pill_logs SET pill_id = ?, taken_at = ?, status = ? WHERE id = ?', [log.pill_id, log.taken_at, log.status, id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Log nije pronađen za izmenu' });
                }
                res.json({ message: 'Log izmenjen' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom izmene loga', error });
            }
        });
    }
    static deleteLog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const [result] = yield db_1.default.query('DELETE FROM pill_logs WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Log nije pronađen za brisanje' });
                }
                res.json({ message: 'Log obrisan' });
            }
            catch (error) {
                res.status(500).json({ message: 'Greška prilikom brisanja loga', error });
            }
        });
    }
}
exports.PillLogsController = PillLogsController;
