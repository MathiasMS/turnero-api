import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    username: "postgres",
    password: 1234,
    database: 'turnero',
    dialect: "postgres",
    host: "localhost",
    port: 5432,
})


export const getPSQLConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default sequelize

