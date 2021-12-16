import { UserModel } from './../models/user_model';
import { NextFunction, Request, Response } from 'express';
import { nextTick } from 'process';
import { ApiError } from '../exceptions/api_error';
import { TokenService } from '../services/token_service';
export async function checkRoleMiddleware (req: Request , res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw ApiError.UnauthoriezedError()
        }
        const userData = TokenService.validateAccessToken(accessToken)
        if (!userData) {
            return ApiError.UnauthoriezedError()
        }
        const userAccount = await UserModel.findById(userData.id)
        if (!userAccount) {
            res.status(402).json({message: "access failure"});
            return
        }
        if (!userAccount.isAdmin) {
            res.status(402).json({message: "access failure"});
            return
        }
        next()
    } catch (e) {
        next(e)
    }
}