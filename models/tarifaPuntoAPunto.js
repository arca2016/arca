"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var TarifaPuntoAPunto = sequelize.define("TarifaPuntoAPunto", {
    deletedAt: DataTypes.DATE, 
    valor:DataTypes.DOUBLE,
    numeroDePasajeros: DataTypes.INTEGER,
    

}, {
    classMethods: {

        associate: function(models) {
            TarifaPuntoAPunto.belongsTo(models.Destino, {as: 'Origen'});
            TarifaPuntoAPunto.belongsTo(models.Destino, {as: 'Destino'})
        },
        getById: function(id) {
            return TarifaPuntoAPunto.findOne({ where: {id: id} ,include: [{ all: true }]});
        },
        crear: function(tarifaPuntoAPunto){
            
            return TarifaPuntoAPunto.create(tarifaPuntoAPunto).then(function(nuevaTarifa){
                return TarifaPuntoAPunto.getById(nuevaTarifa.id)
            });
        },
        listar: function(){

            return TarifaPuntoAPunto.findAll({ include: [{ all: true }]});
        },
        actualizar: function(tarifaPuntoAPunto){

           return TarifaPuntoAPunto.update(tarifaPuntoAPunto,{
                  where:{
                    id:tarifaPuntoAPunto.id
                  }
                }); 
        }
        
     


    }


});

return TarifaPuntoAPunto;
};