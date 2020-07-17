const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/schemas")
// google auth
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.CLIENT_ID)

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

// google validator
const verify = async token => {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	})
	const payload = ticket.getPayload()

	return {
		name: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true,
	}
}

app.post("/google-auth", async (req, res) => {
	const token = req.body.idtoken
	const googleUsr = await verify(token).catch(e => json({ ok: false, err: e }))

	User.findOne({ email: googleUsr.email }, (err, userDB) => {
		if (err) {
			//si ocurre algun error en la consulta a la bdd
			return res.status(500).json({ ok: false, err })
		}
		if (userDB) {
			// verifica que existe un usuario en bdd
			if (userDB.google === false) {
				// verifica si no se registro con google
				return res.status(400).json({
					ok: false,
					err: { message: "debe usar la autenticacion normal" },
				})
			} else {
				// si se registro mediante google
				let token = jwt.sign(
					{
						user: userDB,
					},
					process.env.USER_SECRET,
					{ expiresIn: process.env.TOKEN_EXPIRES }
				)

				return res.json({
					ok: true,
					user: userDB,
					token,
				})
			}
		} else {
			// si no existe en bdd
			let user = new User()
			const { name, email, img } = googleUsr
			user.name = name
			user.email = email
			user.img = img
			user.google = true
			user.password = ":)"

			user.save((err, userDB) => {
				if (err) {
					return res.status(500).json({ ok: false, err })
				}

				const token = jwt.sign(
					{
						user: userDB,
					},
					process.env.USER_SECRET,
					{ expiresIn: process.env.TOKEN_EXPIRES }
				)

				return res.json({
					ok: true,
					token,
				})
			})
		}
	})

	// res.json({ googleUsr })
})

module.exports = app
