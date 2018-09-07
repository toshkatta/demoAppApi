const passport = require('passport')
const usersController = require('./controllers/UsersController')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const id = req.user.id.toString()
        const uploadsPath = 'uploads/images/'
        fs.mkdir(uploadsPath + id, err => {
            cb(null, uploadsPath + id)
        })
    },
    filename: function (req, file, cb) {
        let hash = uuidv4()
        let extension = file.originalname.split('.').pop().trim()
        cb(null, hash + '.' + extension)
    }
})
const upload = multer({ storage: storage })


module.exports = (app) => {
    app.post('/login', usersController.login)
    app.get('/login', usersController.getLoginStatus)

    app.get('/logout', usersController.logout)

    app.post('/register', usersController.createUser)
    app.get('/checkEmail', usersController.checkEmailNotTaken)
    app.get('/checkUsername', usersController.checkUsernameNotTaken)

    app.get('/users', usersController.getUserProfile)
    app.put('/users', usersController.updateUser)

    app.put('/password', usersController.updatePassword)

    app.post('/upload', upload.single('avatar'), usersController.uploadAvatar)

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
