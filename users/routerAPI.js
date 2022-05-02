const express = require('express')
const router = express.Router()
const fs=require('fs')


/* API routes */
router.get('/',(req,res)=>{
	let users=JSON.parse(fs.readFileSync('./data/users.json','utf8'))
	res.status(200).json(users)
})
router.post('/',(req,res)=>{
	let users=JSON.parse(fs.readFileSync('./data/users.json','utf8'))
	users.push(req.body)
	fs.writeFileSync('./data/users.json',JSON.stringify(users))
	res.status(201).json(req.body)
})
router.get('/:id',(req,res)=>{
	let users=JSON.parse(fs.readFileSync('./data/users.json','utf8'))
	res.status(200).json(users[req.params.id])
})
router.patch('/:id',(req,res)=>{
	let users=JSON.parse(fs.readFileSync('./data/users.json','utf8'))
	users[req.params.id]=req.body
	fs.writeFileSync('./data/users.json',JSON.stringify(users))
	res.status(200).json({message:'user modified'})
})
router.delete('/:id',(req,res)=>{
	let users=JSON.parse(fs.readFileSync('./data/users.json','utf8'))
	users.splice(req.params.id, 1)
	fs.writeFileSync('./data/users.json',JSON.stringify(users))
	res.status(200).json({message:'user deleted'})
})
module.exports = router