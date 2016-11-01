"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Referencia = sequelize.define("Referencia", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING

}, {
    classMethods: {

        associate: function(models) {
            Referencia.belongsTo(models.Marca, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};      
        },
        getById: function(id) {
            return Referencia.findById(id);
        },
        list: function() {
            return Referencia.findAll();
        },
        buscarPorNombre : function(nombre){
           return  Referencia.findOne({where:{nombre:nombre}});
        },
        crear : function(nombre){
            return  Referencia.buscarPorNombre(nombre).then(function(resultado){
                if(!resultado){
                    return Referencia.build({nombre:nombre}).save();
                }
                else{
                    throw "Error ya existe una agencia con ese nombre";
                }   



            })
        }
        
     


    }


});

return Referencia;
};