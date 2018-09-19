module.exports = (sequelize, DataTypes) => {
    const Sneaker = sequelize.define('sneaker', {
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
                len: {
                    args: [3, 30],
                    msg: 'Sneaker name must be between 3 and 30 characters long.'
                },
                notEmpty: {
                    args: true,
                    msg: 'Sneaker name cannot be empty.'
                }
            }
        },
        images: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'sneakers/default.jpg'
        }
    }, {})

    Sneaker.associate = function (models) {
        Sneaker.belongsTo(models.brand, { foreignKey: 'brandId', allowNull: false })
        Sneaker.belongsTo(models.gender, { foreignKey: 'genderId', allowNull: false })
        Sneaker.belongsTo(models.type, { foreignKey: 'typeId', allowNull: false })
        Sneaker.belongsToMany(models.size, { through: 'sneaker_sizes' })
    }

    return Sneaker
}