"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
const Database_1 = __importDefault(require("./services/Database"));
const startServer = async () => {
    const app = (0, express_1.default)();
    await (0, Database_1.default)();
    await (0, ExpressApp_1.default)(app);
    app.listen(3000, () => {
        console.log("Server listening on port 3000");
    });
};
startServer();
//# sourceMappingURL=index.js.map