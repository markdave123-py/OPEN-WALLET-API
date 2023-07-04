import { DataTypes, Model } from "sequelize";
import { myDatabase } from "../config/database";



export class User extends Model {
    declare password:string;
    declare id: string;
    declare email: string;
    declare lastName: string;
    declare firstName: string;
}

User.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }, 
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }

},{
    sequelize: myDatabase,
    modelName: 'User',
    tableName: 'users'
})