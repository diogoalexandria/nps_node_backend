import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRespository } from "../repositories/SurveysRespository";

class SurveysController {
    async create(req: Request, res: Response) {
        const { title, description } = req.body;
        
        const surveysRespository = getCustomRepository(SurveysRespository);

        const survey = surveysRespository.create({
            title,
            description
        });

        await surveysRespository.save(survey);

        return res.status(201).json({
            message: "Survey created!",
            survey
        })
    };

    async show(req: Request, res: Response) {
        const surveysRespository = getCustomRepository(SurveysRespository);
        
        const all = await surveysRespository.find();

        return res.json(all);
    }
};

export { SurveysController };