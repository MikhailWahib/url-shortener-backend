import { db } from ".."

export const createUrlsTable = async () => {
	const query = `
        CREATE TABLE IF NOT EXISTS urls (
            id SERIAL PRIMARY KEY,
            url TEXT NOT NULL,
            short_url TEXT NOT NULL UNIQUE
        );
    `
	await db.query(query)
	console.log(await db.query(query))
	console.log("URLs Table created")
}

export const insertUrlToDB = async (url: string, req?: any) => {
	const shortUrl = Math.random().toString(36).substring(2, 8)

	// check if the url starts with 'https://'
	let insertedUrl = url
	if (!insertedUrl.startsWith("https://")) {
		insertedUrl = `https://${insertedUrl}`
	}

	const query = `INSERT INTO urls (url, short_url) VALUES ($1, $2) RETURNING *;`

	// insert url - with 'https://' - and short url
	const result = await db.query(query, [insertedUrl, shortUrl])

	return {
		id: result.rows[0].id,
		url: result.rows[0].url,
		// send current domain name with the shortened url
		shortUrl: `${req.protocol}://${req.get("host")}/s/${
			result.rows[0].short_url
		}`,
	}
}

export const getUrlFromDB = async (shortUrl: string) => {
	const query = `SELECT url FROM urls WHERE short_url = $1;`
	const result = await db.query(query, [shortUrl])
	const url = result.rows[0].url

	return url
}
