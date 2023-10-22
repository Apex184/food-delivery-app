import express from 'express';
import { getFoodAvailability, getTopRestaurants, getFoodIn30Min, searchFoods, getRestaurantById } from '../controllers';

import { Authentication } from '../middlewares';

const router = express.Router();

/**Get Food Availability */
router.get('/:pincode', getFoodAvailability);

/**Top Restaurant */
router.get('/top-restaurants/:pincode', getTopRestaurants);

/**Get Food ready in 30 minutes */
router.get('/ready-in-30-mins/:pincode', getFoodIn30Min);

/**Search Foods */
router.get('/search/:pincode', searchFoods);

/**Find restaurant by id */
router.get('/restaurant/:id', getRestaurantById);


/**Add to cart */

export { router as ShoppingRoute };
