import app from "../../server"
import request from "supertest"

let shortCode: string

describe("/api/v1/shorten", () => {
	it("URL shorten", async () => {
		const response = await request(app).post("/api/v1/shorten").send({
			url: "https://www.google.com",
		})

		expect(response.status).toBe(201)
		expect(response.body.id).toBeDefined()
		expect(response.body.shortUrl).toBeDefined()

		shortCode = response.body.shortUrl.split("/s/")[1]
	})
})

describe("GET /s/{shortCode}", () => {
	it("Redirect to the original URL", async () => {
		const response = await request(app).get("/s/" + shortCode)

		expect(response.status).toBe(302)
		expect(response.headers.location).toBe("https://www.google.com")
	})
})
