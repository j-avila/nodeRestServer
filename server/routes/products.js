const express = require('express')
const app = express()
const _ = require('underscore')
const Product = require('../models/product')
const { tokenAuth, roleAuth } = require('../middlewares/auth')
const auth = require('../middlewares/auth')

app.get('/products', (req, res) => {
  const from = Number(req.query.from) || 0
  const limit = Number(req.query.limit) || 0

  Product.find({ aviable: true })
    .skip(from)
    .limit(limit)
    .populate('createdBy', 'name')
    .populate('category', 'name')
    .exec((err, products) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }

      Product.countDocuments({ aviable: true }, (err, count) => {
        res.json({
          ok: true,
          products,
          count,
        })
      })
    })
})

app.get('/products/search', (req, res) => {
  const terms = req.query.name
  const regex = new RegExp(terms, 'i')

  Product.find({ name: regex })
    .populate('category', 'name')
    .exec((err, product) => {
      if (err) {
        return status.anchor(500).json({
          ok: false,
          err,
        })
      }
      res.json({
        ok: true,
        product,
      })
    })
})

app.get('/products/:id', (req, res) => {
  const id = req.params.id
  Product.findById(id, (err, product) => {
    if (err) {
      return status.anchor(500).json({
        ok: false,
        err,
      })
    }
    res.json({
      ok: true,
      product,
    })
  })
})

app.post('/products', [tokenAuth, roleAuth], (req, res) => {
  const body = req.body

  const product = new Product({
    name: body.name,
    uniPrice: body.price,
    description: body.description,
    category: body.category,
    createdBy: req.user._id,
  })

  product.save([tokenAuth, roleAuth], (err, dbRes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    if (!dbRes) {
      res.status(400).json({
        ok: false,
        err,
      })
    }

    res.json({
      ok: true,
      product: dbRes,
    })
  })
})

app.put('/product/:id', [tokenAuth, roleAuth], (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['name', 'description', 'price', 'active'])

  Product.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, dbResp) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        })
      }
      if (!dbResp) {
        return res.status(400).json({
          ok: false,
          err,
        })
      }

      res.json({
        ok: true,
        products: dbResp,
      })
    }
  )
})

app.delete('/products/:id', [tokenAuth, roleAuth], (req, res) => {
  const id = req.params.id

  Product.findByIdAndDelete(id, (err, dbRes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      })
    }
    if (!dbRes) {
      ok: false, err
    }

    res.json({
      ok: true,
      product: dbRes,
    })
  })
})

module.exports = app
