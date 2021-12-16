import { TDishType } from './types';
import { Schema } from 'mongoose';

export interface ISignup_dto {
    email: string
    password: string
    nickname: string
    isAdmin: boolean
}

export interface ILogin_dto {
    email: string
    password: string
}

export interface ITokens_dto {
    accessToken: string
    refreshToken: string
}

export interface ISaveToken_dto {
    token: string
    user: Schema.Types.ObjectId
}

export interface IRefreshToken_dto extends ISaveToken_dto {
    
}

export interface IUser_dto {
    email: string
    password: string
    nickname: string
    id: Schema.Types.ObjectId
    isAdmin: boolean
}

export interface IDish_dto {
    product_id: number
    name: string
    price: number
    description: string
    ingredients: string[]
    mass: number
    image_ref: string
    type: TDishType
    isPromoted?: boolean
    promotionPrice?: number | undefined
    [key: string]: string | number | string[] | boolean | undefined
}

export interface IStatistics_dto {
    last_used_id: number
}