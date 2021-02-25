import { UserDatabase } from "../data/UserDatabase";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { loginInput, signUpInput, User } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private tokenManager: TokenManager,
        private userDatabase: UserDatabase
    ) {}

    async createUser (input: signUpInput) {

        try {

            const { name, email, nickname, password } = input

            if (!name || !email || !nickname || !password) {
                throw new CustomError(405, "Please fill in all fields")
            }

            if (!email.includes("@")) {
                throw new CustomError(406, "Invalid email. All addresses must have an @")
            }

            if (nickname.length < 3) {
                throw new CustomError(422, "The nickname must contain at least 03 characters")
            }

            if (password.length < 6) {
                throw new CustomError(422, "The password must contain at least 06 characters")
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

            return { accessToken }

        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }
    }

    async login (inputLogin: loginInput) {

        try {
            const { input, password } = inputLogin

            if (!input || !password) {
                throw new CustomError(405, "Please fill in all fields")
            }

            const user: User = await this.userDatabase.selectByEmailOrNickname(input)

            if (!user) {
                throw new CustomError(404, "User not found. Confirm email or nickname")
            }

            const passwordIsCorrect = this.hashManager.compareHash(password, user.password)

            if (!passwordIsCorrect) {
                throw new CustomError(401, "Invalid password")
            }

            const accessToken = this.tokenManager.generateToken({id: user.password})

            return  { accessToken }

        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }
    }
}



