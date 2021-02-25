import { signUpInput } from "../src/business/entities/User"
import { UserBusiness } from "../src/business/UserBusiness"
import  { IdGenerator } from "../src/services/IdGenerator"
import  { HashManager } from "../src/services/HashManager"
import { TokenManager } from "../src/services/TokenManager"

describe("Testing signUp business", () => {

    const idGenerator =  {generate: jest.fn(() => "mockId")} as IdGenerator

    const hashManager = { generateHash: jest.fn(), compareHash: jest.fn() } as HashManager

    const tokenManager = {generateToken: jest.fn(() => "mockToken"), getTokenData: jest.fn()} as TokenManager

    const userDatabase = {insertUser: jest.fn()} as any

    const userBusiness: UserBusiness = new UserBusiness(
        idGenerator,
        hashManager,
        tokenManager,
        userDatabase
    )

    test("Should return empty name", async () => {
        expect.assertions(2)

        try {

            const input: signUpInput = {
                name: "",
                email: "mockemail@email.com",
                nickname: "mockNick",
                password: "mockpass"
            }

            await userBusiness.createUser(input)

        } catch (error) {
            expect(error.statusCode).toBe(405)
            expect(error.message).toBe("Please fill in all fields")
        }
    })

    test("Should return invalid email", async () => {
        expect.assertions(2)

        try {

            const input: signUpInput = {
                name: "mock",
                email: "mockemailemail.com",
                nickname: "mockNick",
                password: "mockpass"
            }

            await userBusiness.createUser(input)

        } catch (error) {
            expect(error.statusCode).toBe(406)
            expect(error.message).toEqual("Invalid email. All addresses must have an @")
        }
    })

    test("Should return invalid nickname error on nickname length shorter than 3", async () => {
        expect.assertions(2)

        try {

            const input: signUpInput = {
                name: "mock",
                email: "mockemail@email.com",
                nickname: "mo",
                password: "mockpass"
            }

            await userBusiness.createUser(input)

        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("The nickname must contain at least 03 characters")
        }
    })

    test("Should return invalid password error on password length shorter than 6", async () => {
        expect.assertions(2)

        try {

            const input: signUpInput = {
                name: "mock",
                email: "mockemail@email.com",
                nickname: "mockNick",
                password: "moc"
            }

            await userBusiness.createUser(input)

        } catch (error) {
            expect(error.statusCode).toBe(422)
            expect(error.message).toBe("The password must contain at least 06 characters")
        }
    })

    test("Should return token", async () => {
        expect.assertions(4)

        const input: signUpInput = {
            name: "mock",
            email: "mockemail@email.com",
            nickname: "mocknick",
            password: "mockpass"
        }
        
        const token = await userBusiness.createUser(input)

        expect(idGenerator.generate).toHaveReturnedWith("mockId")  
        expect(hashManager.generateHash).toHaveBeenCalled()
        expect(tokenManager.generateToken).toHaveBeenCalledTimes(1)
        expect(token).toEqual({accessToken: "mockToken"}) 
    })
})