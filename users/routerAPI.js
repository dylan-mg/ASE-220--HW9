const { MongoClient, Db } = require('mongodb');

const ID = 'browserMan';
const PASSWORD = 'TXabiw8QTNpgjExJ';
const DATABASE = '220--assignment-9';
const NET = 'asecourses.lzeux.mongodb.net';
const URL = `mongodb+srv://${ID}:${PASSWORD}@${NET}/${DATABASE}?retryWrites=true&w=majority`;

/**
 * @type {Db} MongoDB database Object
 */
let db;
console.log("Please Wait for MongoDB to connect");
MongoClient.connect(URL, { useUnifiedTopology: true }, function(error, client) {
    if (error) return console.log(error)
    db = client.db(DATABASE);
    try {
        if (error) { return console.log(error) };
        db = client.db(DATABASE);
        db.command({ ping: 1 });
        console.log("MongoDB Connected");
    } catch (tryErr) {
        console.log(tryErr);
        console.log("Error connecting");
    }
});

const express = require('express')
const router = express.Router()
const fs = require('fs')

/* API routes */
// DOOR [ / ]
// *GET
// returns all user info
router.get('/', (req, res) => {
    db.collection('users').find().toArray(function(error, users) {
        res.status(200).json(users);
    });
})

// *POST
// adds a new entry to list of users
router.post('/', (req, res) => {
    // generate the user entry for logging
    let userEntry = {
        email: req.body.email,
        password: req.body.password
    };

    db.collection('users').insertOne(userEntry, function(uError, uRes) { // add post to data base
        if (uError) { return console.log(uError) } // if error, return error

        console.log(uError);
        console.log(uRes);

        res.status(201).json(req.body);
    });
})

// DOOR [ /:id ]
// *GET
// gets info about a specific user
router.get('/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
    res.status(200).json(users[req.params.id])
})

// *PATCH
// updates info about a specific user
router.patch('/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
    users[req.params.id] = req.body
    fs.writeFileSync('./data/users.json', JSON.stringify(users))
    res.status(200).json({ message: 'user modified' })
})

// *DELETE
// deletes a specific user
router.delete('/:id', (req, res) => {
    let users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'))
    users.splice(req.params.id, 1)
    fs.writeFileSync('./data/users.json', JSON.stringify(users))
    res.status(200).json({ message: 'user deleted' })
})

module.exports = router