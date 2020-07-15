const jwt = require("jsonwebtoken")

// ============================
// verify token
// ============================

const tokenAuth = (req, res, next) => {
	const token = req.get("token")

	jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
		err && res.status(401).json({ ok: false, err })
		req.user = decoded.user
		next()
	})
}

module.exports = {
	tokenAuth,
}
