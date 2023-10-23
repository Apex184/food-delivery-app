import express, { Request, Response, NextFunction } from 'express';
import {
    VendorLogin, addFood, getFoods,
    getVendorProfile, updateService,
    updateVendorProfile, updateCoverImages,
    GetCurrentOrders, GetOrderDetails, ProcessOrder,
    GetOffers, PostOffers, EditOffer
} from '../controllers';
import { Authentication } from '../middlewares';
import multer from "multer";
const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
});

const images = multer({ storage: imageStorage }).array('images', 10);


router.post("/login", VendorLogin);

router.use(Authentication)
router.get("/get-profile", getVendorProfile);
router.patch("/update-vendor-profile", updateVendorProfile);
router.patch("/update-service", updateService);
router.patch("/update-cover-image", images, updateCoverImages);
router.post('/add-food', images, addFood);
router.get('/get-foods', getFoods);

/** Managing Order**/
router.get('/orders', GetCurrentOrders);
router.put('/orders/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails);

/** Managing offers **/

router.get('/offers/', GetOffers);
router.post('/offers', PostOffers);
router.put('/offers/:id', EditOffer);





export { router as VendorRoute };
