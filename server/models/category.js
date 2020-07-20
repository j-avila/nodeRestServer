const mongoose = require("mongoose")
const uniqueValidation = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const categorySchema = new Schema({
	name: {
		type: String,
		required: [true, "the name is required"],
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
})

categorySchema.methods.toJSON = function () {
	let category = this
	let categoryObj = category.toObject()
	return categoryObj
}

categorySchema.plugin(uniqueValidation, { message: "{PATH} debe ser unico" })
module.exports = mongoose.model("Category", categorySchema)
