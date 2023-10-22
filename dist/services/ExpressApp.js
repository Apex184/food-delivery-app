"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("../routes");
exports.default = async (app) => {
    app.use(express_1.default.json({
        limit: '10mb'
    }));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)({ origin: '*' }));
    app.use("/admin", routes_1.AdminRoute);
    app.use("/vendor", routes_1.VendorRoute);
    app.use("/customer", routes_1.CustomerRoute);
    app.use(routes_1.ShoppingRoute);
    return app;
};
//# sourceMappingURL=ExpressApp.js.map