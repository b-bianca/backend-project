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

    async getAllMusics(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const result = await musicBusiness.getAllMusics(token)

            res.status(201).send({ message: "All musics", result })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getMusicById(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const IdMusic: string = req.params.id as string 

            const result = await musicBusiness.getMusicById(token, IdMusic)

            res.status(201).send({ message: "Selected music", result })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getMusicByAuthorTitleOrAlbum(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const title = req.query.title as string

            const author = req.query.author as string

            const album = req.query.album as string
            
            const result = await musicBusiness.getMusicByAuthorTitleOrAlbum(token, title, author, album)

            res.status(201).send({ message: "Selected music", result })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async deleteMusic(req: Request, res: Response) {

        try {
            const token: string = req.headers.authorization!

            const id: string = req.params.id as string 

            await musicBusiness.deleteMusic(token, id)

            res.status(201).send({ message: "Music successfully deleted", id })
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }

    async getAllGenres(req: Request, res: Response) {

        try {

            const token: string = req.headers.authorization!

            const result = await musicBusiness.getAllGenres(token)

            res.status(201).send({ message: "All genres", result })
            
        } catch (error) {
            res.status(error.statusCode || 400).send({ error: error.message })
        }
    }
}