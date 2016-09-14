    "use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Vehiculo = sequelize.define("Vehiculo", {
    deletedAt: DataTypes.DATE, 
    placa:{type:DataTypes.STRING,unique:true},
    capacidad:DataTypes.INTEGER,
    modelo:DataTypes.INTEGER,
    audio:DataTypes.BOOLEAN,
    video:DataTypes.BOOLEAN,
    aire:DataTypes.BOOLEAN,
    bano:DataTypes.BOOLEAN,
    reclinable:DataTypes.BOOLEAN,
    imagen:DataTypes.STRING,
    marca:DataTypes.STRING,
    referencia:DataTypes.STRING
    

}, {
    classMethods: {

        associate: function(models) {
            Vehiculo.hasMany(models.Documento);
            Vehiculo.hasMany(models.Viaje);
            Vehiculo.hasOne(models.Usuario);


        },
        getById: function(id) {
            return Vehiculo.findById(id);
        },
        crear: function(vehiculo){
            return Vehiculo.build(vehiculo).save();
        },
        actualizar:function(vehiculo){
             return Vehiculo.update(vehiculo,{
                  where:{
                    id:vehiculo.id
                  }
                }); 
        },
        filtrar:function(filtro){
            return Vehiculo.findAll({where:filtro});
        }
        
     


    }


});

return Vehiculo;
};