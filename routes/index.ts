import { Router } from "express"
import shortUrlRoutes from "./shortUrlRoutes"

const router = Router()

router.use("/s", shortUrlRoutes)

router.get("/health-check", (req, res) => {
	res.status(200).json({ message: "Hello World!" })
})

export default router
