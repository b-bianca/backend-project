import express from "express"
import { MusicController } from "../MusicController"


export const musicRouter = express.Router()

const musicController = new MusicController()

musicRouter.post("/create", musicController.createMusic)
musicRouter.get("/", musicController.getAllMusics)
musicRouter.get("/search", musicController.getMusicByAuthorOrTitle)
musicRouter.get("/:id", musicController.getMusicById)
