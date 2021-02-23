import { UserDatabase } from "../data/UserBaseDatabase";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { signUpInput, User } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator = new IdGenerator(),
        private hashManager: HashManager = new HashManager(),
        private tokenManager: TokenManager = new TokenManager(),
        private userDatabase: UserDatabase = new UserDatabase()
    ) {}

    async createUser (input: signUpInput) {

        try {

            const { name, email, nickname, password } = input

            if (!name || !email || !nickname || !password) {
                throw new CustomError(405, "Please fill in all fields!")
            }

            if (!email.includes("@")) {
                throw new CustomError(406, "Invalid email!")
            }

            if (nickname.length < 3) {
                throw new CustomError(422, "The password must contain at least 06 characters!")
            }

            if (password.length < 6) {
                throw new CustomError(422, "The password must contain at least 06 characters!")
            }

            const id = this.idGenerator.generate()

            const hashPassword = this.hashManager.generateHash(password)

            const user = new User(
                id,
                name,
                email,
                nickname,
                hashPassword
            )

            await this.userDatabase.insertUser(user)

            const accessToken = this.tokenManager.generateToken({id})

            return accessToken

        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }
    }
}



