"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
exports.default = async () => {
    try {
        mongoose_1.default.connect(config_1.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        mongoose_1.default.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        });
        mongoose_1.default.connection.on("error", (err) => {
            console.log("Error connecting to MongoDB", err);
        });
    }
    catch (err) {
        console.log("Error connecting to MongoDB", err);
    }
};
//# sourceMappingURL=Database.js.map