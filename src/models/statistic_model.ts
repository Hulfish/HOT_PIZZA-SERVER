import { Schema, model } from "mongoose";
import { IStatisticModel } from "../interfaces/models";

const StatisticSchema = new Schema<IStatisticModel>({
    last_used_id: {type: Number, default: 1}
})

export const StatisticModel = model<IStatisticModel>("Statistic", StatisticSchema)