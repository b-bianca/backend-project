import { Music, category } from "../business/entities/Music";
import BaseDatabase from "./BaseDatabase";

export class GenreDatabase extends BaseDatabase {

    async getGenre (result: any) {

        const musics: Music[] = []

            for (let music of result) {

                const categories: category[] = []; 

                const resultGenres = await BaseDatabase.connection.raw(`
                    SELECT genre_id
                    FROM ${BaseDatabase.MUSICS_TABLE}
                    JOIN ${BaseDatabase.GENRES_MUSICS_TABLE}
                    ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.GENRES_MUSICS_TABLE}.music_id 
                    WHERE ${BaseDatabase.MUSICS_TABLE}.id = "${music.id}"            
                `)
                for (let gen of resultGenres[0]) {
                    categories.push(gen.genre_id)
                }
                musics.push({
                    id: music.id,
                    title: music.title,
                    author: music.author,
                    date: music.date,
                    file: music.file,
                    album: music.album,
                    userId: music.userId,
                    genres: categories
                });
            }
            return musics
    }
}