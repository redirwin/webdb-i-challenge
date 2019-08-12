const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.use('api/accounts', db)

server.get('/', (req, res) => {
    res.send('<h3>DB Helpers with knex</h3>');
  });

server.get('/api/accounts/', (req, res) => {
    db("accounts")
    .then(item => {
        res.status(200).json(item);
    })
    .catch(error=> {
        req.status(500).json({message: "There was a database error."})
    })
});

server.post('/api/accounts/', (req, res) => {
    const post = req.body;
    if(!post.name || !post.budget){
        res.status(400).json({message: "Please include a name and budget."})
    } else {
           db("accounts")
           .insert(post)
           .then(post => {
            res.status(200).json(post)
           })
           .catch(error => {
               res.status(500).json({message: "error trying to add the data"})
           })     
    }
});

// server.put('/', (req, res) => {  
// });

// server.delete('/', (req, res) => {  
// });

module.exports = server;