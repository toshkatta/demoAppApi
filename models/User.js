const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 30],
                    msg: 'Username must be between 3 and 30 characters long.'
                },
                notEmpty: {
                    args: true,
                    msg: 'Username cannot be empty.'
                },
                is: {
                    args: /^[a-z]+$/i,
                    msg: 'Username can only contain letters.'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: {
                    args: true,
                    msg: 'Email cannot be empty.'
                },
                isEmail: {
                    args: true,
                    msg: 'Not a valid email.'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 30],
                    msg: 'Password must be between 8 nad 30 characters long.'
                },
                notEmpty: {
                    args: true,
                    msg: 'Password cannot be empty.'
                },
                is: {
                    args: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    msg: 'Password must contain at least one number, uppercase and lowercase letter.'
                }
            }
        }
    }, {
            hooks: {
                afterValidate: function (user) {
                    const hash = bcrypt.hashSync(user.password, salt);
                    user.password = hash
                }
            }
        })

    return User;
}