// ON INITIALISE NOS MODULES
const express = require('express')
const app = express()
const config = require('config')
const cors = require('cors')
const mysql = require('promise-mysql')

// ON LIE EXPRESS ET SES MODULES
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ON INITIALISE NOS ROUTES
const accountRoutes = require('./routes/account')
const charactersRoutes = require('./routes/characters')
const ticketsRoutes = require('./routes/tickets')

// ON CRÉER UNE NOUVELLE CONNEXION MYSQL
mysql.createConnection({
    host: config.get('mysql.host'),
    database: config.get('mysql.authDatabase'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    port: config.get('mysql.port')
}).then((db) => {
    // ON ACTUALISE NOTRE CONNEXION
    setInterval(async function () {
        let res = await db.query('SELECT 1')
    }, 10000)
    console.log('DATABASE [CONNECTED]')
    // ON INITIALISE NOTRE ROUTE RACINE
    app.get('/', (req, res, next) => {
        res.json({ msg: 'API [ONLINE]', status: 200 })
    })

    accountRoutes(app, db)
    charactersRoutes(app, db)
    ticketsRoutes(app, db)
})

const PORT = config.get('port')

// ON DÉMARRE L'APPLICATION
app.listen(PORT, () => {
    console.log('API (Listening on port ' + PORT + ') [CONNECTED]')
})