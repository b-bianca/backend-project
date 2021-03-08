/******************** IMPORTS ********************/ 
import express, { Express } from "express"
import cors from "cors"
import { AddressInfo } from "net";
import { userRouter } from "./controller/router/userRouter";
import { musicRouter } from "./controller/router/musicRouter";
import { playlistRouter } from "./controller/router/playlistRouter";


/******************** CONFIG ********************/ 
const app: Express = express()
app.use(express.json())
app.use(cors())


/******************** ROUTES ********************/ 
app.use("/user", userRouter)
app.use("/music", musicRouter)
app.use("/playlist", playlistRouter)

/******************** SERVER INIT ********************/ 
const server = app.listen(process.env.PORT || 3306, () => {
    if (server) {
       const address = server.address() as AddressInfo;
       console.log(`Server running on http://localhost:${address.port}`);
    } else {
       console.error(`Failed to run the server.`)
    }
})