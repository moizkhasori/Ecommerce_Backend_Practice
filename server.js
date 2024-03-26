import app from "./app.js";
import { connectMongoDb } from "./config/ConnectMongoDb.js";
import dotenv from "dotenv"

//config
dotenv.config({
    path:"config/config.env"
})

connectMongoDb()

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
})
