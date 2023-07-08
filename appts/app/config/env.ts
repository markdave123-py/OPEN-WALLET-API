import dotenv from "dotenv";

dotenv.config();

export const config = Object.freeze({
    // PORT
    port: process.env.PORT || 3500,

    // DATABASE
    db: {
        name: process.env.DATABASE_NAME as string,
        user: process.env.DATABASE_USER as string,
        password: process.env.DATABASE_PASSWORD as string,
        host: process.env.DATABASE_HOST as string,
        database_port: process.env.DATABASE_PORT as string,
        database_dialect: process.env.DATABASE_DIALECT as string,
        port: parseInt(process.env.DATABASE_PORT!)
        

    },
    ApiKey: process.env.API_KEY as string,

});

