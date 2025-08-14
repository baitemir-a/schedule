import { Model, DataTypes } from "sequelize";
import sequelize from "../db";
import User from "./user-model";

class Journal extends Model { 
    uuid!: string

}
enum Status {
    'ONTIME',
    'LATE',
    'ABSENT'
}

Journal.init(
    {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            references: {
                model: User,
                key: 'uuid'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false
        },
        arrival_time: DataTypes.TIME,
        departure_time: DataTypes.TIME,
        total_time: DataTypes.TIME,
        status: DataTypes.ENUM(...Object.values(Status) as string[]),
        note: DataTypes.STRING
    },
    {
        sequelize,
        modelName: "journal",
    }
);

export default Journal;
