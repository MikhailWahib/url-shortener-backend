import { Router } from "express"
import { handleLogin, handleRegister } from "../controllers/userController"
import { userValidation } from "../controllers/lib"

const router = Router()

router.post("/", userValidation, handleRegister)

router.post("/login", userValidation, handleLogin)

router.get("/logout", (req, res) => {
	res.status(200).json({ message: "logout" })
})

export default router
