module.exports = (sequelize, DataTypes) => {
    const SneakerImage = sequelize.define('sneakerImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {})

    SneakerImage.assosiate = function (models) {
        SneakerImage.belongsTo(models.sneaker, { foreignKey: 'sneakerId', allowNull: false })
    }

    return SneakerImage
}