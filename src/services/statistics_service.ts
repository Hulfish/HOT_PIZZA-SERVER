import { IStatistics_dto } from './../interfaces/dtos';
import { IStatisticModel } from './../interfaces/models';
import { StatisticModel } from "../models/statistic_model"

export class StatisticsService {
    static async getNewProductId (): Promise<number> {
        try {
            const statisticsObject = await StatisticModel.findOne()
            if (!statisticsObject) {
                const statistics_dto: IStatistics_dto = {
                    last_used_id: 1
                }
                const statisticsObject = new StatisticModel(statistics_dto)
                await statisticsObject.save()
                return 1 
            }
            const product_id = statisticsObject.last_used_id
            return product_id 
        } catch (e) {
            throw new Error(e as string)
        }
    } 

    static async incrementMaxProductId (): Promise<void> {
        try {
            const statisticsObject = await StatisticModel.findOne()
            if (!statisticsObject) {
                return
            }
            ++statisticsObject.last_used_id
            await statisticsObject.save()
        } catch (e) {
            throw new Error(e as string)
        }
    }

}