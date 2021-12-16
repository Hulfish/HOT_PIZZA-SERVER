import { ProductController } from './../controllers/product_controller';
import { Router } from "express";
import { checkRoleMiddleware } from '../middlewares/check_role_middleware';

export const product_router = Router()

//** << /api/product/... >> */

product_router.get("/get_all", ProductController.getMenu)
product_router.post("/get_within_filters", ProductController.getMenuWithinFilters)
product_router.post("/create_dish", /** Check role middleware, */ ProductController.createDish)
product_router.post("/change_dish", /** Check role middleware, */ ProductController.changeDish)