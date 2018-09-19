const passport = require('passport')

const usersController = require('./controllers/UsersController')
const brandController = require('./controllers/BrandController')
const sneakerController = require('./controllers/SneakerController')

const fs = require('fs')
const uuidv4 = require('uuid/v4')
const multer = require('multer')

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const id = req.user.id.toString()
        const uploadsPath = 'uploads/avatars/'
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

const sneakerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsPath = 'uploads/sneakers/temp/'
        cb(null, uploadsPath)
    },
    filename: function (req, file, cb) {
        let hash = uuidv4()
        let extension = file.originalname.split('.').pop().trim()
        cb(null, hash + '.' + extension)
    }
})

const uploadAvatar = multer({ storage: avatarStorage })
const uploadSneaker = multer({ storage: sneakerStorage })


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

    app.post('/uploadAvatar', uploadAvatar.single('avatar'), usersController.uploadAvatar)
    app.post('/uploadSneakers', uploadSneaker.any(), sneakerController.uploadSneakers)

    app.get('/brandName', brandController.getBrandsByName)
    app.get('/brandId', brandController.getBrandById)
    app.get('/brand', brandController.getBrands)
    app.post('/brand', brandController.createBrand)
    app.put('/brand', brandController.updateBrand)
    app.delete('/brand', brandController.deleteBrand)

    app.post('/checkModelExists', sneakerController.checkModelExists)
    app.post('/sneaker', sneakerController.createSneaker)
    app.get('/sneaker', sneakerController.getSneakers)

    app.get('/redirect', function (req, res) {
        res.send({
            user: req.user,
            isAuthenticated: req.isAuthenticated(),
            redirect: req.query.link
        })
    })
}

// function authenticationMiddleware(req, res, next) {
//     console.log('*** middleware req user: ', req.user)
//     console.log('*** middleware req is auth: ', req.isAuthenticated())
//     console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)

//     if (req.isAuthenticated()) {
//         next()
//     } else {
//         res.status(300).send({ redirect: '/redirect?link=login' })
//     }
// }
