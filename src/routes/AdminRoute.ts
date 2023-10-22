import express from 'express';
import { CreateVendor, GetVendors, GetVendorById } from '../controllers';
const router = express.Router();


router.post("/create-vendor", CreateVendor);

router.get("/vendors", GetVendors);

router.get("/vendor/:id", GetVendorById);


export { router as AdminRoute };
