import { Playlist } from "../business/entities/Playlist";
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
                image: playlist.image
            })
            .into(BaseDatabase.PLAYLIST_TABLE)

        } catch (error) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
}