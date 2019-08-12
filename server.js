const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.use('api/accounts', db)

server.get('/', (req, res) => {
    res.send('<h3>DB Helpers with knex</h3>');
  });

server.get('/api/accounts', (req, res) => {
    db("accounts")
    .then(item => {
        res.status(200).json(item);
    })
    .catch(error=> {
        req.status(500).json({message: "There was a database error."})
    })
});

server.get('/api/accounts/:id', (req, res) => {
    db("accounts")
    .where({id: req.params.id})
    .first()
    .then(account => {
        res.status(200).json(account);
    })
    .catch(error=> {
        res.status(500).json({message: "There was an error getting that ID."});
    });
})

server.post('/api/accounts', (req, res) => {
    const account = req.body;
    if(!account.name || !account.budget){
        res.status(400).json({message: "Please include a name and budget."})
    } else {
           db("accounts")
           .insert(account)
           .then(account => {
            res.status(200).json(account)
           })
           .catch(error => {
               res.status(500).json({message: "error trying to add the data"})
           })     
    }
});

server.put('/api/accounts/:id', (req, res) => {  
    const changes = req.body;
    db("accounts") 
    .where({id: req.params.id})
    .update(changes)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'Unable to find that id.' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Server error while trying to update that account.' });
    });
});

server.delete('/api/accounts/:id', (req, res) => {  
    db("accounts")
    .where({id: req.params.id})
    .del()
    .then(count=> {
        count > 0 ? res.status(200).json(count) : res.status(400).json({message: "Couldn't find that account."})
    })
    .catch(error => {
        res.status(500).json({message: "Server error while trying to delete that account."})
    })
});

module.exports = server;