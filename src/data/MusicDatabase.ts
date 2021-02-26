import { genres, Music } from "../business/entities/Music";
import BaseDatabase from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {
     
    async createMusic (music: Music): Promise<void> {
        try {
             await BaseDatabase.connection
             .insert({
                 id: music.id,
                 title: music.title,
                 author: music.author,
                 date: music.date.toISOString().slice(0,10),
                 file: music.file,
                 album: music.album,
                 user_id: music.userId
             })
             .into(BaseDatabase.MUSICS_TABLE)

             for(let genre of music.genres) {
                 await BaseDatabase.connection
                 .insert({
                   genre: genre, 
                   music_id: music.id 
                 })
                 .into(BaseDatabase.GENRES_MUSICS_TABLE)
             }
            
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)  
        }
    }
}