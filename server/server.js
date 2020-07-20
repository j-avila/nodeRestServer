require("./config/config")
const express = require("express")
const mongoose = require("mongoose")
const path = require("path")

const app = express()
const bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.resolve(__dirname, "../public")))
app.use(require("./routes/users"))
app.use(require("./routes/login"))
app.use(require("./routes/categories"))
app.use(require("./routes/products"))

// db connection
mongoose.connect(
	process.env.URLDB,
	{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
	(err, res) => {
		if (err) throw err
		console.log("connected to database")
	}
)

app.listen(process.env.PORT, () => {
	console.log(`escuchando puerto: ${process.env.PORT}`)
})
