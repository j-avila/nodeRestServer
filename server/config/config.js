/* global Configurations */

// port
process.env.PORT = process.env.PORT || 3000

// envairoment
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// database
let urlDB

process.env.NODE_ENV === "dev"
	? (urlDB = "mongodb://localhost:27017/cafe")
	: (urlDB = process.env.NODE_URI)

process.env.URLDB = urlDB
