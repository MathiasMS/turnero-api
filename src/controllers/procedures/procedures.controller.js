import Procedures from '../../models/Procedures.js';
import paginateResults from '../../utils/pagination.js';
import Categories from '../../models/Categories.js';
import boom from 'boom';
import sequelize from '../../db/index.js';
import { QueryTypes, Op } from 'sequelize';
import ProceduresAvailability from '../../models/ProceduresAvailability.js';
import moment from 'moment'

export const getAllPaginated = async (req, res, next) => {
    try {
        const procedures = await Procedures.findAndCountAll({
            where: { deletedAt: null },
            include: 'category'
        })
        res.send(paginateResults(procedures))
    } catch (e) {
        next(e);
    }
}


const test = ({ data, requestedPage, limit = 15, count = null }) => {
    if (!requestedPage === null) {
        return {
            items: data,
            count: 0,
            paging: {
                total: null,
                next: null,
                previous: null,
                current: null,
            },
        };
    }

    const totalPages = Math.ceil(count / limit) - 1;

    let currentPage = 1;

    if (requestedPage) {
        currentPage = Number(requestedPage);
    }

    const nextPage = currentPage >= totalPages
        ? null
        : Number(currentPage) + 1;

    const previousPage = currentPage >= 1
        ? Number(currentPage) - 1
        : null;

    return {
        items: data,
        count,
        paging: {
            total: totalPages,
            next: nextPage,
            previous: previousPage,
            current: currentPage,
        },
    };
};

export const getAllProceduresAvailability = async (req, res, next) => {
    try {
        const procedureId = req.params.id
        const { page = 0, limit = 7, fromDate, toDate } = req.query

        const formattedFromDate = moment(fromDate).format('YYYY-MM-DD')
        const formattedToDate = moment(toDate).format('YYYY-MM-DD')

        const proceduresAvailability = await sequelize.query(`
            select date, json_agg(distinct (hour)) AS hours
                from procedures_availability
                    where procedure_id = ?
                      and is_taken = false
                      and date >= ?
                      and date <= ?
                    group by date 
                        order by date 
                            limit ? offset ?
        `, {
            replacements: [procedureId, formattedFromDate, formattedToDate, parseInt(limit), parseInt(page) * parseInt(limit)],
            type: QueryTypes.SELECT
        })

        const counter = await sequelize.query(`
            select count(*) from (
                                     select date, json_agg(distinct (hour)) AS hours
                                     from procedures_availability
                                     where procedure_id = ?
                                       and is_taken = false
                                       and date >= ?
                                       and date <= ?
                                     group by date
                                     order by date
                                 ) as count
        `, {
            replacements: [procedureId, formattedFromDate, formattedToDate],
            type: QueryTypes.SELECT
        })

        const count = counter[0].count
        const pageCount = count <= 7 ? 1 : Math.ceil(count / 7)

        res.send({
            proceduresAvailability,
            count: pageCount
        })
    } catch (e) {
        next(e);
    }
}

export const getAll = async (req, res, next) => {
    try {
        const categoryId = req.query.category

        const procedures = await Procedures.findAll({
            where: { deletedAt: null, categoryId },
        })

        res.send(procedures)
    } catch (e) {
        next(e);
    }
}

export const getOne = async (req, res, next) => {
    try {
        const procedureId = req.params.id

        const existingProcedure = await Procedures.findOne({ include: 'proceduresAvailabilities', where: { id: procedureId, deletedAt: null} })

        if(!existingProcedure) {
            throw boom.badRequest('Esa tramite no existe.');
        }

        const proceduresAvailabilities = await ProceduresAvailability.findAll({
            attributes: ['hour', 'date'],
            group: ['hour', 'date'],
            where: { procedureId }
        })

        const selectedDays = {}

        for (const proceduresAvailability of proceduresAvailabilities) {
            const { hour, date } = proceduresAvailability
            if(selectedDays[date]) {
                selectedDays[date].push(hour)
            } else {
                selectedDays[date] = [hour]
            }
        }

        res.send({
            name: existingProcedure.name,
            description: existingProcedure.description,
            categoryId: existingProcedure.categoryId,
            fromDate: existingProcedure.fromDate,
            toDate: existingProcedure.toDate,
            selectedDays
        })
    } catch (e) {
        next(e);
    }
}

// export const getAvailability = async (req, res, next) => {
//     try {
//         const procedureId = req.params.id
//
//         const proceduresAvailabilities = await ProceduresAvailability.findAll({
//             attributes: ['hour', 'date'],
//             group: ['hour', 'date'],
//             where: { id: procedureId }
//         })
//
//         res.send(proceduresAvailabilities)
//     } catch (e) {
//         next(e);
//     }
// }

export const create = async (req, res, next) => {
    try {
        const procedure = req.body

        const existingProcedure = await Procedures.findOne({ where: { name: procedure.name, deletedAt: null } })

        if(existingProcedure) {
            throw boom.badRequest('Ya existe un tramite con ese nombre.');
        }

        const selectedDays = procedure.selectedDays

        delete procedure.selectedDays

        const existingCategory = await Categories.findOne({ where: { id: procedure.categoryId, deletedAt: null } })

        if(!existingCategory) {
            throw boom.badRequest('No existe una categoria con ese nombre.');
        }

        const createdProcedure = await Procedures.create(procedure, { returning: true })

        for (const day in selectedDays) {
            const hours = selectedDays[day]
            for (const hour of hours) {
               for (let i = 0; i < existingCategory.quota; i++) {
                    await ProceduresAvailability.create({
                        procedureId: createdProcedure.id,
                        hour,
                        date: day
                    })
                }
            }

        }

        res.send(createdProcedure)
    } catch (e) {
        next(e);
    }
}
export const update = async (req, res, next) => {
    try {
        const procedureId = req.params.id
        const procedure = req.body

        const existingProcedure = await Procedures.findOne({ where: { id: procedureId, deletedAt: null } })

        if(!existingProcedure) {
            throw boom.badRequest('Ese tramite no existe.');
        }

        const existingProcedureWithName = await Procedures.findOne({ where: { id: { [Op.not]: procedureId}, name: procedure.name, deletedAt: null } })

        if(existingProcedureWithName) {
            throw boom.badRequest('Ya existe un tramite con ese nombre.');
        }

        const updatedProcedure = await Procedures.update(procedure, { where: { id: existingProcedure.id }, returning: true})

        res.send(updatedProcedure)
    } catch (e) {
        next(e);
    }
}

export const remove = async (req, res, next) => {
    try {
        const procedureId = req.params.id

        const existingProcedure = await Procedures.findOne({ where: { id: procedureId, deletedAt: null} })

        if(!existingProcedure) {
            throw boom.badRequest('Ese tramite no existe.');
        }

        const today = new Date()

        const deletedProcedure = await Procedures.update({ deletedAt: today }, { where: { id: procedureId }, returning: true})

        res.send(deletedProcedure)
    } catch (e) {
        next(e);
    }
}
