import { DataTypes } from 'sequelize'
import sequelize from '../db/index.js';
import ProceduresAvailability from './ProceduresAvailability.js';
import Categories from './Categories.js';

const Procedures = sequelize.define('procedures', {
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
    },
    fromDate: {
        type: DataTypes.DATE,
        field: 'from_date',
    },
    toDate: {
        type: DataTypes.DATE,
        field: 'to_date',
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
    },
    deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at',
    },
}, {
    tableName: "procedures",
});

Procedures.belongsTo(Categories, {
    as: "category",
    foreignKey: "categoryId",
})

Procedures.hasMany(ProceduresAvailability, {
    as: 'proceduresAvailabilities',
    foreignKey: 'procedureId'
})

export default Procedures
