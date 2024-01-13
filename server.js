const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

app.get('/chathistory/ ')

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/chathistory --> GET = chathistory

*/
