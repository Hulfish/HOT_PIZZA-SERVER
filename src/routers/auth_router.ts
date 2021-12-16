import { AuthController } from './../controllers/auth_controller';
import { Router } from "express";
import { authMiddleware } from '../middlewares/auth_middleware';
import { body } from 'express-validator';
import { checkValidationMiddleware } from '../middlewares/check_validation_middleware';

export const auth_router = Router()
//** << /api/auth/... >> */

auth_router.post('/login', AuthController.login)
auth_router.get('/login', AuthController.loginOnload)
auth_router.get('/logout', AuthController.logout)
auth_router.post('/signup', 
    body("email", "Ваш email является невалидным").isEmail(), 
    body("password", "Длина пароля является невалидной").isLength({max: 32, min: 8}), 
    checkValidationMiddleware,
    AuthController.signup
)
auth_router.get('/refresh', AuthController.refresh)
auth_router.get('/check_admin', AuthController.checkAdmin)
