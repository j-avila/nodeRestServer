const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const _ = require("underscore")
const User = require("../models/user")
const { tokenAuth, roleAuth } = require("../middlewares/auth")

app.get("/users", tokenAuth, (req, res) => {
	const from = Number(req.query.from) || 0
	const limit = Number(req.query.limit) || 0

	User.find({ state: true }, "name email img role state google")
		.skip(from)
		.limit(limit)
		.exec((err, users) => {
			err && res.status(400).json({ ok: false, err })

			User.countDocuments({ state: true }, (err, count) => {
				res.json({
					ok: true,
					users,
					count,
				})
			})
		})
})

app.post("/user", [tokenAuth, roleAuth], function (req, res) {
	const body = req.body
	// const headers = req.headers

	const user = new User({
		name: body.name,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role,
	})

	user.save((err, dbRes) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}

		res.json({
			user: dbRes,
		})
	})
})

app.put("/user/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id
	const body = _.pick(req.body, ["name", "email", "img", "role", "state"])

	User.findByIdAndUpdate(id, body, { new: true }, (err, dbUser) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}

		res.json({
			ok: true,
			user: dbUser,
		})
	})
})

app.delete("/user/remove/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id
	const body = _.pick(req.body, ["state"])

	User.findByIdAndUpdate(id, body, { new: true }, (err, dbUser) => {
		err && res.status(400).json({ ok: false, err })

		res.json({
			ok: true,
			user: dbUser,
		})
	})
})

app.delete("/user/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id

	User.findByIdAndDelete(id, (err, userDeleted) => {
		err && res.status(400).json({ ok: false, err })
		!userDeleted &&
			res.status(400).json({ ok: false, err: "Usuario no encontrado" })
		res.json({
			ok: true,
			userDeleted,
		})
	})
})

module.exports = app
