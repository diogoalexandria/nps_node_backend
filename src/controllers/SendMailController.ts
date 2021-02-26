import { resolve } from 'path';
import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRespository } from "../repositories/SurveysRespository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRespository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {
    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body;
        console.log(email)

        const usersRepository = getCustomRepository(UsersRespository);
        const surveysRepository = getCustomRepository(SurveysRespository);
        const surveysUsersRepository =getCustomRepository(SurveysUsersRepository);

        const userExists = await usersRepository.findOne({ email });
        console.log(userExists)

        if (!userExists) {
            return res.status(400).json({
                error: "User does not exists."
            });
        }

        const surveyExists = await surveysRepository.findOne({ id: survey_id });
        if (!surveyExists) {
            return res.status(400).json({
                error: "Survey does not exists."
            })
        }

        const variables = {
            name: userExists.name,
            title: surveyExists.title,
            description: surveyExists.description,
            user_id: userExists.id,
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists =  await surveysUsersRepository.findOne({
            where: [
                {
                    user_id: userExists.id
                },
                {
                    value: null
                }
            ],
            relations: [ "user", "survey" ]
        })

        if(surveyUserAlreadyExists) {
            const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
            return res.json(surveyUserAlreadyExists)
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userExists.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, surveyExists.title, variables, npsPath);

        return res.status(201).json(surveyUser)
    }; 
};

export { SendMailController }
