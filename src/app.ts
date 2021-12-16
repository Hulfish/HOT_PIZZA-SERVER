const cors = require("cors")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
import path from "path"
import express from "express";
import { config } from "dotenv"
import { connect, ConnectOptions, Mongoose, MongooseOptions } from "mongoose";

import { ErrorMiddleware } from './middlewares/error_middleware';
import { product_router } from './routers/product_router';
import { auth_router }  from './routers/auth_router';
import { delete_router } from "./routers/delete_router";

config({path: (__dirname + "/.env")})

const app = express()
const mongo_client = new Mongoose()
const PORT = process.env.PORT || 5000
const DB_URL = "mongodb+srv://qwerty:qwerty123@cluster0.1svn0.mongodb.net/stepa?authSource=admin&replicaSet=atlas-ovcj50-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"

app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.static(path.resolve(__dirname, "..", "src", "static", "images")))
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))
app.use("/", (req, res, next) => {
    console.log("request")
    next()
})

app.use("/api/auth", auth_router)
app.use("/api/delete", delete_router)
app.use("/api/product", product_router )

if (process.env.NODE_ENV === "PROD") {
    console.log("production")
    console.log(__dirname)
    app.use("/", express.static(path.join(__dirname, "..", "..", "client", "build")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"))
    })
}

app.use(ErrorMiddleware)

async function start () {
    try {
        await connect(DB_URL)
        console.log('connected');
        app.listen(PORT, () => {
        console.log("app is listening on port " + PORT)
})
    } catch (e) {
        console.log(e)
    }
}

start()