import Procedures from '../../models/Procedures.js';
import boom from 'boom';
import sequelize from '../../db/index.js';
import { QueryTypes, Op } from 'sequelize';
import ProceduresAvailability from '../../models/ProceduresAvailability.js';
import moment from 'moment'
import Categories from '../../models/Categories.js';

export const confirmAppointment = async (req, res, next) => {
    try {
        const { procedureId, hour, date, email } = req.body
        const procedure = await Procedures.findOne({
            where: { deletedAt: null, id: procedureId },
        })

        if(!procedure) {
            throw boom.badRequest('Esa tramite no existe.');
        }

        const procedureAvailability = await ProceduresAvailability.findOne({
            where: { procedureId, hour, date, isTaken: false},
        })

        if(!procedureAvailability) {
            throw boom.badRequest('Ya no hay turnos disponibles en ese horario.');
        }

        const [data] = await sequelize.query(`select MAX(appointment_number) as maxOrderNumber from procedures_availability`)
        const max = data[0].maxordernumber || '0'

        const newMax = parseInt(max) + 1

        await ProceduresAvailability.update({ isTaken: true, appointmentNumber: newMax, email}, { where: { id: procedureAvailability.id }, returning: true})

        res.send({
            date,
            hour,
            procedure: procedure.name,
            appointmentNumber: newMax
        })
    } catch (e) {
        next(e);
    }
}

export const cancelAppointment = async (req, res, next) => {
    try {
        const { number } = req.body

        console.log("HOLA")
        const proceduresAvailability = await ProceduresAvailability.findOne({
            where: { appointmentNumber: number },
        })
        console.log("CHAU")
        if(!proceduresAvailability) {
            throw boom.badRequest('Ese numero de turno no existe.');
        }

        console.log(proceduresAvailability.procedureId)

        await ProceduresAvailability.update({ isTaken: false, email: ''}, { where: { id: proceduresAvailability.id }, returning: true})

        const procedure = await Procedures.findOne({
            where: { id: proceduresAvailability.procedureId },
        })

        if(!procedure) {
            throw boom.badRequest('Ese tramite no existe.');
        }

        res.send({
            date: proceduresAvailability.date,
            hour: proceduresAvailability.hour,
            procedure: procedure.name,
        })
    } catch (e) {
        next(e);
    }
}

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
                      and date >= ?
                      and date <= ?
                    group by date 
                        order by date 
                            limit ? offset ?
        `, {
            replacements: [procedureId, formattedFromDate, formattedToDate, limit, page],
            type: QueryTypes.SELECT
        })

        res.send(proceduresAvailability)
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
