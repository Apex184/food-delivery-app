import express, { Request, Response, NextFunction } from 'express';
import {
    VendorLogin, addFood, getFoods,
    getVendorProfile, updateService,
    updateVendorProfile, updateCoverImages
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





export { router as VendorRoute };
