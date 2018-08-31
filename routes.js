const passport = require('passport')
const usersController = require('./controllers/UsersController')

module.exports = (app) => {
    app.post('/users', usersController.createUser)
    app.get('/users', usersController.getUserProfile)
    app.post('/login', function (req, res, next) {
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
    })

    app.get('/redirect', function (req, res) {
        res.send({
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            redirect: req.query.link
        })
    })
}

// function authenticationMiddleware() {
//     return (req, res, next) => {
//         console.log('*** middleware req user: ', req.user)
//         console.log('*** middleware req is auth: ', req.isAuthenticated())
//         console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)

//         if (req.isAuthenticated()) return next()
//         res.status(300).send({ redirect: '/redirect?link=login' })
//     }
// }