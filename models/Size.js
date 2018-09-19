module.exports = (sequelize, DataTypes) => {
    const sizes = [35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 40, 41, 41.5, 42, 42.5, 43, 44, 45, 45.5, 46, 46.5, 47, 47.5, 48, 48.5, 49, 50, 51]

    const Size = sequelize.define('size', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        eu: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            unique: true,
            validate: {
                isIn: {
                    args: [sizes],
                    msg: 'Standart EU sizes are: ' + sizes.join(', ')
                }
            }
        }
    }, {})

    Size.associate = function (models) {
        Size.belongsToMany(models.sneaker, { through: 'sneaker_sizes' })
    }

    let sizesObj = []
    for (let num of sizes) {
        sizesObj.push({ eu: num })
    }

    Size.bulkCreate(sizesObj, { fields: ['eu'], validate: true }).catch(err => {
        console.log('* error in bulk create sizes')
    }).then(() => {
        console.log('* bulk create sizes finished')
    })

    return Size
}