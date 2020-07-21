var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
  name: { type: String, required: [true, 'El nombre es necesario'] },
  uniPrice: {
    type: Number,
    required: [true, 'El precio únitario es necesario'],
  },
  description: { type: String, required: false },
  img: { type: String, required: false },
  aviable: { type: Boolean, required: true, default: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = mongoose.model('Product', productSchema)
