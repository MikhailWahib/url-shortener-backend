import { Request, Response } from "express"
import { insertUrlToDB } from "../db/lib"

import validator from "validator"

export const handleShortenUrl = async (req: Request, res: Response) => {
	try {
		const { url } = req.body

		if (!validator.isURL(url)) {
			return res.status(400).json({ error: "Please enter a valid URL" })
		}

		if (!url) {
			return res.status(400).json({ error: "Please enter a valid URL" })
		}

		const { id, originalUrl, shortUrl } = await insertUrlToDB(url, req)

		res.status(201).json({
			id,
			originalUrl,
			shortUrl,
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}
