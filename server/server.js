require("./config/config")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/", function (req, res) {
	res.json("Hello World")
})
app.post("/", function (req, res) {
	const body = req.body
	const headers = req.headers

	!body.name
		? res.status(400).json({
				ok: false,
				error: "el nombre es requerido",
		  })
		: res.json({
				newuser: body,
				head: headers.supersecrettoken,
		  })
})
app.put("/user/:id", function (req, res) {
	const id = req.params.id
	res.json({
		user: id,
	})
})
app.delete("/", function (req, res) {
	res.json("Hello delete")
})

app.listen(process.env.PORT, () => {
	console.log(`escuchando puerto: ${process.env.PORT}`)
})
