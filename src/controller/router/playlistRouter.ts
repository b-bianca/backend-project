import express from "express"
import { PlaylistControler } from "../PlaylistController"

export const playlistRouter = express.Router()

const playlistController = new PlaylistControler()

playlistRouter.put("/create", playlistController.create)
playlistRouter.put("/insert", playlistController.putMusicToPlaylist)
playlistRouter.get("/", playlistController.getAllPlaylists)
playlistRouter.get("/:id", playlistController.getPlaylistById)