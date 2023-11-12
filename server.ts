import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { logger } from "./middlewares/logger"

import routes from "./routes"

import { db } from "./db"
import { createUrlsTable } from "./db/lib"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(logger)

// routes
app.use(routes)

db.connect()
	.then(() => {
		console.log("Database connected")
		// createUrlsTable()
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})

export default app
