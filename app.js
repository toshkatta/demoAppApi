const { sequelize } = require('./models')
const config = require('./config/config')

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')

const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const { Users } = require('./models')
const bcrypt = require('bcryptjs')

require('dotenv').config()


const app = express()
app.use(express.static('uploads'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
    // cookie: { secure: true }
}))

app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: [
        'http://localhost:4200'
    ], credentials: true
}))

require('./routes')(app)

passport.use(new LocalStrategy(
    {
        usernameField: 'name',
        passwordField: 'password'
    },
    async function (username, password, done) {
        try {
            const user = await Users.findOne({ where: { name: username } })

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            const passwordMatch = await bcrypt.compareSync(password, user.dataValues.password)
            if (!passwordMatch) {
                return done(null, false, { message: 'Incorrect password.' })
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to the db has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

sequelize.sync({
    logging: console.log
})
    .then(() => {
        app.listen(config.port)
        console.log(`Server started on port ${config.port}`)
    })
    .catch((err) => {
        console.error(err)
    })
