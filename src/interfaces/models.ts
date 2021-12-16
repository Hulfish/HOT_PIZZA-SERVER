import { Schema } from 'mongoose';
import { TDishType } from './types';

export interface IUser_model {
    nickname: string
    email: string
    password: string
    isAdmin: boolean
    id?: Schema.Types.ObjectId
    
}

export interface IToken_model {
    user: Schema.Types.ObjectId
    token: string
}

export interface IDishModel {
    product_id: number
    name: string
    price: number
    description: string
    ingredients: string[]
    mass: number
    image_ref: string
    promotion_price: number | undefined
    type: TDishType

    isPopular: boolean
    isPromoted: boolean

    [key: string]: string | number | string[] | boolean | undefined
}

export interface IStatisticModel {
    last_used_id: number
}