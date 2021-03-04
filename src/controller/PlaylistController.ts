import { Request, Response } from "express"
import { createPlaylistInput, musicsPlaylist } from "../business/entities/Playlist"
import { PlaylistBusiness } from "../business/PlaylistBusiness"
import { PlaylistDatabase } from "../data/PlaylistDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

const playlistBusiness = new PlaylistBusiness(
    new IdGenerator(), 
    new TokenManager(),
    new PlaylistDatabase()
)

export class PlaylistControler {

    async create(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const input: createPlaylistInput = {
                title: req.body.title,
                subtitle: req.body.subtitle,
                image: req.body.image
            }

            const playlist = await playlistBusiness.createPlaylist(token, input)

            res.status(201).send({ message: "Playlist created successfully!", playlist })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async putMusicToPlaylist(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const input: musicsPlaylist = {
                musicId: req.body.musicId,
                playlistId: req.body.playlistId
            }

            await playlistBusiness.putMusicToPlaylist(token, input)

            res.status(201).send({ message: "Music included in the playlist" })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getAllPlaylists(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const playlist = await playlistBusiness.getAllPlaylists(token)

            res.status(201).send({ message: "All playlists", playlist })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getPlaylistByTitle(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const title = req.query.title as string 

            const result = await playlistBusiness.getPlaylistByTitle(token, title)

            res.status(201).send({ message: "Selected playlist", result })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getMusicsByPlaylistId(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const id = req.params.id as string

            const playlist = await playlistBusiness.getMusicsByPlaylistId(token, id)

            res.status(201).send({ message: "All musics", playlist })
        } catch (error) {
            
        }
    }

    async deletePlaylist(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const id: string = req.params.id as string 

            await playlistBusiness.deletePlaylist(token, id)

            res.status(201).send({ message: "Playlist successfully deleted", id })
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }
}