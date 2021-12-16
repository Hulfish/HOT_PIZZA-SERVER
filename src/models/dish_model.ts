import { IDishModel } from './../interfaces/models';
import { Schema, model } from "mongoose";

const DishSchema = new Schema<IDishModel>({
    name: {type: String, unique: true, required: true},
    product_id: {type: Number, unique: true, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    ingredients: [String],
    mass: {type: Number, required: true},
    image_ref: {type: String, required: true},
    isPopular: {type: Boolean, default: false},
    isPromoted: {type: Boolean, default: false},
    promotionPrice: {type: Number, default: undefined},
    type: {type: String, required: true},
})

export const DishModel = model<IDishModel>("Dish", DishSchema)