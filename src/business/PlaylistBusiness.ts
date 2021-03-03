import { title } from "process";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { createPlaylistInput, Playlist } from "./entities/Playlist";
import { authenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class PlaylistBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private playlistDatabase: PlaylistDatabase
    ) {}

    async createPlaylist(token: string, input: createPlaylistInput) {

        const { title, subtitle, image } = input

        if(!title || !subtitle) {
            throw new CustomError(405, "Please fill in all fields")
        }
    
        const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 
    
         if(!verifyToken) {
            throw new CustomError(401, "Unauthorized. Verify token")
        }

        const id: string = this.idGenerator.generate()

        const date: Date = new Date()

        const playlist = new Playlist(
            id,
            title,
            subtitle,
            date,
            image
        )

        await this.playlistDatabase.createPlaylist(playlist)

        return playlist 
        
    }
}