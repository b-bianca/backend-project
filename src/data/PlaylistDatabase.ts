import { musicsPlaylist, Playlist } from "../business/entities/Playlist";
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

    async putMusicToPlaylist(musics: musicsPlaylist): Promise<void> {

        try {
            await BaseDatabase.connection
            .insert({
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

    async getPlaylistById (id: string): Promise<Playlist> {

        try {

        const result = await BaseDatabase.connection
            .select("*")
            .from(BaseDatabase.PLAYLIST_TABLE)
            .where({id})
            
        return result[0]

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}