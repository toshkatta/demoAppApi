const { Users } = require('../models')
const userValidator = require('../userValidator')

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const passport = require('passport')

module.exports = {
    async createUser(req, res) {
        try {
            let username = await userValidator.validateUsername(req.body.name)
            let email = await userValidator.validateEmail(req.body.email)
            let password = userValidator.validatePassword(req.body.password)

            if (username.error || email.error || password.error) {
                let error = {}
                error.username = username.error ? username.msg : null
                error.email = email.error ? email.msg : null
                error.password = password.error ? password.msg : null

                throw error
            } else {
                let validUser = {
                    name: username.cleanUsername,
                    email: email.cleanEmail,
                    password: password.cleanPassword
                }

                const user = await Users.create(validUser, { fields: ['name', 'email', 'password'] })
                const id = user.dataValues.id

                await req.logIn(id, function (err) {
                    if (err) throw err

                    res.send({
                        userId: req.user,
                        isAuthenticated: req.isAuthenticated(),
                        redirect: 'profile'
                    })
                })
            }
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async login(req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) return next(err)

            if (!user) {
                return res.send({
                    redirect: 'login',
                    msg: info.message
                })
            }

            const id = user.dataValues.id
            req.logIn(id, function (err) {
                if (err) return next(err)

                return res.send({
                    userId: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    redirect: 'profile'
                })
            })
        })(req, res, next)
    },
    async checkEmailNotTaken(req, res) {
        try {
            const user = await Users.findOne({ where: { email: req.query.email } })
            res.send(user ? true : false)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async checkUsernameNotTaken(req, res) {
        try {
            const user = await Users.findOne({ where: { name: req.query.username } })
            res.send(user ? true : false)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getUserProfile(req, res) {
        try {
            console.log('profile req user: ', req.user)
            console.log('profile req is auth: ', req.isAuthenticated())
            // const id = req.user.id
            // const user = await Users.findById(id)

            res.send(req.user)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getLoginStatus(req, res) {
        try {
            const isLoggedIn = req.user ? true : false
            res.send(isLoggedIn)
        } catch (err) {
            res.status(500).send(err)
        }
    }
}

passport.serializeUser(function (user, done) {
    const id = user.dataValues ? user.dataValues.id : user
    done(null, id)
})

passport.deserializeUser(async function (id, done) {
    try {
        const user = await Users.findById(id)
        const cleanUser = {
            id: user.dataValues.id,
            name: user.dataValues.name,
            email: user.dataValues.email
        }

        done(null, cleanUser)
    } catch (err) {
        done(err, false)
    }
})
