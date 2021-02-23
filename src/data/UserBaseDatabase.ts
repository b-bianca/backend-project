import { User } from "../business/entities/User";
import BaseDatabase from "./BaseDataBase";

export class UserDatabase extends BaseDatabase {

    async insertUser (user: User): Promise<void> {

        try{
            await BaseDatabase.connection
            .insert({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                nickname: user.getNickname(),
                password: user.getPassword()
            })
            .into(BaseDatabase.USER_TABLE)
            
        }catch(error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}