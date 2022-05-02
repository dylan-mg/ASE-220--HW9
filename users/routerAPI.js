if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const { MongoClient, Db } = require('mongodb');
const URL = process.env.MONGOURL;

/**
 * @type {Db} MongoDB database Object
 */
let db;
console.log("Please Wait for MongoDB to connect");
MongoClient.connect(URL, { useUnifiedTopology: true }, function(error, client) {
    if (error) return console.log(error)
    db = client.db();
    try {
        if (error) { return console.log(error) };
        db = client.db();
        db.command({ ping: 1 });
        console.log("MongoDB Connected");
    } catch (tryErr) {
        console.log(tryErr);
        console.log("Error connecting");
    }
});

const express = require('express')
const router = express.Router()

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
    db.collection('counter').findOne({ name: 'total' }, (countErr, countData) => {
        let total = countData.total;

        let userEntry = {
            _id: total + 1,
            email: req.body.email,
            password: req.body.password
        };

        db.collection('users').insertOne(userEntry, function(uError, uRes) { // add post to data base
            if (uError) { return console.log(uError) } // if error, return error

            console.log(uError);
            console.log(uRes);
            db.collection('counter').updateOne({ name: 'total' }, { $inc: { total: 1 } }, function(incError, incRes) { // increment counter
                // if there's a problem, log it
                if (incError) { return console.log(incError) }

                // Log updated data
                console.log("Data that was logged: ");
                console.table(req.body);

                // generate response
                res.status(201).json(req.body);
            });

        });
    })
})

// DOOR [ /:id ]
// *GET
// gets info about a specific user
router.get('/:id', (req, res) => {
    db.collection('users').findOne({ _id: parseInt(req.params.id) }, function(error, user) {
        try {
            res.status(200).json(user)
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Error, please refresh" });
        }
    });
})

// *PATCH
// updates info about a specific user
router.patch('/:id', (req, res) => {
    db.collection('users').updateOne({ _id: parseInt(req.params.id) }, {
        $set: {
            email: req.body.email,
            password: req.body.password
        }
    }, function(err, result) {
        if (err) {
            console.log(err);
            res.status(404).json({ message: `error loading ${req.params.id}` });
        } else if (result.matchedCount > 0) {
            console.log('app.put.edit: Update complete');
            res.status(201).json({ message: `user ${req.params.id} updated` });
        } else {
            res.status(500).json({ message: `error updating ${req.params.id}` });
        }
    });
})

// *DELETE
// deletes a specific user
router.delete('/:id', (req, resp) => {
    let query = { _id: parseInt(req.params.id) }

    db.collection('users').deleteOne(query, function(error, res) {
        if (error) {
            console.log(error);
            console.log(res);
            resp.status(500).send("Problem Deleting user");
        } else {
            console.log(`Delete of task ${req.params.id} was successful`);

            resp.status(201).send("Successfully Deleted");
        }
    });
})

module.exports = router