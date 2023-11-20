**URL Shortener App Documentation**

**Installation:**

```bash
npm install
```

**Usage:**

```bash
npm run dev # starts dev server
npm run build # builds production
npm run start # starts production server
npm test # runs tests
```

**API Endpoints:**

#### Base URL: https://url-shortener-api-56k6.onrender.com

1. **User Registration:**

   - **Endpoint:** `/api/v1/users`
   - **Method:** `POST`
   - **Request:**
     ```json
     {
     	"username": "string",
     	"password": "string"
     }
     ```
   - **Response:**
     ```json
     {
     	"message": "string",
     	"user": {
     		"id": 1,
     		"username": "string"
     	}
     }
     ```

2. **User Login:**

   - **Endpoint:** `/api/v1/users/login`
   - **Method:** `POST`
   - **Request:**
     ```json
     {
     	"username": "string",
     	"password": "string"
     }
     ```
   - **Response:**

     ```json
     {
     	"message": "string"
     }

     // token sent to user in httpOnly cookie
     ```

3. **User Logout:**

   - **Endpoint:** `/api/v1/users/logout`
   - **Method:** `POST`
   - **Response:**

     ```json
     {
     	"message": "string"
     }

     // clears httpOnly cookie
     ```

4. **Get User's URLs:**

   - **Endpoint:** `/api/v1/users/urls`
   - **Method:** `GET`
   - **Authorization:** `handled by JWT middleware (no need for sending token)`
   - **Response:**
     ```json
     {
     	"urls": [
     		{
     			"id": "number",
     			"originalUrl": "string",
     			"shortUrl": "string"
     		}
     	]
     }
     ```

5. **URL Shortening:**

   - **Endpoint:** `/api/v1/shorten/{url}`
   - **Method:** `POST`
   - **Authorization:** `handled by JWT middleware (no need for sending token)`
   - **Response:**
     ```json
     {
     	"id": "number",
     	"originalUrl": "string",
     	"shortUrl": "string"
     }
     ```

6. **Redirect to Original URL:**
   - **Endpoint:** `/s/{shortcode}`
   - **Method:** `GET`
   - **Response:**
     - Redirects to the original URL associated with the provided shortcode.

**Stack:**

- Node.js
- Express
- TypeScript (TS)
- PostgreSQL
- JSON Web Token (JWT)
- Bcrypt
