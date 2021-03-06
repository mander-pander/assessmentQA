const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.json())

app.use('/style', express.static('./public/index.css'));
app.use('/js', express.static('./public/index.js'));

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'ceb45d876c2245bea806f4113fdeccb9',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
    rollbar.log('file served');
});

// app.get('/styles', (req, rs) => {
//     res.sendFile(path.join(__dirname, './public/index.css'));
// });

// app.get('/js', (req, rs) => {
//     res.sendFile(path.join(__dirname, './public/index.js'));
// });


app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
        rollbar.log('All bots delivered.')
    } catch (error) {
        // console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
        rollbar.error('Unable to get bots!', error)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
        rollbar.info('Five robots served for player choice.')
    } catch (error) {
        // console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
        rollbar.critical('Unable to deliver five robots to player', error)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage

        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage

        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
            rollbar.info('Player lost message sent.')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
            rollbar.info('Player won message sent.')
        }
    } catch (error) {
        // console.log('ERROR DUELING', error)
        res.sendStatus(400)
        rollbar.error('Dueling error', error);
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
        rollbar.log('Player stats served.')
    } catch (error) {
        // console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
        rollbar.error('Unable to deliver player stats.', error)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
