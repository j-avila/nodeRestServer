const express = require("express")
const app = express()
const _ = require("underscore")
const Category = require("../models/category")
const { tokenAuth, roleAuth } = require("../middlewares/auth")

app.get("/categories", tokenAuth, (req, res) => {
	const from = Number(req.query.from) || 0
	const limit = Number(req.query.limit) || 0

	Category.find({})
		.sort("name")
		.populate("createdBy", "name email")
		.exec((err, categories) => {
			if (err) {
				return res.status(400).json({ ok: false, err })
			}

			Category.countDocuments({ active: true }, (err, count) => {
				res.json({
					ok: true,
					categories,
					count,
				})
			})
		})
})

app.get("/categories/:id", tokenAuth, (req, res) => {
	const id = req.params.id
	Category.findById(id, (err, category) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}
		res.json({
			ok: true,
			category,
		})
	})
})

app.post("/categories", [tokenAuth, roleAuth], function (req, res) {
	const body = req.body
	// const headers = req.headers

	const category = new Category({
		name: body.name,
		createdBy: req.user._id,
	})

	category.save([tokenAuth, roleAuth], (err, dbRes) => {
		if (err) {
			return res.status(500).json({ ok: false, err })
		}
		if (!dbRes) {
			return res.status(400).json({
				ok: false,
				err,
			})
		}

		res.json({
			ok: true,
			category: dbRes,
		})
	})
})

app.put("/categories/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id
	const body = _.pick(req.body, ["name", "active"])

	Category.findByIdAndUpdate(
		id,
		body,
		{ new: true, runValidators: true },
		(err, dbUser) => {
			if (err) {
				return res.status(400).json({ ok: false, err })
			}

			res.json({
				ok: true,
				categories: dbUser,
			})
		}
	)
})

app.delete("/categories/:id", [tokenAuth, roleAuth], function (req, res) {
	const id = req.params.id

	Category.findByIdAndDelete(id, (err, catDeleted) => {
		if (err) {
			return res.status(400).json({ ok: false, err })
		}
		if (!catDeleted) {
			return res.status(400).json({ ok: false, err: "Usuario no encontrado" })
		}
		res.json({
			ok: true,
			catDeleted,
		})
	})
})

module.exports = app
