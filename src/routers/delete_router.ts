import { Router } from "express";
import { DeleteController } from "../controllers/delete_controller";
import { checkRoleMiddleware } from "../middlewares/check_role_middleware";

export const delete_router = Router()

//** << /api/delete/... >> */

delete_router.delete("/delete_user", DeleteController.deleteUser )
delete_router.delete("/delete_dish/:product_id", checkRoleMiddleware, DeleteController.deleteDish)