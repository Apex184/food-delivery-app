import express from 'express';
import { CustomerSignUp, CustomerLogin, CustomerVerify, RequestOtp, CustomerProfile, EditCustomerProfile } from '../controllers';

import { Authentication } from '../middlewares';

const router = express.Router();


router.post("/signup", CustomerSignUp);

router.post("/login", CustomerLogin);

router.use(Authentication);

router.patch("/verify", CustomerVerify);

router.get("/otp", RequestOtp);

router.get("/profile", CustomerProfile);

router.patch("/edit-profile", EditCustomerProfile);


/**-----Cart-----**/
/**-----Order-----**/
/**-----Payment-----**/






export { router as CustomerRoute };
