import { Router } from "express"
import {
	handleShortenUrl,
	handleRedirect,
} from "../controllers/shortUrlController"

const router = Router()

router.post("/shorten", handleShortenUrl)
router.get("/:shortUrl", handleRedirect)

export default router
