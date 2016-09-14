"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Agencia = sequelize.define("Agencia", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING

}, {
    classMethods: {

        associate: function(models) {
            Agencia.hasMany(models.Vehiculo);
            Agencia.hasMany(models.Usuario);

        },
        getById: function(id) {
            return Agencia.findById(id);
        },
        buscarPorNombre : function(nombre){
           return  Agencia.findOne({where:{nombre:nombre.toUpperCase()}});
        },
        crear : function(nombre){
            return  Agencia.buscarPorNombre(nombre).then(function(resultado){
                if(!resultado){
                    return Agencia.build({nombre:nombre.toUpperCase()}).save();
                }
                else{
                    throw "Error ya existe una agencia con ese nombre";
                }   



            })
        }
        
     


    }


});

return Agencia;
};