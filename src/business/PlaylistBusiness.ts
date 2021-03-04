import { title } from "process";
import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { createPlaylistInput, musicsPlaylist, Playlist } from "./entities/Playlist";
import { authenticationData } from "./entities/User";
import { CustomError } from "./error/CustomError";

export class PlaylistBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private playlistDatabase: PlaylistDatabase
    ) {}

    async createPlaylist(token: string, input: createPlaylistInput) {

        try{
            const { title, subtitle, image } = input

            if(!title || !subtitle) {
                throw new CustomError(405, "Please fill in all fields")
            }
        
            const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 
        
             if(!verifyToken) {
                throw new CustomError(401, "Unauthorized. Verify token")
            }
    
            const userId = verifyToken.id
    
            const playlists = await this.playlistDatabase.getAllPlaylist(userId)
               
            const playlistAlreadyExist = playlists && playlists.find((playlist) => playlist.title === title)
    
            if(playlistAlreadyExist) {
                throw new CustomError(422, "Playlist already registered")
            }
    
            const id: string = this.idGenerator.generate()
    
            const date: Date = new Date()
    
            const playlist = new Playlist(
                id,
                title,
                subtitle,
                date,
                userId,
                image
            )
    
            await this.playlistDatabase.createPlaylist(playlist)
    
            return playlist 
        }
        catch(error) {
            if (error.message === "invalid signature" || 
                error.message === "jwt expired" ||
                error.message === "jwt must be provided" ||
                error.message === "jwt malformed") {

                throw new CustomError(404, "Invalid token")

            } else {
                throw new CustomError(error.statusCode || 400, error.message)
            }
        }
    }

       
    async putMusicToPlaylist(token: string, input: musicsPlaylist) {

        try{
            const { musicId, playlistId } = input

            if(!musicId || !playlistId) {
                throw new CustomError(405, "Please fill in all fields")
            }
        
            const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 
        
             if(!verifyToken) {
                throw new CustomError(401, "Unauthorized. Verify token")
            }
    
            const musicsPlaylist: musicsPlaylist = {
                musicId,
                playlistId
            }
                
            await this.playlistDatabase.putMusicToPlaylist(musicsPlaylist )
    
            return musicsPlaylist 
        } catch(error) {
            if (error.message === "invalid signature" || 
                error.message === "jwt expired" ||
                error.message === "jwt must be provided" ||
                error.message === "jwt malformed") {

                throw new CustomError(404, "Invalid token")

            } else {
                throw new CustomError(error.statusCode || 400, error.message)
            }
        }

    }
    
    async getAllPlaylists (token: string) {

        try {
            
            const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 

            if(!verifyToken) {
                throw new CustomError(401, "Unauthorized. Verify token")
            }

            const userId = verifyToken.id

            const result = await this.playlistDatabase.getAllPlaylist(userId)

           const resultFinal =  result.map((details) => {
                return {
                    id: details.id,
                    title: details.title,
                    subtitle: details.subtitle,
                    image: details.image
                }
            })

            return resultFinal 

        } catch (error) {
            if (error.message === "invalid signature" || 
                error.message === "jwt expired" ||
                error.message === "jwt must be provided" ||
                error.message === "jwt malformed") {

                throw new CustomError(404, "Invalid token")

            } else {
                throw new CustomError(error.statusCode || 400, error.message)
            }
        }
    }

    async getPlaylistById (token: string, id: string) {

        try {
            const verifyToken: authenticationData = this.tokenManager.getTokenData(token) 

            if(!verifyToken) {
                throw new CustomError(401, "Unauthorized. Verify token")
            }

            const result = await this.playlistDatabase.getPlaylistById(id)

            return  result 

        } catch (error) {
            if (error.message === "invalid signature" || 
                error.message === "jwt expired" ||
                error.message === "jwt must be provided" ||
                error.message === "jwt malformed") {

                throw new CustomError(404, "Invalid token")

            } else {
                throw new CustomError(error.statusCode || 400, error.message)
            }
        }
    }
}