import express, { Router, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { logger } from "./middlewares/logger"

import routes from "./routes"

import { db } from "./db"
import { createUrlsTable, createUsersTable } from "./db/lib"

import { handleRedirect } from "./controllers/urlRedirectController"

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(logger)

// routes
app.use("/api/v1", routes)
app.get("/s/:shortUrl", handleRedirect)

app.get("/health-check", async (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello World!" })
})

// start server
db.connect()
	.then(() => {
		console.log("Database connected ✔")
		// createUsersTable()
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
