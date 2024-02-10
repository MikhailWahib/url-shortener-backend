import { createUrlsTable, createUsersTable } from "../db/lib"
export const startServer = async (server: any, db: any, port: number) => {
	try {
		await db.connect()
		console.log("Connected to database")

		createUrlsTable()
		createUsersTable()

		server.listen(port, () => {
			console.log(`Server running on port ${port}`)
		})
	} catch (error) {
		console.error(error)
	}
}
