import { loginInput, User } from "../src/business/entities/User"
import { UserBusiness } from "../src/business/UserBusiness"
import { HashManager } from "../src/services/HashManager"
import { IdGenerator } from "../src/services/IdGenerator"
import { TokenManager } from "../src/services/TokenManager"

describe("Testing login business", () => {

    const idGenerator =  {generate: jest.fn(() => "mockId")} as IdGenerator

    let hashManager = { generateHash: jest.fn(), compareHash: jest.fn() } as HashManager

    const tokenManager = {generateToken: jest.fn(() => "mockToken"), getTokenData: jest.fn()} as TokenManager

    let userDatabase = { selectByEmailOrNickname: jest.fn((input: string) => undefined)} as any

    const userBusiness: UserBusiness = new UserBusiness(
        idGenerator,
        hashManager,
        tokenManager,
        userDatabase
    )
    
    
    test("Should return empty input", async () => {
        expect.assertions(2)

        try {

            const input: loginInput = {
                input: "",
                password: "mockpass"
            }

            await userBusiness.login(input)

        } catch (error) {
            expect(error.statusCode).toBe(405)
            expect(error.message).toBe("Please fill in all fields")
        }
    })

    test("Should return user not found", async () => {
        expect.assertions(2)

        try {

            const input: loginInput = {
                input: "moc",
                password: "mockpass"
            }

            await userBusiness.login(input)

        } catch (error) {
            expect(error.statusCode).toBe(404)
            expect(error.message).toBe("User not found. Confirm email or nickname")
        }
    })

    test("Should return invalid password", async () => {
        expect.assertions(2)

        try {

            hashManager = { 
                generateHash: jest.fn( () => "mockpass"),
                compareHash: jest.fn((hashPassword: string, hash: string) => false)
            } as any 

            userDatabase = {
                selectByEmailOrNickname: jest.fn ( () =>  new User (
                    "mockId",
                    "mock",
                    "mock@email.com",
                    "mocknick",
                    "mockpass"
                    )
                )
            } 
    
            const loginUserBusiness = new UserBusiness(
                idGenerator,
                hashManager,
                tokenManager,
                userDatabase 
            )

            const input: loginInput = {
                input: "mock",
                password: "moc"
            }

            await loginUserBusiness.login(input)

        } catch (error) {
            expect(error.statusCode).toBe(401)
            expect(error.message).toBe("Invalid password")
        }
    })

    test("Should return token", async () => {
        expect.assertions(3)

        hashManager = { 
            generateHash: jest.fn( () => "mockpass"),
            compareHash: jest.fn((hashPassword: string, hash: string) => true)
        } as any 

        userDatabase = {
            selectByEmailOrNickname: jest.fn ( () =>  new User (
                "mockId",
                "mock",
                "mock@email.com",
                "mocknick",
                "mockpass"
                )
            )
        } 

        const loginUserBusiness = new UserBusiness(
            idGenerator,
            hashManager,
            tokenManager,
            userDatabase 
        )

        const input: loginInput = {
            input: "mock",
            password: "mockpass"
        }

        const token = await loginUserBusiness.login(input)

        expect(hashManager.compareHash).toHaveReturnedWith(true)
        expect(tokenManager.generateToken).toHaveBeenCalledTimes(1)
        expect(token).toEqual({accessToken: "mockToken"}) 
    })
})