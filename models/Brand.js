module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('brand', {
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
                    args: [2, 30],
                    msg: 'Brand name must be between 2 and 30 characters long.'
                },
                notEmpty: {
                    args: true,
                    msg: 'Brand name cannot be empty.'
                }
            }
        }
    }, {})

    Brand.associate = function (models) {
        Brand.hasMany(models.sneaker)
    }

    return Brand
}