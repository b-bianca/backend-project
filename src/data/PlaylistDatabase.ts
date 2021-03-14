import { reduceEachLeadingCommentRange } from "typescript";
import { musicsPlaylistInput, Playlist } from "../business/entities/Playlist";
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

    async getMusicsByPlaylistId(playlist_id: string): Promise<any[]> {
        try {
             
            const result = await BaseDatabase.connection
            .column( {LMP_ID: 'lamusic_playlist_musics.id'},{LP_ID: 'lamusic_playlist.id'}, {LP_TITLE: 'lamusic_playlist.title'}, {LM_ID: 'lamusic_musics.id'}, {LM_TITLE: 'lamusic_musics.title' }, 'lamusic_musics.author', 'lamusic_musics.file', 'lamusic_musics.album')
            .select()
            .from(BaseDatabase.PLAYLIST_MUSICS_TABLE)
            .join(`lamusic_playlist`, function() {
                this.on( 'lamusic_playlist_musics.playlist_id', '=', 'lamusic_playlist.id')
            })
            .join(`lamusic_musics`, function() {
                this.on( 'lamusic_playlist_musics.music_id', '=', 'lamusic_musics.id')
            })
            .where('lamusic_playlist_musics.playlist_id', "=", playlist_id)

            return result

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
           const result = await BaseDatabase.connection
                       .delete()
                       .from(BaseDatabase.PLAYLIST_MUSICS_TABLE)
                       .where({id})

                return result
        
        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}