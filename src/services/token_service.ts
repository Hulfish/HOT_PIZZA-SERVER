import { ObjectId } from './../interfaces/types';
import { Schema } from 'mongoose';
import { Token } from 'typescript';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { ApiError } from './../exceptions/api_error';
import { TokenModel } from './../models/token_model';
import { ITokens_dto, ISaveToken_dto, IUser_dto, IRefreshToken_dto } from './../interfaces/dtos';
import { IUser_model } from "../interfaces/models";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET 
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET 


export class TokenService {
    static generateTokens (payload: IUser_dto): ITokens_dto {
        try {
            const userData: IUser_dto = {
                email: payload.email,
                password: payload.password,  
                nickname: payload.nickname,  
                id: payload.id, 
                isAdmin: payload.isAdmin,  
            }

            const accessToken = sign(userData, process.env.JWT_ACCESS_SECRET || "1", 
                {expiresIn: "30m"}); 
            const refreshToken = sign(userData, process.env.JWT_REFRESH_SECRET || "1", 
                {expiresIn: "30d"})
            return {
                accessToken, refreshToken
            }
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    static async saveToken (payload: ISaveToken_dto | JwtPayload): Promise<void> {
        try {
            const tokenData = await TokenModel.findOne({user: payload.user})
            if (tokenData) {
                tokenData.token = payload.token;
                await tokenData.save();
                return
            }
            const token = new TokenModel(payload)
            await token.save()
            return 
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    static async refresh(payload: IRefreshToken_dto): Promise<ITokens_dto> {
        try {
            const refreshToken = await TokenModel.findOne({user: payload.user})
            if (!refreshToken) {
                throw ApiError.UnauthoriezedError()
            }
            const userData = this.validateRefreshToken(payload.token)
            
            if (!userData) {
                throw ApiError.UnauthoriezedError()
            }
            const tokens: ITokens_dto = this.generateTokens(userData)
            return tokens
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
    static validateAccessToken (payload: string): IUser_dto | undefined {
        const userData = verify(payload, process.env.JWT_ACCESS_SECRET || "1") as IUser_dto
        return userData
    }
    static validateRefreshToken (payload: string): IUser_dto | undefined {
        try {
            const userData = verify(payload, process.env.JWT_REFRESH_SECRET || "1") as (IUser_dto | undefined) || undefined
            return userData
        } catch (e) {
            console.log(e)
            throw new Error()
        }
        
    }

    static async deleteToken(refreshToken: string): Promise<void> {
        try {
            const user_id = this.validateRefreshToken(refreshToken)?.id
            if (!user_id) {
                throw new Error()
            }
            await TokenModel.deleteOne({user: user_id})
            return
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    } 
    static async deleteTokenByUserId(id: ObjectId): Promise<void> {
        try {
            const checkTokenSession = await TokenModel.deleteOne({user: id})
            return 
        } catch (e) {
            console.log(e)
            throw new Error()
        }
    }
}