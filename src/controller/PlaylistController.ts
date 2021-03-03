import { Request, Response } from "express"
import { createPlaylistInput } from "../business/entities/Playlist"
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
}