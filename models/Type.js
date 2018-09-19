module.exports = (sequelize, DataTypes) => {
    const Type = sequelize.define('type', {
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
                    args: [['low', 'high']],
                    msg: 'Type can only be low or high.'
                }
            }
        }
    }, {})

    Type.assosiate = function (models) {
        Type.hasMany(models.sneaker)
    }

    Type.findOrCreate({ where: { name: 'low' } }).spread((type, created) => {
        if (created) {
            console.log('* type: ', type.get({ plain: true }))
        }
    })

    Type.findOrCreate({ where: { name: 'high' } }).spread((type, created) => {
        if (created) {
            console.log('* type: ', type.get({ plain: true }))
        }
    })

    return Type
}