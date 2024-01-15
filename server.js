const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const PORT = 4000;


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

const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});



socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    //Listens and logs the message to the console
    socket.on('message', (data) => {
        storeMessage(data);
        socketIO.emit('messageResponse', data);
    });

    socket.on('message_upvote', (data) =>{
        console.log("this message id got upvoted: ", data);
        updateVote(data, upvote=true);
        socketIO.emit('message_upvote_updated', data);
    })

    socket.on('message_downvote', (data) =>{
        console.log("this message id got downvoted: ", data);
        updateVote(data, upvote=false);
        socketIO.emit('message_downvote_updated', data)
    })

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
});

function storeMessage(data) {
    fetch('http://localhost:4000/chathistory', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: data.name,
                message: data.message,
                time: data.time,
                message_id: data.message_id,
                upvotes: 0,
                downvotes: 0
            })
        })
        .then(response => response.json())
        .then(message => {
            if (message) {
                console.log(message);
            }
        })
        .catch(err => console.log('unable to send message'))
}

function updateVote(data, isUpVote) {
    let url = 'http://localhost:4000/chathistory';
    if (isUpVote) {
        url = url.concat("/upvote");
    } else {
        url = url.concat('/downvote');
    }

    fetch(url, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            message_id: data.message_id
        })
        })
        .catch(err => console.log(`unable to ${isUpVote?'upvote':'downvote'} message`, err))
}

async function getChatHistory() {
    try {
        const response = await fetch('http://localhost:4000/chathistory', {
            method: 'get',
            // headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const chatHistory = await response.json();
        const chatHistorySorted = chatHistory.sort((a, b) => {
            // Sort the array of messages (in json) by the message's time
            const timeA = new Date(a.time);
            const timeB = new Date(b.time);
            return timeA - timeB;
          });
        return chatHistorySorted;
    } catch (error) {
        console.error('Error fetching chat history:', error);
    }
}

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
    const { name, message, message_id, time } = req.body;
    db('chathistory')
        .returning('*')
        .insert({
            name: name,
            message: message,
            time: time,
            message_id: message_id
        })
        .then(messages => {
            res.json(messages[0])
        })
        .catch(err => res.status(400).json(err))
        // .catch(err => res.status(400).json('unable to send message'))
})

app.put('/chathistory/upvote', (req, res) => {
    const { message_id } = req.body;
    db('chathistory')
        .where('message_id', '=', message_id)
        .increment('upvotes', 1)
        .returning('upvotes')
        .then(upvotes => {
            res.json(upvotes[0].upvotes)
        })
        .catch(err => res.status(400).json('unable to record upvote'))
})

app.put('/chathistory/downvote', (req, res) => {
    const { message_id } = req.body;
    db('chathistory')
        .where('message_id', '=', message_id)
        .increment('downvotes', 1)
        .returning('downvotes')
        .then(downvotes => {
            res.json(downvotes[0].downvotes)
        })
        .catch(err => res.status(400).json(err))
        // .catch(err => res.status(400).json('unable to record upvote'))
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
// server.listen(3000, () => {
//     console.log('server is running on port 3000');
// });

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/chathistory --> GET = chathistory

*/
