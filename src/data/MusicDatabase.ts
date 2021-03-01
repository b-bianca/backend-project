import { format } from "path";
import { genres, Music } from "../business/entities/Music";
import { MusicBusiness } from "../business/MusicBusiness";
import BaseDatabase from "./BaseDatabase";

export class MusicDatabase extends BaseDatabase {

    private static toMusicModel(music: any) {
        return music && new Music(
            music.id,
            music.title,
            music.author,
            music.date,
            music.file,
            music.album,
            music.user_id,
            music.genres
        )
    }

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
                        genre: genre,
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
                SELECT genre, music_id FROM ${BaseDatabase.MUSICS_TABLE}
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

                for(let genreInfo of music.resultGenres) {
                    arrayFinal.push(genreInfo.genre)
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

    async getMusicById (id: string): Promise<object> {

        try {

        const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.MUSICS_TABLE)
            .where({ id })

        const resultGenres = await BaseDatabase.connection.raw(`
            SELECT genre, music_id FROM ${BaseDatabase.MUSICS_TABLE}
            JOIN ${BaseDatabase.GENRES_MUSICS_TABLE}
            ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.GENRES_MUSICS_TABLE}.music_id 
            WHERE ${BaseDatabase.MUSICS_TABLE}.id = "${id}"
            `)

        for (let i = 0; i < result.length; i++) {

            result[i].resultGenres = resultGenres[0].filter((genre: any) => {
                return result[i].id === genre.music_id
            }) //adicionando o resultGenre no result
        }

        const musicResult = result.map((music: any) => {
            const arrayFinal = []

            for(let genreInfo of music.resultGenres) {
                arrayFinal.push(genreInfo.genre)
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
}




