"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
const utility_1 = require("../utility");
const Authentication = async (req, res, next) => {
    const validate = await (0, utility_1.validateSignature)(req);
    if (validate) {
        next();
    }
    else {
        return res.status(403).json({
            success: false, message: 'User is not authorized'
        });
    }
};
exports.Authentication = Authentication;
//# sourceMappingURL=CommonAuth.js.map