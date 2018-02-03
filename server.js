const express = require('express');
const bodyParser= require('body-parser');
const app = express();
const mongoDB = require('mongodb');
const mongo = mongoDB.MongoClient;
const dbUrl = "mongodb://localhost:27017/";
const NodeSession = require('node-session');
const session = new NodeSession({secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'});
const path = require('path');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

app.listen(3000, function() {
	console.log('listening on 3000');
});

app.get('/', (req, res) => {
	session.startSession(req, res, function(){
		if(req.session.get('USER_NAME')){
			res.sendFile(__dirname + '/index.html');
		}else{
			res.sendFile(__dirname + '/login.html');
		}
	});
});

app.get('/login', (req, res) => {
	session.startSession(req, res, function(){
		req.session.put('USER_NAME', '');
		res.sendFile(__dirname + '/login.html');
	});
});

app.get('/clients', (req, res) => {
	session.startSession(req, res, function(){
		if(req.session.get('USER_NAME')){
			res.sendFile(__dirname + '/index.html');
		}else{
			res.sendFile(__dirname + '/login.html');
		}
	});	
});

app.get('/users', (req, res) => {
	session.startSession(req, res, function(){
		if(req.session.get('USER_NAME')){
			res.sendFile(__dirname + '/users.html');
		}else{
			res.sendFile(__dirname + '/login.html');
		}
	});	
});

app.get('/getClients', (req, res) => {
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		dbo.collection('clients').find().toArray((err, result) => {
			if (err) return console.log(err)
			res.send(result);
			res.end();
		});
	});
});

app.get('/getUsers', (req, res) => {
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		dbo.collection('users').find().toArray((err, result) => {
			if (err) return console.log(err)
			res.send(result);
			res.end();
		});
	});
});

app.post('/clients', (req, res) => {
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		var clientObj = { firstName: req.body.firstName, lastName: req.body.lastName, country: req.body.country, dob: req.body.dob };
		// insert new client
		if(!req.body.id){
			dbo.collection("clients").insertOne(clientObj, function(err, res) {
				if (err) throw err;
				console.log("Client Inserted successfully.");
				db.close();
			});
		}
		// update an existing client
		else{
			dbo.collection("clients").replaceOne({'_id': new mongoDB.ObjectID(req.body.id)}, { $set: clientObj }, function(err, res) {
				if (err) throw err;
				console.log("Client Updated successfully.");
				db.close();
			});
		}
		
	});
	res.redirect("/clients");
});

app.post('/users', (req, res) => {
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		// insert new user
		if(!req.body.id){
			var clientObj = { userName: req.body.userName, password: req.body.password, email: req.body.email, admin: req.body.admin };
			dbo.collection("users").insertOne(clientObj, function(err, res) {
				if (err) throw err;
				console.log("User Inserted successfully.");
				db.close();
			});
		}
		// update an existing user
		else{
			dbo.collection("users").replaceOne({'_id': new mongoDB.ObjectID(req.body.id)}, { $set: { userName: req.body.userName, password: req.body.password, email: req.body.email, admin: req.body.admin } }, function(err, res) {
				if (err) throw err;
				console.log("User Updated successfully.");
				db.close();
			});
		}
		
	});
	res.redirect("/users");
});

app.post('/deleteClient', (req, res) => {
	console.log('Going to delete client with id: '+req.body.id);
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		dbo.collection("clients").deleteOne({_id: new mongoDB.ObjectID(req.body.id)});
		db.close();
	});
	res.redirect("/clients");
});

app.post('/deleteUser', (req, res) => {
	console.log('Going to delete user with id: '+req.body.id);
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		dbo.collection("users").deleteOne({_id: new mongoDB.ObjectID(req.body.id)});
		db.close();
	});
	res.redirect("/users");
});

app.post('/authenticate', (req, res) => {
	session.startSession(req, res, function(){});
	mongo.connect(dbUrl, function(err, db) {
		if (err) throw err;
		var dbo = db.db("hotelDB");
		var query = { userName: req.body.userName, password: req.body.password };
		dbo.collection("users").findOne(query, function(err,user){
			if (err) return console.log(err)
			if(user){
				req.session.put('USER_NAME', user.userName);
				res.redirect("/clients");
			} else{
				req.session.put('USER_NAME', '');
				res.redirect("/login");
			}
			res.end();
		});
	});
});