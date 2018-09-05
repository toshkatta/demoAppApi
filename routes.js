const passport = require('passport')
const usersController = require('./controllers/UsersController')

module.exports = (app) => {
    app.post('/login', usersController.login)
    app.get('/login', usersController.getLoginStatus)
    app.post('/register', usersController.createUser)
    app.get('/checkEmail', usersController.checkEmailNotTaken)
    app.get('/checkUsername', usersController.checkUsernameNotTaken)

    app.get('/users', usersController.getUserProfile)

    app.get('/redirect', function (req, res) {
        res.send({
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            redirect: req.query.link
        })
    })
}

function authenticationMiddleware(req, res, next) {
    console.log('*** middleware req user: ', req.user)
    console.log('*** middleware req is auth: ', req.isAuthenticated())
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)

    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(300).send({ redirect: '/redirect?link=login' })
    }
}
