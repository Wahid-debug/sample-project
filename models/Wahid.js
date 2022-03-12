const DataTypes = require("sequelize/lib/data-types");
const database = require("../config/database");

const hooks = {
    beforeCreate() {},
};

const Wahid = database.define(
    'Wahid', 
    {
        id: {
			autoIncrement: true,
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
		},
        first_name:{
            type: DataTypes.STRING,
            allowNull:false    
        },
        last_name:{
            type: DataTypes.STRING,
            allowNull: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,      
        },
        phone_no:{
            type: DataTypes.STRING,
            allowNull:false
        }
    },
    {
		tableName: 'WAHID',
		hooks,
    }
)

//Wahid.sync({ alter: true });

module.exports = Wahid;