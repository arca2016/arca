"use strict";

var models  = require(__dirname);
var Q = require('q')
var md5 = require('md5');
var payUConfiguration = require('../config/payU.json')[process.env.NODE_ENV]

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
            return Orden.create(orden).then(function(newOrderInsance){
                var plainNewOrder = newOrderInsance.dataValues;
                var stringForSignature = payUConfiguration.Apikey+"~"+payUConfiguration.merchantId+"~"+plainNewOrder.referenceCode+"~"+orden.amount+"~COP";
                plainNewOrder.signature=md5(stringForSignature)
                return plainNewOrder;
            });
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