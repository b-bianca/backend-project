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
             
            
            //  const result = await BaseDatabase.connection.raw(`   
            //  SELECT lpm.id as LPM_ID,  lp.id as LP_ID, lp.title as LP_TITLE, lm.id as LM_ID, lm.title as LM_TITLE, lm.author, lm.file, lm.album
            //  FROM ${BaseDatabase.PLAYLIST_MUSICS_TABLE}  lpm
            //  INNER JOIN ${BaseDatabase.PLAYLIST_TABLE}  lp
            //  ON lpm.playlist_id = lp.id
            //  INNER JOIN ${BaseDatabase.MUSICS_TABLE}  lm
            //  ON lpm.music_id = ml.id
            //  WHERE lpm.playlist_id = ${playlist_id}
            // `)

        
            const res = await BaseDatabase.connection
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

            
            
            //  SELECT lpm.id as LPM_ID,  lp.id as LP_ID, lp.title as LP_TITLE, lm.id as LM_ID, lm.title as LM_TITLE, lm.author, lm.file, lm.album FROM lamusic_playlist_musics as lpm
            //  INNER JOIN lamusic_playlist as lp
            //  ON lpm.playlist_id = lp.id
            //  INNER JOIN lamusic_musics lm
            //  ON lpm.music_id = lm.id
            //  WHERE lpm.playlist_id = 'ae767a47-b367-4913-a512-5bffdff1e924';
             
                // .select("*")
                // .from(BaseDatabase.PLAYLIST_MUSICS_TABLE)
                // .where({playlist_id: playlistId})

                // for (let i = 0; i < result.length; i++){
                //     const musics = await BaseDatabase.connection.raw(`
                //     SELECT * FROM ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.as  ("PLM")
                //     JOIN ${BaseDatabase.PLAYLIST_TABLE}
                //     ON ${BaseDatabase.PLAYLIST_TABLE}.id = ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.playlist_id
                //     JOIN ${BaseDatabase.MUSICS_TABLE}
                //     ON ${BaseDatabase.MUSICS_TABLE}.id = ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.music_id
                //     WHERE ${BaseDatabase.PLAYLIST_MUSICS_TABLE}.playlist_id = ${playlistId}
                //     `)
                    
                    // const musicsMap = musics[0].map((music: any) => {
                    //     return(
                    //             {
                    //             id: music.id,
                    //             title:music.title,
                    //             author: music.author,
                    //             file: music.file,
                    //             album: music.album
                    //             }
                    //         ) 
                    // })
    
                    // result[i].musics = musicsMap
                //}    
               
            return res

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