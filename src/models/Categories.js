import { DataTypes } from 'sequelize'
import sequelize from '../db/index.js';

const Categories = sequelize.define('Categories', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fraction: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    quota: {
        type: DataTypes.NUMBER,
        allowNull: false
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
    tableName: "categories",
});

export default Categories
