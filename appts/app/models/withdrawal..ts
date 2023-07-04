import { DataTypes, DoubleDataType, Model } from "sequelize";
import { myDatabase } from "../config/database";



export class Withdrawal extends Model {
    declare currency:string;
    declare id: string;
    declare amount: number;
}

Withdrawal.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    }

},{
    sequelize: myDatabase,
    modelName: 'Withdrawal',
    tableName: 'withdrawals'
})