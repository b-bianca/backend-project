import { format } from "path";
import { genres, Music } from "../business/entities/Music";
import { MusicBusiness } from "../business/MusicBusiness";
import BaseDatabase from "./BaseDatabase";

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


    async getAllMusics(userId: string): Promise<any> {
        try {
           
            const result = await BaseDatabase.connection
                .select("*")
                .from(BaseDatabase.MUSICS_TABLE)
                .where({ user_id: userId })

            const resultGenres = await BaseDatabase.connection.raw(`
                SELECT genre_id, music_id FROM ${BaseDatabase.MUSICS_TABLE}
                JOIN ${BaseDatabase.GENRES_MUSICS_TABLE}
                ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.GENRES_MUSICS_TABLE}.music_id 
                WHERE ${BaseDatabase.MUSICS_TABLE}.user_id = "${userId}"
                `)

            for (let i = 0; i < result.length; i++) {

                result[i].resultGenres = resultGenres[0].filter((genre: any) => {
                    return result[i].id === genre.music_id
                }) //adicionando o resultGenre no result
            }

            const musicResult = result.map((music: any) => {
                const arrayFinal = []

                for(let genre of music.resultGenres) {
                    arrayFinal.push(genre.genre_id)
                }

                return {
                    ...music, 
                    resultGenres: arrayFinal
                }
            })

            return musicResult

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getMusicByProperty (key: string, value: string): Promise<object> {

        try {

        const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.MUSICS_TABLE)
            .where(key, value)

            for (let i = 0; i < result.length; i++){
                const resultGenres = await BaseDatabase.connection.raw(`
                    SELECT * FROM ${BaseDatabase.MUSICS_TABLE} 
                    JOIN ${BaseDatabase.GENRES_MUSICS_TABLE}
                    ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.GENRES_MUSICS_TABLE}.music_id
                    WHERE ${BaseDatabase.MUSICS_TABLE}.id = "${value}"

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
}




