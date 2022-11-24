import { DataTypes } from 'sequelize'
import sequelize from '../db/index.js';

const ProceduresAvailability = sequelize.define('ProceduresAvailability', {
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        autoIncrement: true
    },
    procedureId: {
        field: 'procedure_id',
        type: DataTypes.UUID,
        allowNull: false,
    },
    isTaken: {
        type: DataTypes.BOOLEAN,
        field: 'is_taken'
    },
    appointmentNumber: {
        type: DataTypes.STRING,
        field: 'appointment_number'
    },
    email: {
        type: DataTypes.STRING,
    },
    hour: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.DATE,
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
    tableName: "procedures_availability",
});

export default ProceduresAvailability
