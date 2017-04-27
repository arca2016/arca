"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var TarifaPorHora = sequelize.define("TarifaPorHora", {
    deletedAt: DataTypes.DATE, 
    valorPorHora:DataTypes.DOUBLE,
    tiempoMinimo:DataTypes.INTEGER,
    tiempoMaximo:DataTypes.INTEGER,
    capacidadDelVehiculo: DataTypes.INTEGER,
    

}, {
    classMethods: {

     
        getById: function(id) {
            return TarifaPorHora.findOne({ where: {id: id} });
        },
        crear: function(tarifaPorHora){
            
            return TarifaPorHora.create(tarifaPorHora);
        },
        listar: function(){

            return TarifaPorHora.findAll({ include: [{ all: true }]});
        },
        listarPorCapacidadDelVehiculo: function(capacidad){

           
            return TarifaPorHora.findAll({ 
                where: {capacidadDelVehiculo: capacidad}
            });
             
            
        },
        actualizar: function(tarifaPorHora){

           return TarifaPorHora.update(tarifaPorHora,{
                  where:{
                    id:tarifaPorHora.id
                  }
                }); 
        }
        
     


    }


});

return TarifaPorHora;
};