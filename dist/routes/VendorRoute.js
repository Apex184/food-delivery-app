"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post("/login", controllers_1.VendorLogin);
router.use(middlewares_1.Authentication);
router.get("/get-profile", controllers_1.getVendorProfile);
router.patch("/update-vendor-profile", controllers_1.updateVendorProfile);
router.patch("/update-service", controllers_1.updateService);
router.patch("/update-cover-image", images, controllers_1.updateCoverImages);
router.post('/add-food', images, controllers_1.addFood);
router.get('/get-foods', controllers_1.getFoods);
/** Managing Order**/
router.get('/orders', controllers_1.GetCurrentOrders);
router.put('/orders/:id/process', controllers_1.ProcessOrder);
router.get('/order/:id', controllers_1.GetOrderDetails);
/** Managing offers **/
router.get('/offers/', controllers_1.GetOffers);
router.post('/offers', controllers_1.PostOffers);
router.put('/offers/:id', controllers_1.EditOffer);
//# sourceMappingURL=VendorRoute.js.map