"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {

var Destino = sequelize.define("Destino", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING

}, {
    classMethods: {
       
        getById: function(id) {
            return Destino.findById(id);
        },
        buscarPorNombre : function(nombre){
           return  Destino.findOne({where:{nombre:nombre}});
        },
        list: function() {
            return Destino.findAll({ order: 'nombre'});
        },
        crear : function(nombre){
            return  Destino.findOne({where:{nombre:nombre}}).then(function(resultado){
                if(!resultado){
                    return Destino.build({nombre:nombre}).save();
                }
                else{
                    throw "Error ya existe una destino con ese nombre";
                }   



            })
        }
        
     


    }


});

return Destino;
};