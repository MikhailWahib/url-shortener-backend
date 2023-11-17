import { Router } from "express"
import {
	handleLogin,
	handleRegister,
	handleLogout,
} from "../controllers/userController"
import { userValidation } from "../controllers/lib"

const router = Router()

router.post("/", userValidation, handleRegister)

router.post("/login", userValidation, handleLogin)

router.post("/logout", handleLogout)

export default router
