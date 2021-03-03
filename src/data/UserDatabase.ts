import { User } from "../business/entities/User";
import BaseDatabase from "./BaseDatabase";


export class UserDatabase extends BaseDatabase {

    private static toUserModel(user: any) {
        return user && new User(
            user.id,
            user.name,
            user.email,
            user.nickname,
            user.password
        )
    }

    async insertUser (user: User): Promise<void> {

        try{
            await BaseDatabase.connection
            .insert({
                id: user.id,
                name: user.name,
                email: user.email,
                nickname: user.nickname,
                password: user.password
            })
            .into(BaseDatabase.USERS_TABLE)
            
        }catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async selectByEmailOrNickname (input: string): Promise<User> {

        try {
            const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.USERS_TABLE)
            .where({email: input})
            .orWhere({nickname: input })

            return UserDatabase.toUserModel(result[0])

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}