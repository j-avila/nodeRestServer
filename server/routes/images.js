const express = require('express')
const fs = require('fs')
const path = require('path')
const { assetsAuth } = require('../middlewares/auth')
const app = express()

app.get('/images/:type/:img', assetsAuth, (req, res) => {
  let type = req.params.type
  let img = req.params.img
  let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`)
  const noImgPath = path.resolve(__dirname, '../assets/no-image.jpg')

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg)
  } else {
    res.sendFile(noImgPath)
  }
})

module.exports = app
