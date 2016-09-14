"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Viaje = sequelize.define("Viaje", {
    deletedAt: DataTypes.DATE, 
    fechaInicio:DataTypes.INTEGER,
    fechaFin:DataTypes.INTEGER,
    origen:DataTypes.STRING,
    destino:DataTypes.STRING

}, {
    classMethods: {

        associate: function(models) {
            Viaje.belongsTo(models.Vehiculo, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
            Viaje.belongsTo(models.Usuario, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }}; //cliente
          


        },
        getById: function(id) {
            return Viaje.findById(id);
        },
        crear: function(usuario,viaje){
           return sequelize.model("Vehiculo").getById(viaje.VehiculoId).then(function(vehiculo){
                if(usuario.AgenciumId != vehiculo.AgenciumId){
                    throw "Error, intento de violacion a la integridad del sistema, sera reportado";
                }
                return Viaje.build(viaje).save();

            })

          
        }
        
     


    }


});

return Viaje;
};