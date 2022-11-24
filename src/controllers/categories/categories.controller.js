import Categories from '../../models/Categories.js';
import paginateResults from '../../utils/pagination.js';
import boom from 'boom';
import { Op } from 'sequelize'

export const getAll = async (req, res, next) => {
    try {
        const categories = await Categories.findAndCountAll({
            where: { deletedAt: null }
        })
        res.send(paginateResults(categories))
    } catch (e) {
        next(e);
    }
}

export const getOne = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        const existingCategory = await Categories.findOne({ where: { id: categoryId, deletedAt: null} })

        if(!existingCategory) {
            throw boom.badRequest('Esa categoría no existe.');
        }

        res.send(existingCategory)
    } catch (e) {
        next(e);
    }
}

export const create = async (req, res, next) => {
    try {
        const category = req.body

        const existingCategory = await Categories.findOne({ where: { name: category.name, deletedAt: null } })

        if(existingCategory) {
            throw boom.badRequest('Ya existe una categoria con ese nombre.');
        }

        const categories = await Categories.create(category)

        res.send(categories)
    } catch (e) {
        next(e);
    }
}

export const update = async (req, res, next) => {
    try {
        const categoryId = req.params.id
        const category = req.body

        const existingCategory = await Categories.findOne({ where: { id:  categoryId }, deletedAt: null  })

        if(!existingCategory) {
            throw boom.badRequest('Esa categoría no existe.');
        }

        const existingCategoryWithName = await Categories.findOne({ where: { id: { [Op.not]: category.id}, name: category.name, deletedAt: null } })

        if(existingCategoryWithName) {
            throw boom.badRequest('Ya existe una categoria con ese nombre.');
        }

        const updatedCategory = await Categories.update(category, { where: { id: existingCategory.id }, returning: true})

        res.send(updatedCategory)
    } catch (e) {
        next(e);
    }
}

export const remove = async (req, res, next) => {
    try {
        const categoryId = req.params.id

        const existingCategory = await Categories.findOne({ where: { id: categoryId, deletedAt: null} })

        if(!existingCategory) {
            throw boom.badRequest('Esa categoría no existe.');
        }

        const today = new Date()

        const deletedCategory = await Categories.update({ deletedAt: today}, { where: { id: categoryId }, returning: true})

        res.send(deletedCategory)
    } catch (e) {
        next(e);
    }
}
