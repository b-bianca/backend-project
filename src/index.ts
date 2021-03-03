/******************** IMPORTS ********************/ 
import express, { Express } from "express"
import cors from "cors"
import { AddressInfo } from "net";
import { userRouter } from "./controller/router/userRouter";
import { musicRouter } from "./controller/router/musicRouter";


/******************** CONFIG ********************/ 
const app: Express = express()
app.use(express.json())
app.use(cors())


/******************** ROUTES ********************/ 
app.use("/user", userRouter)
app.use("/music", musicRouter)

/******************** SERVER INIT ********************/ 
const server = app.listen(3003, () => {
    if (server) {
       const address = server.address() as AddressInfo;
       console.log(`Server running on http://localhost:${address.port}`);
    } else {
       console.error(`Failed to run the server.`)
    }
})