"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {

var Marca = sequelize.define("Marca", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING

}, {
    classMethods: {

        associate: function(models) {
            Marca.hasMany(models.Referencia);
        },
        getById: function(id) {
            return Marca.findById(id);
        },
        buscarPorNombre : function(nombre){
           return  Marca.findOne({where:{nombre:nombre}});
        },
        list: function() {
            return Marca.findAll({
                     include: [
                         {model: sequelize.model('Referencia')}
                     ]
                 });
        },
        crear : function(nombre){
            return  Marca.buscarPorNombre(nombre).then(function(resultado){
                if(!resultado){
                    return Marca.build({nombre:nombre}).save();
                }
                else{
                    throw "Error ya existe una marca con ese nombre";
                }   



            })
        }
        
     


    }


});

return Marca;
};