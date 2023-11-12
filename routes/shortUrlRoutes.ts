import { Router } from "express"
import { handleShortenUrl } from "../controllers/shortUrlController"
import { handleRedirect } from "../controllers/handleRedirect"

const router = Router()

router.post("/shorten", handleShortenUrl)
router.get("/:shortUrl", handleRedirect)

export default router
