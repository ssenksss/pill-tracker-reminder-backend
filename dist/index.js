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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const pillsRoutes_1 = __importDefault(require("./routes/pillsRoutes"));
const pillLogsRoutes_1 = __importDefault(require("./routes/pillLogsRoutes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.use('/api/users', usersRoutes_1.default);
app.use('/api/pills', pillsRoutes_1.default);
app.use('/api/pill-logs', pillLogsRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
const PORT = process.env.PORT || 3000;
function testDBConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield db_1.default.getConnection();
            console.log('Database connected successfully');
            connection.release();
        }
        catch (error) {
            console.error('Database connection failed:', error);
        }
    });
}
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port ${PORT}`);
    yield testDBConnection();
}));
