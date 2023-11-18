import app from "../server"
import request from "supertest"

const username = Math.random().toString(36).slice(2, 10)
const password = Math.random().toString(36).slice(2, 10)
let shortCode: string
let authToken: string

describe("POST /api/v1/users", () => {
	it("Register new user", async () => {
		const response = await request(app).post("/api/v1/users").send({
			username: username,
			password: password,
		})

		expect(response.status).toBe(201)
		expect(response.body.message).toBe("User created successfully")
		expect(response.body.user.id).toBeDefined()
		expect(response.body.user.username).toBeDefined()
	})

	it("Invalid Registration - Missing Username", async () => {
		const response = await request(app).post("/api/v1/users").send({
			password: password,
		})

		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

	it("Invalid Registration - Duplicate Username", async () => {
		const response = await request(app).post("/api/v1/users").send({
			username: "john11",
			password: password,
		})

		expect(response.status).toBe(400)
		expect(response.body.error).toBeDefined()
	})

	it("Login user", async () => {
		const response = await request(app).post("/api/v1/users/login").send({
			username: username,
			password: password,
		})

		authToken = response.headers["set-cookie"]

		expect(response.status).toBe(200)
		expect(response.body.id).toBeDefined()
		expect(response.body.username).toBeDefined()
		expect(response.headers["set-cookie"]).toBeDefined()
	})

	it("Invalid Login - Wrong Password", async () => {
		const response = await request(app).post("/api/v1/users/login").send({
			username: username,
			password: "wrongPassword",
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBeDefined()
	})

	it("Logout user", async () => {
		const response = await request(app).post("/api/v1/users/logout")

		expect(response.status).toBe(200)
		expect(response.body.message).toBeDefined()
	})
})

describe("POST /api/v1/shorten", () => {
	it("URL shorten", async () => {
		const response = await request(app)
			.post("/api/v1/shorten")
			.send({
				url: "https://www.google.com",
			})
			.set("Cookie", authToken)

		expect(response.status).toBe(201)
		expect(response.body.id).toBeDefined()
		expect(response.body.shortUrl).toBeDefined()

		shortCode = response.body.shortUrl.split("/s/")[1]
	})

	it("Invalid URL Shortening - Missing URL", async () => {
		const response = await request(app)
			.post("/api/v1/shorten")
			.send({})
			.set("Cookie", authToken)

		expect(response.status).toBe(400)
		expect(response.body.errors).toBeDefined()
	})

	it("Invalid URL Shortening - Unauthorized", async () => {
		const response = await request(app).post("/api/v1/shorten").send({
			url: "https://www.example.com",
		})

		expect(response.status).toBe(401)
		expect(response.body.error).toBeDefined()
	})
})

describe("GET /s/{shortCode}", () => {
	it("Redirect to the original URL", async () => {
		const response = await request(app).get("/s/" + shortCode)

		expect(response.status).toBe(302)
		expect(response.headers.location).toBe("https://www.google.com")
	})
})

describe("GET /api/v1/urls", () => {
	it("Get user's short urls", async () => {
		const response = await request(app)
			.get("/api/v1/users/urls")
			.set("Cookie", authToken)

		expect(response.status).toBe(200)
		expect(response.body.urls).toBeDefined()
	})
})
