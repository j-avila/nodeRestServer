const express = require("express")
const app = express()
const _ = require("underscore")
const Category = require("../models/category")
const { tokenAuth, roleAuth } = require("../middlewares/auth")

app.get("/categories", tokenAuth, (req, res) => {
	const from = Number(req.query.from) || 0
	const limit = Number(req.query.limit) || 0

	Category.find({ active: true }, "name active")
		.skip(from)
		.limit(limit)
		.exec((err, categories) => {
			err && res.status(400).json({ ok: false, err })

			Category.countDocuments({ active: true }, (err, count) => {
				res.json({
					ok: true,
					categories,
					count,
				})
			})
		})
})

app.post("/categories", [tokenAuth, roleAuth], function (req, res) {
	const body = req.body
	// const headers = req.headers

	const category = new Category({
		name: body.name,
	})

	category.save((err, dbRes) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}

		res.json({
			category: dbRes,
		})
	})
})

app.put("/categories/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id
	const body = _.pick(req.body, ["name", "active"])

	Category.findByIdAndUpdate(id, body, { new: true }, (err, dbUser) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}

		res.json({
			ok: true,
			categories: dbUser,
		})
	})
})

app.delete("/categories/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id

	Category.findByIdAndDelete(id, (err, catDeleted) => {
		err && res.status(400).json({ ok: false, err })
		!catDeleted &&
			res.status(400).json({ ok: false, err: "Usuario no encontrado" })
		res.json({
			ok: true,
			catDeleted,
		})
	})
})

module.exports = app
