import { Router, Request, Response } from "express"
import userRoutes from "./userRoutes"
import { handleShortenUrl } from "../controllers/shortUrlController"
import { urlValdiation } from "../controllers/lib"

const router = Router()

router.post("/shorten", urlValdiation, handleShortenUrl)

router.use("/users", userRoutes)

router.get("/", async (req: Request, res: Response) => {
	res.send("Hello World!")
})

export default router
