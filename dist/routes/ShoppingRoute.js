"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
/**Get Food Availability */
router.get('/:pincode', controllers_1.getFoodAvailability);
/**Top Restaurant */
router.get('/top-restaurants/:pincode', controllers_1.getTopRestaurants);
/**Get Food ready in 30 minutes */
router.get('/ready-in-30-mins/:pincode', controllers_1.getFoodIn30Min);
/**Search Foods */
router.get('/search/:pincode', controllers_1.searchFoods);
/**Find restaurant by id */
router.get('/restaurant/:id', controllers_1.getRestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map