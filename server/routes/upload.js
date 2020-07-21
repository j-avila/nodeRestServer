const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()
const path = require('path')
const fs = require('fs')
const User = require('../models/user')
const Product = require('../models/product')
// default options
app.use(fileUpload({ useTempFiles: true }))

app.put('/upload/:type/:id', (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'no files were uploaded',
      },
    })
  }

  const validExtensions = ['png', 'jpg', 'gif', 'jpeg']
  let file = req.files.archivo
  let fileName = file.name.split('.')
  let extension = fileName[1]

  let type = req.params.type
  let id = req.params.id
  validTypes = ['products', 'users']

  if (type.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `files ${extension} are not valid. Just accepts:  ${validExtensions.join(
          ', '
        )}`,
      },
    })
  }

  let alteredName = `${id}-${new Date().getMilliseconds()}.${extension}`

  if (validExtensions.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: `files ${extension} are not valid. Just accepts:  ${validExtensions.join(
          ', '
        )}`,
      },
    })
  }

  file.mv(`uploads/${type}/${alteredName}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    // file uploaded
    uploadImg(id, res, alteredName, type)
  })
})

module.exports = app

// files helplers
const handleFile = (type, fileName) => {
  const filePath = path.resolve(__dirname, `../../uploads/${type}/${fileName}`)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  } else {
    console.log(`error: ${type}, ${fileName}`)
  }
}

const uploadImg = (id, res, fileName, type) => {
  const item = type === 'users' ? User : Product

  item.findById(id, (err, itemDb) => {
    if (err) {
      handleFile(type, fileName)
      return res.status(500).json({
        ok: false,
        err,
      })
    }

    if (!itemDb) {
      handleFile(type, fileName)
      return res.status(400).json({
        ok: false,
        err: {
          message: `${id} no se encuentra entre los ${type} - server says: ${err}`,
        },
      })
    }

    handleFile(type, itemDb.img)

    itemDb.img = fileName
    itemDb.save((err, savedItem) => {
      res.json({
        ok: true,
        [type]: savedItem,
      })
    })
  })
}
