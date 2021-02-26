import { Request, Response } from "express"
import { createMusicInput } from "../business/entities/Music"
import { MusicBusiness } from "../business/MusicBusiness"
import { MusicDatabase } from "../data/MusicDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"


const musicBusiness = new MusicBusiness(
    new IdGenerator(), 
    new TokenManager(),
    new MusicDatabase()
)

export class MusicController {

    async createMusic(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const input: createMusicInput = {
                title: req.body.title,
                author: req.body.author,
                file: req.body.file,
                album: req.body.album,
                genres: req.body.genres
            }

            const music = await musicBusiness.createMusic(token, input)

            res.status(201).send({ message: "Music created successfully!", music })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }
}