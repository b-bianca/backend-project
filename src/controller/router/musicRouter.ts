import express from "express"
import { MusicController } from "../MusicController"

export const musicRouter = express.Router()

const musicController = new MusicController()

musicRouter.post("/create", musicController.createMusic)
musicRouter.get("/", musicController.getAllMusics)
musicRouter.get("/search", musicController.getMusicByAuthorTitleOrAlbum)
musicRouter.get("/:id", musicController.getMusicById)
musicRouter.delete("/:id", musicController.deleteMusic)
