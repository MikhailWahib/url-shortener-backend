import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { signToken } from "../lib/signToken"
import { getUserFromDB, getUserUrlsFromDB, insertUserToDB } from "../db/lib"
import bcrypt from "bcrypt"

export const handleRegister = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { result, isUsernameTaken } = await insertUserToDB(username, password)

		if (isUsernameTaken) {
			return res.status(400).json({ error: "Username already taken" })
		}

		res.status(201).json({
			message: "User created successfully",
			user: {
				id: result?.rows[0].id,
				username: result?.rows[0].username,
			},
		})
	} catch (error) {
		console.error(error)
	}
}

export const handleLogin = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body

		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const result = await getUserFromDB(username, password)

		if (result.rows.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const hashedPassword = result.rows[0].password

		const isPasswordValid = await bcrypt.compare(password, hashedPassword)

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const user = result.rows[0]

		// Generate JWT token and send it to the client's cookie
		signToken(user, res)

		res.status(200).json({
			id: user.id,
			username: user.username,
		})
	} catch (error) {
		console.error(error)
	}
}

export const handleLogout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("jwt")
		res.status(200).json({ message: "logged out" })
	} catch (error) {
		console.error(error)
	}
}

export const getUserUrls = async (req: Request, res: Response) => {
	try {
		const userId = req.userId

		const result = await getUserUrlsFromDB(userId)

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "No URLs found" })
		}

		const modifiedUrls = result.rows.map((url) => {
			return {
				id: url.id,
				originalUrl: url.originalUrl,
				shortUrl: `${req.protocol}://${req.get("host")}/s/${url.shortUrl}`,
				clicks: url.clicks,
			}
		})

		res.status(200).json({
			urls: modifiedUrls,
		})
	} catch (e) {
		console.error(e)
	}
}
