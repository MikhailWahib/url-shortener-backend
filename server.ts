import express, { Router, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

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
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
)
app.use(cookieParser())
app.use(morgan("common"))

// routes
app.use("/api/v1", routes)
app.get("/s/:shortUrl", handleRedirect)

app.get("/health-check", async (req: Request, res: Response) => {
	res.status(200).json({ message: "Hello World!" })
})

// start server
db.connect()
	.then((client) => {
		createUsersTable()
		createUrlsTable()
		client.release()
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
