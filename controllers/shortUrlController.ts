import { Request, Response } from "express"
import { getUrlFromDB, insertUrlToDB } from "../db/lib"
import { validationResult } from "express-validator"

export const handleShortenUrl = async (req: Request, res: Response) => {
	try {
		const { url } = req.body

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const result = await insertUrlToDB(url)

		if (result.rows.length === 0) {
			return res.status(500).json({ error: "Internal server error" })
		}

		res.status(201).json({
			id: result.rows[0].id,
			shortUrl: `${req.protocol}://${req.get("host")}/s/${
				result.rows[0].short_url
			}`,
			originalUrl: result.rows[0].original_url,
		})
	} catch (error) {
		console.error(error)
	}
}

export const handleRedirect = async (req: Request, res: Response) => {
	try {
		const { shortUrl } = req.params

		if (!shortUrl) {
			return res.status(404).json({ error: "Short URL not found" })
		}

		const result = await getUrlFromDB(shortUrl)

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Short URL not found" })
		}

		res.redirect(result.rows[0].original_url)
	} catch (error) {
		console.error(error)
	}
}
