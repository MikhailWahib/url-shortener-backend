import { db } from "../../db"
import app from "../../server"
import request from "supertest"

let shortCode: string

describe("Short Url Router", () => {
	it("should create a short url", async () => {
		const response = await request(app).post("/s/shorten").send({
			url: "https://www.google.com",
		})

		expect(response.status).toBe(201)
		expect(response.body.id).toBeDefined()
		expect(response.body.shortUrl).toBeDefined()

		shortCode = response.body.shortUrl.split("/s/")[1]
	})

	it("should redirect to the original url", async () => {
		const response = await request(app).get("/s/" + shortCode)

		expect(response.status).toBe(302)
		expect(response.headers.location).toBe("https://www.google.com")
	})
})
