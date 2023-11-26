import { Request, Response } from "express"
import { getUrlFromDB, insertUrlToDB } from "../db/lib"
import { validationResult } from "express-validator"

export const handleShortenUrl = async (req: Request, res: Response) => {
	try {
		const { url } = req.body
		const userId = req.userId

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const shortUrlCode = Math.random().toString(36).slice(2, 8)

		const shortUrl = `${req.protocol}://${req.get("host")}/s/${shortUrlCode}`

		// check if the url starts with 'https://'
		let insertedOriginalUrl = url
		if (!insertedOriginalUrl.startsWith("https://")) {
			insertedOriginalUrl = `https://${insertedOriginalUrl}`
		}

		const result = await insertUrlToDB(
			insertedOriginalUrl,
			userId!,
			shortUrlCode
		)

		if (result.rows.length === 0) {
			return res.status(500).json({ error: "Internal server error" })
		}

		res.status(201).json({
			id: result.rows[0].id,
			shortUrl: shortUrl,
			originalUrl: result.rows[0].original_url,
			views: result.rows[0].views,
		})
	} catch (error) {
		console.error(error)
	}
}
