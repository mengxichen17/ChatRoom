const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : '5432',
      user : 'mengxi',
      password : '',
      database : 'chat-history'
    }
  });

const app = express();
const server = createServer(app);
const io = new Server(server);


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('success');
})

app.post('/signin', (req, res) => {
    db.select('name', 'hash').from('login')
        .where('name', '=', req.body.name)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                        .where('name', '=', req.body.name)
                        .then(user => {
                            res.json(user[0])
                        })
                        .catch(error => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, password } = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                name: name
            })
            .into('login')
            .returning('name')
            .then(loginName => {
                console.log(loginName);
                return trx('users')
                    .returning('*')
                    .insert({
                        name: loginName[0].name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback) // if any wrong registration, roll back
        })
        
        .catch(err => res.status(400).json('unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
      .then(user => {
        if (user.length) {
          res.json(user[0]);
        } else {
          res.status(400).json('Not found');
        }
      })
      .catch(err => res.status(400).json('error getting user'));
  })

app.get('/chathistory', (req, res) =>{
    db.select('*').from('chathistory')
        .then(data => {
            res.json(data);
        })
    .catch(err => res.status(400).json('error getting chat history'))
})

app.post('/chathistory', (req, res) => {
    const { name, message } = req.body;
    db('chathistory')
        .returning('*')
        .insert({
            name: name,
            message: message,
            time: new Date()
        })
        .then(messages => {
            res.json(messages[0])
        })
        .catch(err => res.status(400).json('unable to send message'))
})

app.put('/chathistory/upvote', (req, res) => {
    const { id } = req.body;
    db('chathistory')
        .where('id', '=', id)
        .increment('upvotes', 1)
        .returning('upvotes')
        .then(upvotes => {
            res.json(upvotes[0].upvotes)
        })
        .catch(err => res.status(400).json('unable to record upvote'))
})

app.put('/chathistory/downvote', (req, res) => {
    const { id } = req.body;
    db('chathistory')
        .where('id', '=', id)
        .increment('downvotes', 1)
        .returning('downvotes')
        .then(downvotes => {
            res.json(downvotes[0].downvotes)
        })
        .catch(err => res.status(400).json(err))
        // .catch(err => res.status(400).json('unable to record upvote'))
})

// app.get('/chathistory', (req, res) =>{
//     db.select('*').from('chathistory')
//         .then(res.json())
//     .catch(err => res.status(400).json('error getting chat history'))
// })

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('server is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/chathistory --> GET = chathistory

*/
