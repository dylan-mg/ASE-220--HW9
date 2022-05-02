const open = require('open')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080

/* Middleware */
app.use(express.static('assets'))
app.use(bodyParser.json())

const users = require('./users/routerWeb')
const usersAPI = require('./users/routerAPI')

app.use('/users', users)
app.use('/api/users', usersAPI)

/* WEB routes */
app.get('/', (req, res) => {
    res.status(200).send(fs.readFileSync('./users/index.html', 'utf-8'))
})

app.listen(port, async() => {
    console.log(`Example app listening on port ${port}`)
    await open(`http://localhost:${port}`)
})