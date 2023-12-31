import { QueryResult } from "pg"
import { db } from ".."
import bcrypt from "bcrypt"

export const createUrlsTable = async (): Promise<void> => {
	const query = `
        CREATE TABLE IF NOT EXISTS urls (
            id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id),
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL UNIQUE,
			clicks INTEGER DEFAULT 0
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

export const insertUrlToDB = async (
	originalUrl: string,
	userId: number,
	shortUrlCode: string
) => {
	const query = `INSERT INTO urls (original_url, user_id,short_url) VALUES ($1, $2, $3) RETURNING *;`

	// insert url - with 'https://' - and short url
	const result = await db.query(query, [originalUrl, userId, shortUrlCode])

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

	const salt = await bcrypt.genSalt()
	const hashedPassword = await bcrypt.hash(password, salt)

	const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`
	const result = await db.query(query, [username, hashedPassword])

	return {
		result,
		isUsernameTaken: false,
	}
}

export const getUserFromDB = async (username: string, password: string) => {
	const query = `SELECT * FROM users WHERE username = $1;`
	const result = await db.query(query, [username])
	return result
}

export const getUserUrlsFromDB = async (userId: number | undefined) => {
	const query = `SELECT id, original_url AS "originalUrl", short_url AS "shortUrl", clicks FROM urls WHERE user_id = $1 ORDER BY id DESC;`
	const result = await db.query(query, [userId])
	return result
}

export const incrementUrlClicks = async (shortUrlCode: string) => {
	const query = `UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1 RETURNING *;`
	await db.query(query, [shortUrlCode])
}
