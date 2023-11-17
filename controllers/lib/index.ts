import { body } from "express-validator"

export const userValidation = [
	body("username", "Username cannot be empty").notEmpty(),
	body("username", "Username should be longer than 6 characters").isLength({
		min: 6,
	}),
	body("username", "Username must be alphanumeric").isAlphanumeric(),
	body("password", "Password cannot be empty").notEmpty(),
	body("password", "Password should be longer than 6 characters").isLength({
		min: 6,
	}),
]

export const urlValdiation = [
	body("url", "URL cannot be empty").notEmpty(),
	body("url", "Please enter a valid URL").isURL(),
]
