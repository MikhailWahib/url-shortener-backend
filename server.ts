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
app.get("/", (req: Request, res: Response) => {
	res.send(
		"Visit the API Repository for the documentation: https://github.com/MikhaiWahib/url-shortener-backend"
	)
})
app.use("/api/v1", routes)
app.get("/s/:shortUrl", handleRedirect)

// start server
db.connect()
	.then((client) => {
		createUsersTable()
		createUrlsTable()
		client.release()
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`⚡️[server]: Server is running at port ${port}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})

export default app
