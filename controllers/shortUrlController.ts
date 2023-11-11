import { Request, Response, query } from "express"
import { db } from "../db"
import { getUrlFromDB, insertUrlToDB } from "../db/lib"

export const handleShortenUrl = async (req: Request, res: Response) => {
	try {
		const { url } = req.body

		if (!url) {
			return res.status(400).json({ error: "Please enter a valid URL" })
		}

		const { id, url: original_url, shortUrl } = await insertUrlToDB(url, req)

		res.status(201).json({
			id,
			original_url,
			shortUrl,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const handleRedirect = async (req: Request, res: Response) => {
	try {
		const { shortUrl } = req.params

		if (!shortUrl) {
			return res.status(404).json({ error: "Short URL not found" })
		}

		const url = await getUrlFromDB(shortUrl)

		res.redirect(url)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}
