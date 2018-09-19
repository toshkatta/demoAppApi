module.exports = (sequelize, DataTypes) => {
    const Gender = sequelize.define('gender', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isIn: {
                    args: [['male', 'female']],
                    msg: 'Gender can only be male or female. If you disagree go back to tumblr.'
                }
            }
        }
    }, {})

    Gender.assosiate = function (models) {
        Gender.hasMany(models.sneaker)
    }

    Gender.findOrCreate({ where: { name: 'male' } }).spread((gender, created) => {
        if (created) {
            console.log('* gender: ', gender.get({ plain: true }))
        }
    })

    Gender.findOrCreate({ where: { name: 'female' } }).spread((gender, created) => {
        if (created) {
            console.log('* gender: ', gender.get({ plain: true }))
        }
    })

    return Gender
}