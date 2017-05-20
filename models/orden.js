"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Orden = sequelize.define("Orden", {
    deletedAt: DataTypes.DATE, 
    description:DataTypes.STRING,
    referenceCode:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
    amount:DataTypes.INTEGER,
    signature:DataTypes.STRING,
    buyerEmail:DataTypes.STRING,
    status:DataTypes.STRING,

}, {
    classMethods: {

        associate: function(models) {           
        },
        getById: function(id) {
            return Orden.findById(id);
        },
        getByReferenceCode: function(referenceCode) {
            return Orden.findOne({ 
              where:{  
                referenceCode: referenceCode
              }
            }); 
        },
        crear: function(orden){
            return Orden.create(orden);
        },
        actualizar: function(referenceCode){

           return Orden.update(orden,{
                  where:{
                    referenceCode:orden.referenceCode
                  }
                }); 
        },
        list: function() {
            return Orden.findAll();
        }
        

    }


});

return Orden;
};