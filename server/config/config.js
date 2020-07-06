/* global Configurations */

// port
process.env.PORT = process.env.PORT || 3000

// envairoment
process.env.NODE_ENV = process.env.NODE_ENV || "dev"

// database
let urlDB

process.env.NODE_ENV === "dev"
	? (urlDB = "mongodb://localhost:27017/cafe")
	: (urlDB =
			"mongodb+srv://jlavila13:o4BU2s5nlShIaeND@cluster0.l40uu.mongodb.net/cafe?retryWrites=true&w=majority")

process.env.URLDB = urlDB
