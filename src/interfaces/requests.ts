import { Request } from 'express';
import { ISignup_dto, ILogin_dto, IDish_dto } from './dtos';
import { TDishType } from './types';

export interface ISignup_request extends Request {
    body: ISignup_dto
}

export interface ILogin_request extends Request {
    body: ILogin_dto
}

export interface IDelete_user_request extends Request {
    body: {
        email: string
    }
}

export interface IAdd_new_dish_request extends Request {
    body: {
        name: string
        price: number
        description: string
        ingredients: string
        mass: number
        type: TDishType
    }
}

export interface IChange_dish_request extends Request {
    body: {
        name: string
        price: number
        description: string
        ingredients: string
        mass: number
        product_id: number
        image_ref: string
        type: TDishType
        promotionPrice: number | undefined
    }
}

export interface IGet_menu_with_filters_request extends Request {
    body: {
        filters: IGetMenuFilters
    }
}

export interface IGetMenuFilters {
    types: TDishType[]
    isPopular: boolean
    isPromoted: boolean
}
