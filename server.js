const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./api/dbConfig');
const { restart } = require('nodemon');
const server = express();
const apiUrl = 'https://todoapp-backnode.herokuapp.com/';
server.use(cors());
server.use(helmet());
server.use(express.json());


server.get('/todos',  async(req, res) =>{
    try{
   const todos = await db('todos')
   res.json(todos)
    }
    catch(err){
    console.log(err)
    }
});

server.post('/todos', async(req, res) =>{
    const message= req.body.message
    if(!message){
        return res.status(400).json({message: 'You must include a message in your request'})
    }
   try{
      await db('todos').insert({message: message})
       res.status(201).json({message: 'Todo successfully stored'})
   } catch{
       console.log(err)
   }
})

server.put('/todos/:id', async (req, res) =>{
const id = req.params.id
const message = req.body.message   
    if(!message){
        return res.status(400).json({message: 'You must include a message in your request'})
    }
    try{
    const currentTodo = await db('todos').where({id : id}).update({message : message})
        res.status(200).json({message: 'updated succesfully'})
    }
    catch{
       console.log(err)
   }
    
})
server.put('/todos/:id/status' , async (req, res) =>{
    const id = req.params.id
    const status = req.body.status
    if(!status){
        return res.status(400).json({message: 'You must include a status in your request'})
    }
        try{
            
       const updateResult = await db('todos').where({id: id}).update({status: status})
       console.log(updateResult)
            res.status(200).json({message:"the Status was succesfully updated"})
        }
        catch{
           console.log(err)
           return res.status(400).json({message: 'you have an stupid error'})
       }
        
    })

server.get('/todos/:id', async (req, res) =>{
const id = req.params.id
    try{
 const todo = await  db('todos').where({id : id})
 todo.length === 0 ? res.status(400).json({message: 'todo not found'}) : res.status(200).json(todo)
    }
    catch{
       console.log(err)
   }
    
})


server.delete('/todos/:id', async(req, res) =>{
const id = req.params.id
    try{
       await db('todos').where({id : id}).del()
    res.status(200).json({message: 'Deleted succesfully'})
    }
    catch{
       console.log(err)
   }
    
})


module.exports = server;
