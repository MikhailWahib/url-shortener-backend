import { Router } from "express"
import {
	handleLogin,
	handleRegister,
	handleLogout,
	getUserUrls,
} from "../controllers/userController"
import { userValidation } from "../controllers/lib"
import { protect } from "../middlewares/protect"

const router = Router()

router.post("/", userValidation, handleRegister)

router.post("/login", userValidation, handleLogin)

router.post("/logout", handleLogout)

router.get("/urls", protect, getUserUrls)

export default router
