import { TokenService } from './../services/token_service';
import { NextFunction, Request, Response } from "express"
import { ApiError } from "../exceptions/api_error"



export async function authMiddleware (req: Request, res: Response, next: NextFunction) {
    try {
        const accessToken = req.cookies.accessToken
        
        if (!accessToken) {
            return next (ApiError.UnauthoriezedError())
        }
        
        const userData = TokenService.validateAccessToken(accessToken)
        
        if (!userData) {
            return next (ApiError.UnauthoriezedError())
        }
        next()
    } catch (e){
        return next (ApiError.UnauthoriezedError())
    }
    
}