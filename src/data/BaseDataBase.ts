/******************** IMPORTS ********************/ 
import dotenv from "dotenv"
import knex from "knex"
import Knex from "knex"


/******************** CONFIG ********************/ 
dotenv.config()


export default class BaseDatabase {

    protected static USERS_TABLE = "lamusic_users"
    protected static MUSICS_TABLE = "lamusic_musics"
    protected static GENRES_TABLE = "lamusic_genres"
    protected static GENRES_MUSICS_TABLE = "lamusic_genres_musics"

    protected static connection: Knex = knex({
       client: "mysql",
       connection: {
          host: process.env.DB_HOST,
          port: Number(process.env.PORT || "3306"),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
       },
    });
 
    public static async destroyConnection(): Promise<void> {
       await BaseDatabase.connection.destroy();
    }
}