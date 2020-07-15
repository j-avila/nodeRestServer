const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/schemas")

app.post("/login", function (req, res) {
	const body = req.body

	User.findOne({ email: body.email }, (err, userDB) => {
		if (err) {
			return res.status(500).json({ ok: false, err })
		}
		if (!userDB) {
			return res.status(400).json({ ok: false, message: "usuario incorrecto" })
		}
		if (!bcrypt.compareSync(body.password, userDB.password)) {
			return res.status(400).json({ ok: false, message: "password incorrecto" })
		}

		const token = jwt.sign(
			{
				user: userDB,
			},
			process.env.USER_SECRET,
			{ expiresIn: process.env.TOKEN_EXPIRES }
		)

		res.json({
			ok: true,
			user: userDB,
			token,
		})
	})
})

module.exports = app
