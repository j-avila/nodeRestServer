const mongoose = require("mongoose")
const uniqueValidation = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const userRoles = {
	values: ["ADMIN_ROLE", "USER_ROLE"],
	message: "{VALUE} no es un rol válido",
}

const userSchema = new Schema({
	name: {
		type: String,
		required: [true, "the name is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "The email is required"],
	},
	password: {
		type: String,
		required: [true, "password is required"],
	},
	img: {
		type: String,
	},
	role: {
		type: String,
		enum: userRoles,
		default: "USER_ROLE",
	},
	state: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
})

userSchema.methods.toJSON = function () {
	let user = this
	let userObj = user.toObject()
	delete userObj.password
	return userObj
}

userSchema.plugin(uniqueValidation, { message: "{PATH} debe ser unico" })
module.exports = mongoose.model("User", userSchema)
