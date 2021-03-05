import { musicsPlaylist, musicsPlaylistInput, Playlist } from "../business/entities/Playlist";
import BaseDatabase from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {

    async createPlaylist(playlist: Playlist): Promise<void> {

        try {
            await BaseDatabase.connection
            .insert({
                id: playlist.id,
                title: playlist.title,
                subtitle: playlist.subtitle,
                date: playlist.date,
                user_id: playlist.userId,
                image: playlist.image
            })
            .into(BaseDatabase.PLAYLIST_TABLE)

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async putMusicToPlaylist(musics: musicsPlaylistInput): Promise<void> {

        try {
            await BaseDatabase.connection
            .insert({
                id: musics.id,
                music_id: musics.musicId,
                playlist_id: musics.playlistId
            })
            .into(BaseDatabase.PLAYLIST_MUSICS_TABLE)

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getAllPlaylist(userId: string): Promise<Playlist[]> {
        try {
           
            const result = await BaseDatabase.connection
                .select("*")
                .from(BaseDatabase.PLAYLIST_TABLE)
                .where({ user_id: userId })

                return result

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getPlaylistByTitle (title: string): Promise<Playlist[]> {

        try {

        const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.PLAYLIST_TABLE)
            .where("title", "like" ,`%${title}%`)
            
        return result

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async getMusicsByPlaylistId(playlistId: string): Promise<Playlist[]> {
        try {
           
             const result = await BaseDatabase.connection
                .select("playlist_id")
                .from(BaseDatabase.PLAYLIST_MUSICS_TABLE)
                .where({playlist_id: playlistId})

                for (let i = 0; i < result.length; i++){
                    const musics = await BaseDatabase.connection.raw(`
                        SELECT * FROM ${BaseDatabase.PLAYLIST_TABLE} 
                        JOIN ${BaseDatabase.PLAYLIST_MUSICS_TABLE}
                        ON ${BaseDatabase.PLAYLIST_TABLE}.id = ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.playlist_id
                        JOIN ${BaseDatabase.MUSICS_TABLE}
                        ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.music_id
                        WHERE ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.music_id
                    `)
                    
                    const musicsMap = musics[0].map((music: any) => {
                        return music.title
                    })
    
                    result[i].musics = musicsMap
                }    
               
            return result[0]

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async deletePlaylist(id: string): Promise<any> {

        try {
            await BaseDatabase.connection
            .delete()
            .from(BaseDatabase.PLAYLIST_TABLE)
            .where({id})
        
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    async deleteMusicFromPlaylist(id: string): Promise<any> {

        try {
           const result =  await BaseDatabase.connection
                       .delete()
                       .from(BaseDatabase.PLAYLIST_MUSICS_TABLE)
                       .where({id})

                return result
        
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}