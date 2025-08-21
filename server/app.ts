import 'dotenv/config'
import express, {Express, Request, Response} from "express"
import {MongoClient} from "mongodb"

const app: Express = express()

import cors from 'cors'
app.use(cors())
app.use(express.json())