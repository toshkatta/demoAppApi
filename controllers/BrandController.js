const Brand = require('../models').brand
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
    async createBrand(req, res) {
        try {
            const brand = await Brand.create(req.body, { fields: ['name'] })
            res.send(brand.get({ plain: true }))
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async getBrands(req, res) {
        try {
            const brands = await Brand.findAll({ attributes: ['id', 'name'], order: [['name', 'ASC']] })
            res.send(brands)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async getBrandsByName(req, res) {
        try {
            const brands = await Brand.findAll({ where: { name: { [Op.like]: req.query.name } } })
            res.send(brands.get({ plain: true }))
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async getBrandById(req, res) {
        try {
            const brand = await Brand.findById(req.query.id)
            res.send(brand.get({ plain: true }))
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async updateBrand(req, res) {
        try {
            const brand = await Brand.findById(req.body.id)
            const update = await brand.update({ 'name': req.body.name }, { fields: ['name'] })
            res.send({ 'update': update })
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async deleteBrand(req, res) {
        try {
            const brand = await Brand.findById(req.query.id)
            const deleted = await brand.destroy()
            res.send({ 'deleted': deleted })
        } catch (err) {
            res.status(500).send(err)
        }
    }
}