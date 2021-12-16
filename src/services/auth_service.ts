import { TokenModel } from './../models/token_model';
import { ApiError } from './../exceptions/api_error';
import { TokenService } from './token_service';
import bcrypt from "bcrypt"
import { UserModel } from '../models/user_model';
import { ISignup_dto, ITokens_dto, ISaveToken_dto, IUser_dto, IRefreshToken_dto, ILogin_dto } from './../interfaces/dtos';


export class AuthService {
    static async createUser (signup_dto: ISignup_dto): Promise<ITokens_dto> {
        try {
            const passwordHashed = await bcrypt.hash(signup_dto.password, 2)
            const signup_dto_hashed: ISignup_dto = {...signup_dto, password: passwordHashed, isAdmin: false}
            const user = new UserModel(signup_dto_hashed)
            const id = user.id
            await user.save()
            const user_dto: IUser_dto = {...signup_dto_hashed, id}
            const tokens: ITokens_dto = TokenService.generateTokens(user_dto)
            const saveToken_dto: ISaveToken_dto = {
                user: user.id,
                token: tokens.accessToken
            }
            await TokenService.saveToken(saveToken_dto)
            return tokens
        } catch (e) {
            console.log(e)
            throw new Error("createUser problem above")
        }
    }
    static async refresh (refreshToken: string | undefined): Promise<ITokens_dto> {
        try {
            if (!refreshToken) {
                throw ApiError.UnauthoriezedError()
            }
            const id = TokenService.validateRefreshToken(refreshToken)?.id
            if (!id) {
                throw ApiError.UnauthoriezedError()
            }
            const refreshToken_dto: IRefreshToken_dto = {
                user: id,
                token: refreshToken
            }
            const tokens = await TokenService.refresh(refreshToken_dto)
            
            const saveToken_dto: ISaveToken_dto = {
                user: id,
                token: tokens.refreshToken
            }
            await TokenService.saveToken(saveToken_dto)
            return tokens
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }

    static async login (login_dto: ILogin_dto): Promise<ITokens_dto> {
        try {
            const user = await UserModel.findOne({email: login_dto.email})

            if (!user) {
                throw ApiError.NotFoundError(`user with email ${login_dto.email} not found`)
            }
            
            const user_dto: IUser_dto = {
                id: user.id,
                nickname: user.nickname,
                password: user.password,
                email: user.email,
                isAdmin: user.isAdmin
            }

            const tokens: ITokens_dto = TokenService.generateTokens(user_dto)

            const saveToken_dto: ISaveToken_dto = {
                token: tokens.refreshToken, 
                user: user.id
            }
            
            await TokenService.saveToken(saveToken_dto)
            return tokens
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}