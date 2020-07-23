const jwt = require('jsonwebtoken')

// ============================
// verify token
// ============================

const tokenAuth = (req, res, next) => {
  const token = req.get('token')

  jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, err })
    }
    req.user = decoded.user
    next()
  })
}

const roleAuth = (req, res, next) => {
  const user = req.user

  if (user.role === 'ADMIN_ROLE') {
    next()
  } else {
    return res.json({
      ok: false,
      message: 'the user is not admin',
    })
  }
}

const assetsAuth = (req, res, next) => {
  let token = req.query.token

  jwt.verify(token, process.env.USER_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ ok: false, err })
    }
    req.user = decoded.user
    next()
  })
}

module.exports = {
  tokenAuth,
  roleAuth,
  assetsAuth,
}
