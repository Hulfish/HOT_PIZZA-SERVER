import { TokenService } from './../services/token_service';
import { NextFunction } from 'express';
import { ITokens_dto } from './../interfaces/dtos';
import { ILogin_request, ISignup_request } from './../interfaces/requests';
import { UserModel } from '../models/user_model';
import { Request, Response } from 'express';
import { AuthService } from '../services/auth_service';
import { ApiError } from '../exceptions/api_error';
import { compare } from 'bcrypt';

const REFRESH_TOKEN_MAX_AGE: number = 1000 * 86400 * 30 
const ACCESS_TOKEN_MAX_AGE: number =  1000 * 1800

export class AuthController {
    static async signup(req: ISignup_request , res: Response, next: NextFunction ) {
        try {
            
            const {password, email, nickname } = req.body
            const candidate = await UserModel.findOne({email})
            if (candidate) {
                return res.status(400).json({message: "Пользователь с таким email уже существует"})
            }
            const checkNickname = await UserModel.findOne({nickname})
            if (checkNickname) {
                return res.status(400).json({message: "Пользователь с таким никнеймом уже существует"})
            }
            
            
            const tokens: ITokens_dto = await AuthService.createUser(req.body)

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                maxAge: REFRESH_TOKEN_MAX_AGE
            })

            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })

            return res.status(201).json({message: "success", accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    static async refresh (req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string = req.cookies.refreshToken
            if (!refreshToken) {
                res.status(400).send()
            }
            const tokens = await AuthService.refresh(refreshToken)
            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })
            res.status(200).json({accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    static async logout (req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken: string | undefined = req.cookies.refreshToken
            if (refreshToken) {
                await TokenService.deleteToken(refreshToken)
            }
            res.clearCookie("refreshToken")
            res.clearCookie("accessToken")
            res.send()
        } catch (e) {
            next(e)
        }
    }

    static async login (req: ILogin_request, res: Response, next: NextFunction) {
        try {
            const {email, password} = req.body
            const checkSession = await UserModel.findOne({email})
            if (!checkSession) {
                throw ApiError.NotFoundError(`User ${email} not found`)
            }
            const checkPasswordSession = await compare(password, checkSession.password)

            if (!checkPasswordSession) {
                throw ApiError.BadRequest("Неправильный пароль")
            }

            const tokens = await AuthService.login(req.body)

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                maxAge: REFRESH_TOKEN_MAX_AGE
            })
            res.cookie("accessToken", tokens.accessToken, {
                httpOnly: true,
                maxAge: ACCESS_TOKEN_MAX_AGE
            })

            res.status(200).json({message: "success", accessToken: tokens.accessToken})
        } catch (e) {
            next(e)
        }
    }

    static async loginOnload (req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.cookies.accessToken
            if (!accessToken) {
                throw ApiError.UnauthoriezedError()
            }
            const userData = TokenService.validateAccessToken(accessToken)
            if (!userData) {
                throw ApiError.UnauthoriezedError()
            }
            res.status(200).json({message: "success", userData: {...userData, password: null}})

        } catch (e) {
            next(e)
        }
    }

    static async checkAdmin (req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) {
                return res.status(403).json({message: "failure"})
            }
            const userData = TokenService.validateRefreshToken(refreshToken as string)
            if (!userData) {
                return res.status(403).json({message: "failure"})
            }
            if (userData.isAdmin) {
                return res.status(200).json({message: "json"})
            }
            return res.status(403).json({message: "failure: ST1"})
        } catch (e) {
            next(e)
        }
    }
}

