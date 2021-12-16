import { ApiError } from './../exceptions/api_error';
import fs from "fs"
import path from "path"
import { UploadedFile } from 'express-fileupload';
import { v4 } from 'uuid';

import { StatisticsService } from './../services/statistics_service';
import { IDish_dto } from './../interfaces/dtos';
import { IAdd_new_dish_request, IChange_dish_request, IGetMenuFilters, IGet_menu_with_filters_request } from './../interfaces/requests';
import { NextFunction, Request, Response } from "express";
import { DishModel } from "../models/dish_model";
import { IDishModel } from '../interfaces/models';
import { FilterQuery } from 'mongoose';
import { TDishType } from "../interfaces/types";


interface IImageFile {
    image: UploadedFile
}

export class ProductController {
    static async getMenu (req: Request, res: Response, next: NextFunction) {
        try {
            const menu = await DishModel.find()
            res.status(200).json({message: "success", menu})
        } catch (e) {
            next(e)
        }
    }

    static async createDish (req: IAdd_new_dish_request, res: Response, next: NextFunction) {
        try {
            const rawFile = req.files as unknown
            const imageFile = rawFile as IImageFile
            const image = imageFile.image
            const imageName = v4()
            image.mv(path.resolve(__dirname, "..", "..", "src", "static", "images", (imageName + `.${image.mimetype.split("/")[1]}`)))
            const product_id = await StatisticsService.getNewProductId()
            const dish_dto: IDish_dto = {
                ...req.body, 
                product_id,
                name: req.body.name.trim(), 
                image_ref: imageName,
                ingredients: JSON.parse(req.body.ingredients)
            }
            
            const dish = new DishModel(dish_dto)
            await dish.save()
            await StatisticsService.incrementMaxProductId()
            res.status(201).json({message: "success"})
            
        } catch (e) {
            console.log(e)
            next(e)
        }
    } 
    static async changeDish (req: IChange_dish_request, res: Response, next: NextFunction) {
        try {
            const dish = await DishModel.findOne({product_id: req.body.product_id})
            if (!dish) {
                return res.status(404).json({message: "no such dish"})
            }
            const dish_dto: IDish_dto = {
                ...req.body, 
                name: req.body.name.trim(), 
                image_ref: JSON.parse(req.body.image_ref),
                ingredients: JSON.parse(req.body.ingredients)
            }

            

            Object.keys(dish_dto).forEach((key) => {
                dish[key] = dish_dto[key]
            })

            const rawFile = req.files as unknown
            if (rawFile) {
                const prev_image = dish_dto.image_ref
                const imageFile = rawFile as IImageFile
                const image = imageFile.image
                const imageName = v4()
                image.mv(path.resolve(__dirname, "..", "static", "images", (imageName + `.${image.mimetype.split("/")[1]}`)))
                dish.image_ref = imageName
                fs.rm(path.resolve(__dirname, "..", "static", "images", (prev_image + ".jpeg")), (err)=>{console.log(err)})
            }
            await dish.save()
            res.status(201).json({message: "success"})
        } catch (e) {
            console.log(e)
            next(e)
        }
    }

    static async getMenuWithinFilters (req: IGet_menu_with_filters_request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: IGetMenuFilters = req.body.filters
            const query = DishModel.find()

            if (filters.isPopular) {
                query.and([{isPopular: {$exists: true}}])
            }

            if (filters.isPromoted) {
                query.and([{isPromoted: true}])
            }

            if (filters.types?.[0]) {
                interface IQueryParams {
                    type: TDishType
                    [key: string]: TDishType
                }
                let query_params: IQueryParams[] = []

                filters.types.forEach((key, i) => {
                    query_params.push({type: key})
                })
                query.or(query_params)
            } else {
                query.or([{type: {$exists: true}}])
            }

            const preferencedMenu = await query

            res.json({message: "success", count: preferencedMenu.length, menu: preferencedMenu})
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
}