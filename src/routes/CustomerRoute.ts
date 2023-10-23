import express from 'express';
import {
    CustomerSignUp, CreateOrder, GetOrders, GetOrderById,
    CustomerLogin, CustomerVerify, AddToCart, GetCart, DeleteCart,
    RequestOtp, CustomerProfile, EditCustomerProfile
} from '../controllers';

import { Authentication } from '../middlewares';

const router = express.Router();


router.post("/signup", CustomerSignUp);

router.post("/login", CustomerLogin);

router.use(Authentication);

router.patch("/verify", CustomerVerify);

router.get("/otp", RequestOtp);

router.get("/profile", CustomerProfile);

router.patch("/edit-profile", EditCustomerProfile);
/** Order**/
router.post("/create-order", CreateOrder);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);

/**-----Cart-----**/

router.post("/add-to-cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/delete-cart", DeleteCart);

/**-----Payment-----**/






export { router as CustomerRoute };
