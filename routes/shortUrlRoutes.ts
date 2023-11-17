import { Router } from "express"
import { handleShortenUrl } from "../controllers/shortUrlController"
import { handleRedirect } from "../controllers/shortUrlController"
import { urlValdiation } from "../controllers/lib"

const router = Router()

router.post("/shorten", urlValdiation, handleShortenUrl)
router.get("/:shortUrl", handleRedirect)

export default router
