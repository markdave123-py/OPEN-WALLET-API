import { Sequelize } from "sequelize";
import { config } from "./env";


export const myDatabase = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
        logging: true,
        host: config.db.host,
        dialect: 'postgres',
    },
)