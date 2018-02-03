const mongoDB = require('mongodb');
const mongo = mongoDB.MongoClient;
const dbUrl = "mongodb://localhost:27017/";

mongo.connect(dbUrl, function(err, db) {
	if (err) throw err;
	var dbo = db.db("hotelDB");
	
	var clientObj = { userName: 'admin', password: 'admin', email: 'admin@admin.com',  admin: 'on' };
	dbo.collection("users").insertOne(clientObj, function(err, res) {
		if (err) throw err;
		console.log("admin user Inserted successfully.");
		db.close();
	});
});