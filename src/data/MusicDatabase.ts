import { Music } from "../business/entities/Music";
import BaseDatabase from "./BaseDatabase";
import { GenreDatabase } from "./GenreDatabase";

const getGenre = new GenreDatabase()

export class MusicDatabase extends BaseDatabase {


    async createMusic(music: Music): Promise<void> {
        try {
            await BaseDatabase.connection
                .insert({
                    id: music.id,
                    title: music.title,
                    author: music.author,
                    date: music.date,
                    file: music.file,
                    album: music.album,
                    user_id: music.userId
                })
                .into(BaseDatabase.MUSICS_TABLE)

            for (let genre of music.genres) {
                await BaseDatabase.connection
                    .insert({
                        genre_id: genre,
                        music_id: music.id
                    })
                    .into(BaseDatabase.GENRES_MUSICS_TABLE)
            }

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getAllMusics(userId: string): Promise<Music[]> {
        try {
           
            const result = await BaseDatabase.connection
                .select("*")
                .from(BaseDatabase.MUSICS_TABLE)
                .where({ user_id: userId })

                const resultFinal = getGenre.getGenre(result)

                return resultFinal

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getMusicById (id: string): Promise<Music> {

        try {

        const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.MUSICS_TABLE)
            .where({id})
            
            for (let i = 0; i < result.length; i++){
                const resultGenres = await BaseDatabase.connection.raw(`
                    SELECT * FROM ${BaseDatabase.MUSICS_TABLE} 
                    JOIN ${BaseDatabase.GENRES_MUSICS_TABLE}
                    ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.GENRES_MUSICS_TABLE}.music_id
                    WHERE ${BaseDatabase.MUSICS_TABLE}.id = "${id}"

                `)
                
                const genreMap = resultGenres[0].map((genre: any) => {
                    return genre.genre_id
                })

                result[i].resultGenres = genreMap
            }    
           
        return result[0]

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getMusicByProperty (key: string, value: string): Promise<Music[]> {

        try {
            const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.MUSICS_TABLE)
            .where(key, "like" ,`%${value}%`)

            const resultFinal = getGenre.getGenre(result)

            return resultFinal
                      
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async deleteMusic(id: string): Promise<any> {

        try {
            await BaseDatabase.connection
            .delete()
            .from(BaseDatabase.MUSICS_TABLE)
            .where({id})
        
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}




