"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let pills = [
    {
        id: 1,
        name: 'Paracetamol',
        description: 'Pain reliever and fever reducer',
        time: '08:00',
        image: 'paracetamol.png',
        dosage: '500mg',
        count: 20,
        lastTaken: '2025-06-18T08:00:00Z',
        refillReminderCount: 5,
        interactions: ['Alcohol', 'Warfarin']
    }
];
app.get('/api/pills', (req, res) => {
    res.json(pills);
});
app.get('/api/pills/:id', (req, res) => {
    const pill = pills.find(p => p.id === parseInt(req.params.id));
    if (pill)
        res.json(pill);
    else
        res.status(404).json({ message: 'Pill not found' });
});
app.post('/api/pills', (req, res) => {
    const newPill = Object.assign({ id: pills.length + 1 }, req.body);
    pills.push(newPill);
    res.status(201).json(newPill);
});
app.put('/api/pills/:id', (req, res) => {
    const index = pills.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        pills[index] = Object.assign(Object.assign({}, pills[index]), req.body);
        res.json(pills[index]);
    }
    else {
        res.status(404).json({ message: 'Pill not found' });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
