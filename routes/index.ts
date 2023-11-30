import { Router, Request, Response } from "express"
import userRoutes from "./userRoutes"
import { handleShortenUrl } from "../controllers/shortUrlController"
import { urlValdiation } from "../controllers/lib"
import { protect } from "../middlewares/protect"

const router = Router()

router.use("/users", userRoutes)

router.post("/shorten", urlValdiation, protect, handleShortenUrl)

router.get("/", protect, async (req: Request, res: Response) => {
	res.send("Hello World!")
})

export default router
