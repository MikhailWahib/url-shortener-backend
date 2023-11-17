import { Router } from "express"
import shortUrlRoutes from "./shortUrlRoutes"
import userRoutes from "./userRoutes"

const router = Router()

router.use("/s", shortUrlRoutes)
router.use("/users", userRoutes)

router.get("/health-check", (req, res) => {
	res.status(200).json({ message: "Hello World!" })
})

export default router
