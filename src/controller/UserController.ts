import { Request, Response } from "express"
import { loginInput, signUpInput } from "../business/entities/User"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../data/UserBaseDatabase"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"



const userBusiness = new UserBusiness(
    new IdGenerator(), 
    new HashManager(),
    new TokenManager(),
    new UserDatabase()
)

export class UserController {

    async signUp(req: Request, res: Response) {

        try {
            const input: signUpInput = {
                name: req.body.name,
                email: req.body.email,
                nickname: req.body.nickname,
                password: req.body.password
            }

            const token = await userBusiness.createUser(input)

            res.status(201).send({ message: "Success!", token })

        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async login (req: Request, res: Response) {

        try {
            const inputLogin: loginInput = {
                input: req.body.input,
                password: req.body.password
            }

            const token = await userBusiness.login(inputLogin)

            res.status(201).send({ message: "Logged user!", token })

        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }
}