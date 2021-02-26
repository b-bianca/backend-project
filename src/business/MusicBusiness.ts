import { MusicDatabase } from "../data/MusicDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { createMusicInput, Music } from "./entities/Music";
import { authenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class MusicBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private musicDatabase: MusicDatabase
    ) {}

    async createMusic (token: string, input: createMusicInput) {
        
        try {
            const { title, author, file, album, genres } = input

            if(!title || !author || !file || !album || !genres) {
                throw new CustomError(405, "Please fill in all fields")
            }
            
            const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 

            if(!verifyToken) {
                throw new CustomError(401, "Unauthorized. Verify token")
            }

            const id: string = this.idGenerator.generate()

            const date: Date = new Date()

            const userId = verifyToken.id
           
            const music = new Music(
                id, 
                title,
                author,
                date,
                file,
                album,
                userId,
                genres
            )

            await this.musicDatabase.createMusic(music)

            return music

        } catch (error) {
            throw new CustomError(error.statusCode || 400, error.message)
        }
    }
}