const Users = require('../models').user
const userValidator = require('../userValidator')

const Sequelize = require('sequelize')
const Op = Sequelize.Op
const passport = require('passport')

const fs = require('fs')
const gm = require('gm')

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
                        user: req.user,
                        isAuthenticated: req.isAuthenticated(),
                        redirect: 'profile'
                    })
                })
            }
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async updateUser(req, res) {
        try {
            if (!req.user) {
                throw { login: 'Please login first' }
            }

            let username = await userValidator.validateUsername(req.body.name)
            let email = await userValidator.validateEmail(req.body.email)
            let updateFields = ['name', 'email']

            let error = {
                username: username.error ? username.msg : null,
                email: email.error ? email.msg : null
            }

            let validUser = {
                name: username.cleanUsername,
                email: email.cleanEmail
            }

            if (!validUser.name) {
                let index = updateFields.indexOf('name')
                if (index > -1) {
                    updateFields.splice(index, 1)
                }
            }

            if (!validUser.email) {
                let index = updateFields.indexOf('email')
                if (index > -1) {
                    updateFields.splice(index, 1)
                }
            }

            if ((error.username && updateFields.indexOf('name') > -1) || (error.email && updateFields.indexOf('email') > -1)) {
                throw error
            }

            const user = await Users.findById(req.user.id)
            const update = await user.update({ 'name': validUser.name, 'email': validUser.email }, { fields: updateFields })

            res.send({
                update: update
            })

        } catch (err) {
            res.status(500).send(err)
        }
    },
    async updatePassword(req, res) {
        try {
            if (!req.user) {
                throw { login: 'Please login first' }
            }

            const password = await userValidator.validatePassword(req.body.password)
            const error = {
                password: password.error ? password.msg : null
            }
            const validUser = {
                password: password.cleanPassword
            }

            if (error.password) {
                throw error
            }

            const user = await Users.findById(req.user.id)
            const update = await user.update({ 'password': validUser.password }, { fields: ['password'] })

            res.send({
                update: update
            })

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
                    user: req.user,
                    isAuthenticated: req.isAuthenticated(),
                    redirect: 'profile'
                })
            })
        })(req, res, next)
    },
    async logout(req, res) {
        if (!req.user) {
            throw { login: 'Please login first' }
        }

        await req.logout()
        res.redirect('/redirect?link=')
    },
    async checkEmailNotTaken(req, res) {
        try {
            const user = await Users.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('email')), sequelize.fn('lower', req.query.emial)) })
            res.send(user ? true : false)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async checkUsernameNotTaken(req, res) {
        try {
            const user = await Users.findOne({ where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), sequelize.fn('lower', req.query.username)) })
            res.send(user ? true : false)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async uploadAvatar(req, res) {
        try {
            if (!req.user) {
                throw { login: 'Please login first' }
            }

            const user = await Users.findById(req.user.id)
            // const userAvatarPath = 'uploads\\' + user.dataValues.avatar

            gm(req.file.path)
                .resize(400, 400)
                .noProfile()
                .write(req.file.path, function (err) {
                    if (err) console.log('GM error: ', err)
                })

            const path = req.file.path.split('uploads\\').pop()
            const oldAvatar = 'uploads/' + user.dataValues.avatar

            if (oldAvatar !== 'uploads/avatars/default.jpg') {
                fs.unlink(oldAvatar, (err) => {
                    if (err) throw err
                })
            }

            const update = await user.update({ 'avatar': path }, { fields: ['avatar'] })
            res.send({
                'update': update
            })
        } catch (err) {
            res.status(500).send(err)
        }
    },
    getUserProfile(req, res) {
        try {
            if (!req.user) {
                throw { login: 'Please login first' }
            }

            // const id = req.user.id
            // const user = await Users.(req.user.id)(id)

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
            email: user.dataValues.email,
            avatar: user.dataValues.avatar
        }

        done(null, cleanUser)
    } catch (err) {
        done(err, false)
    }
})
