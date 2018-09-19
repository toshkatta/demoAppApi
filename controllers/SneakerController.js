const Sneaker = require('../models').sneaker
const Brand = require('../models').brand
const Gender = require('../models').gender
const Type = require('../models').type
const Size = require('../models').size

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const gm = require('gm')
const fs = require('fs')

const availableSizes = [35, 35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 40, 41, 41.5, 42, 42.5, 43, 44, 45, 45.5, 46, 46.5, 47, 47.5, 48, 48.5, 49, 50, 51]

module.exports = {
    async createSneaker(req, res) {
        try {
            const brandId = req.body.brandId
            const typeId = req.body.typeId
            const genderId = req.body.brandId
            const sizes = req.body.sizes
            const sizeIds = []
            const images = req.body.images

            if (!brandId || typeof brandId !== 'number') throw { 'brand': 'brandId is required.' }
            if (!genderId || typeof genderId !== 'number') throw { 'gender': 'genderId is required.' }
            if (!typeId || typeof typeId !== 'number') throw { 'type': 'typeId is required.' }
            if (!sizes || sizes.constructor !== Array || !sizes.length) throw { 'sizes': 'sizes is required.' }
            if (!images || images.constructor !== Array || !images.length) throw { 'images': 'images is required.' }

            for (let size of sizes) {
                if (!size || typeof size !== 'number') throw { 'size': size + ' is not a number.' }
                if (availableSizes.indexOf(size) === -1) throw { 'size': size + ' is not an available size. Standart EU sizes are: ' + availableSizes.join(', ') }

                sizeIds.push(availableSizes.indexOf(size))
            }

            const brand = await Brand.findById(brandId)
            if (!brand) throw { 'brand': 'Brand with id = ' + brandId + ' not found.' }

            const gender = await Gender.findById(genderId)
            if (!gender) throw { 'gender': 'Gender with id = ' + genderId + ' not found.' }

            const type = await Type.findById(typeId)
            if (!type) throw { 'type': 'Type with id = ' + typeId + ' not found.' }

            const sneaker = await Sneaker.create({ 'name': req.body.name, 'brandId': brandId, 'typeId': typeId, 'genderId': genderId })
            const imgPathId = 'uploads/sneakers/' + sneaker.dataValues.id
            const imagesPath = await sneaker.update({ 'images': imgPathId }, { fields: ['images'] })
            const dirExists = await fs.existsSync(imgPathId)
            if (!dirExists) {
                await fs.mkdirSync(imgPathId);
            }

            for (let image of images) {
                if (!image || typeof image !== 'string') throw { 'image': image + ' is not a string.' }

                let newPath = './' + imgPathId + image.split('temp')[1]
                fs.rename(image, newPath, (err) => {
                    if (err) throw err
                    console.log('image rename complete')
                })
            }

            const associatedSizes = await sneaker.setSizes(sizeIds)

            res.send(sneaker.get({ plain: true }))
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async getSneakers(req, res) {
        try {
            const sneakers = await Sneaker.findAll(
                {
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    include: [
                        { model: Brand, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                        { model: Type, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                        { model: Gender, attributes: { exclude: ['createdAt', 'updatedAt'] } },
                        { model: Size, attributes: ['id', 'eu'], through: { attributes: [] } } // through: { attributes: [] } removes createdAt and updatedAt
                    ]
                })

            res.send(sneakers)
        } catch (err) {
            console.log('error: ', err)
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
            const brand = await Brand.findById(req.body.id)
            const deleted = await brand.destroy()
            res.send({ 'deleted': deleted })
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async checkModelExists(req, res) {
        try {
            const sneaker = await Sneaker.findOne({
                where: {
                    $and: [
                        {
                            'typeId': req.body.typeId,
                            'genderId': req.body.genderId,
                            'brandId': req.body.brandId
                        },
                        Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), Sequelize.fn('lower', req.body.name))
                    ]
                }
            })

            res.send(sneaker ? true : false)
        } catch (err) {
            res.status(500).send(err)
        }
    },
    async uploadSneakers(req, res) {
        try {
            let file = req.files[0]
            let image = file.destination + file.filename
            gm(file.path)
                .resize(1000, 1000)
                .noProfile()
                .write(file.path, function (err) {
                    if (err) console.log('GM error: ', err)
                })

            res.send({
                'image': image
            })
        } catch (err) {
            console.log('upload sneakers error: ', err)
            res.status(500).send(err)
        }
    }
}