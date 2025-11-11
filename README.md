# Timestamp Microservice

This is the boilerplate code for the Timestamp Microservice project. Instructions for building your project can be found at https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/timestamp-microservice

## API Endpoints

GET /api/:date?

- If `:date` is empty, returns the current time:

	{
		"unix": 1451001600000,
		"utc": "Fri, 25 Dec 2015 00:00:00 GMT"
	}

- If `:date` is a valid date string or a unix timestamp (milliseconds), returns the corresponding time.

- If `:date` is invalid, returns:

	{ "error": "Invalid Date" }

Examples:

GET /api/1451001600000

Response:

```json
{ "unix": 1451001600000, "utc": "Fri, 25 Dec 2015 00:00:00 GMT" }
```

GET /api/2015-12-25

Response:

```json
{ "unix": 1451001600000, "utc": "Fri, 25 Dec 2015 00:00:00 GMT" }
```

## Exercise Tracker

POST /api/users
- Create a user with form field `username`.

Response:

```json
{ "username": "fcc_test", "_id": "1" }
```

GET /api/users
- Returns an array of users.

POST /api/users/:_id/exercises
- Add exercise with form fields `description` (string), `duration` (number), and optional `date` (yyyy-mm-dd). If `date` omitted, uses current date.

Response:

```json
{
	"username": "fcc_test",
	"description": "test",
	"duration": 60,
	"date": "Mon Jan 01 1990",
	"_id": "1"
}
```

GET /api/users/:_id/logs
- Returns the user's exercise log. Optional query parameters: `from`, `to` (yyyy-mm-dd), and `limit` (integer).

Response:

```json
{
	"username": "fcc_test",
	"count": 1,
	"_id": "1",
	"log": [
		{ "description": "test", "duration": 60, "date": "Mon Jan 01 1990" }
	]
}
```


