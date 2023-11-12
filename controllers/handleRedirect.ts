import { Request, Response } from "express"
import { getUrlFromDB } from "../db/lib"

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

		res.redirect(result.rows[0].url)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}
