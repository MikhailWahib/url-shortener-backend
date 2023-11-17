import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { insertUserToDB } from "../db/lib"

const handleRegister = async (req: Request, res: Response) => {
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

const handleLogin = async (req: Request, res: Response) => {
	// TODO
}

export { handleRegister, handleLogin }
