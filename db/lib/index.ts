import { QueryResult } from "pg"
import { db } from ".."

export const createUrlsTable = async (): Promise<void> => {
	const query = `
        CREATE TABLE IF NOT EXISTS urls (
            id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id),
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL UNIQUE
        );
    `
	await db.query(query)
	console.log("URLs Table created")
}

export const createUsersTable = async (): Promise<void> => {
	const query = `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL	
		);
	`
	await db.query(query)
	console.log("Users Table created")
}

export const insertUrlToDB = async (url: string) => {
	const shortUrl = Math.random().toString(36).substring(2, 8)

	// check if the url starts with 'https://'
	let insertedUrl = url
	if (!insertedUrl.startsWith("https://")) {
		insertedUrl = `https://${insertedUrl}`
	}

	const query = `INSERT INTO urls (original_url, user_id,short_url) VALUES ($1, $2, $3) RETURNING *;`

	// insert url - with 'https://' - and short url
	const result = await db.query(query, [insertedUrl, 1, shortUrl])

	return result
}

export const getUrlFromDB = async (
	shortUrl: string
): Promise<QueryResult<any>> => {
	const query = `SELECT original_url FROM urls WHERE short_url = $1;`
	const result = await db.query(query, [shortUrl])
	return result
}

export const insertUserToDB = async (username: string, password: string) => {
	const exitingUser = await db.query(
		"SELECT * FROM users WHERE username = $1",
		[username]
	)

	if (exitingUser.rows.length > 0) {
		return {
			result: null,
			isUsernameTaken: true,
		}
	}

	const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`
	const result = await db.query(query, [username, password])

	return {
		result,
		isUsernameTaken: false,
	}
}

export const getUserFromDB = async (username: string, password: string) => {
	const query = `SELECT * FROM users WHERE username = $1 AND password = $2;`
	const result = await db.query(query, [username, password])
	return result
}
