const { Users } = require('./models')

const clearWhitespace = (input) => {
    input = input.trim()
    return input.replace(/\s+/g, ' ')
}

const UserValidator = {
    async validateUsername(username) {
        const usernameRegex = /^[a-z]+$/i
        let error = {
            error: true,
            msg: ''
        }

        if (username === null || typeof username === 'undefined') {
            error.msg = 'Username cannot be null.'
            return error
        }

        if (typeof username !== 'string') username = username.toString()

        let cleanUsername = clearWhitespace(username)

        if (cleanUsername.length === 0) {
            error.msg = 'Username cannot be empty.'
            return error
        }

        if (cleanUsername.length < 3 || cleanUsername.length > 30) {
            error.msg = 'Username must be between 3 and 30 characters long.'
            return error
        }

        if (!usernameRegex.test(cleanUsername)) {
            error.msg = 'Username can only contain letters.'
            return error
        }

        const user = await Users.findOne({ where: { name: cleanUsername } })
        if (user !== null) {
            error.msg = 'Username already taken.'
            return error
        }

        error.error = false
        error.cleanUsername = cleanUsername
        return error
    },
    async validateEmail(email) {
        // https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
        const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        let error = {
            error: true,
            msg: ''
        }

        if (email === null || typeof email === 'undefined') {
            error.msg = 'Email cannot be null.'
            return error
        }

        if (typeof email !== 'string') email = email.toString()

        let cleanEmail = clearWhitespace(email)

        if (cleanEmail.length === 0) {
            error.msg = 'Email cannot be empty.'
            return error
        }

        if (!emailRegex.test(cleanEmail)) {
            error.msg = 'Not a valid email address.'
            return error
        }

        const user = await Users.findOne({ where: { email: cleanEmail } })
        if (user !== null) {
            error.msg = 'User with that email already exists.'
            return error
        }

        error.error = false
        error.cleanEmail = cleanEmail
        return error
    },
    validatePassword(password) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        let error = {
            error: true,
            msg: ''
        }

        if (password === null || typeof password === 'undefined') {
            error.msg = 'Password cannot be null.'
            return error
        }

        if (typeof password !== 'string') password = password.toString()

        let cleanPassword = clearWhitespace(password)

        if (cleanPassword.length === 0) {
            error.msg = 'Password cannot be empty.'
            return error
        }

        if (cleanPassword.length < 8 || cleanPassword.length > 30) {
            error.msg = 'Password must be between 8 and 30 characters long.'
            return error
        }

        if (!passwordRegex.test(cleanPassword)) {
            error.msg = 'Password must contain at least one number, uppercase and lowercase letter.'
            return error
        }

        error.error = false
        error.cleanPassword = cleanPassword
        return error
    }
}

module.exports = UserValidator