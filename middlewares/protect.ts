import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

declare global {
	namespace Express {
		interface Request {
			userId?: number
		}
	}
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
	const jwtSecretKey = process.env.JWT_SECRET!

	try {
		const token = req.cookies.jwt

		if (!token) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		const decoded: any = jwt.verify(token, jwtSecretKey)

		req.userId = decoded.id

		next()
	} catch (error) {
		console.error(error)
		return res.status(401).json({ error: "Invalid token" })
	}
}
