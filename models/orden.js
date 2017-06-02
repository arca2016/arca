"use strict";

var models  = require(__dirname);
var Q = require('q')
var md5 = require('md5');
var payUConfiguration = require('../config/payU.json')[process.env.NODE_ENV]
var config = require('../config/aws.json');
var aws = require('aws-sdk');
aws.config = new aws.Config(config);
var ses = new aws.SES();

module.exports = function(sequelize, DataTypes) {
var Orden = sequelize.define("Orden", {
    deletedAt: DataTypes.DATE,
    description:DataTypes.STRING,
    referenceCode:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
    buyerName:DataTypes.STRING,
    buyerPhone:DataTypes.STRING,
    buyerEmail:DataTypes.STRING,
    amount:DataTypes.INTEGER,
    signature:DataTypes.STRING,
    status:DataTypes.STRING,
    passengers:DataTypes.ARRAY(DataTypes.JSON),
    fechaInicio:DataTypes.DATE,
    fechaFin:DataTypes.DATE,
    origen:DataTypes.INTEGER,
    destino:DataTypes.INTEGER,
    capacidadSolicitado:DataTypes.INTEGER


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
        getPassengersByReferenceCode: function(referenceCode) {
            return Orden.findOne({ 
              attributes: ['referenceCode', 'passengers'],
              where:{  
                referenceCode: referenceCode
              }
            }); 
        },

        crear: function(orden){
            orden.status="Pendiente";
            return Orden.create(orden).then(function(newOrderInsance){
                var plainNewOrder = newOrderInsance.dataValues;
                var stringForSignature = payUConfiguration.Apikey+"~"+payUConfiguration.merchantId+"~"+plainNewOrder.referenceCode+"~"+orden.amount+"~COP";
                plainNewOrder.signature=md5(stringForSignature)
                return plainNewOrder;
            });
        },
        sendConfirmationEmail:function(destination,orderReference){
              var template = fs.readFileSync('templates/mail/transaccionExitosa.ejs', 'utf8');
			            email = ejs.render(template,{orderReference:orderReference});
                        ses.sendEmail({
                            Source:config.from,
                            Destination: { ToAddresses: [destination] },
                            Message: {
                                Subject: {
                                    Data: 'Transaccion exitosa!'
                                },
                                Body: {
                                    Html: {
                                        Data: email
                                    }
                                }
                            }
                        },function(status){
                            deferred.resolve(cobrable);
                        })
        },
        actualizar: function(referenceCode){
           return Orden.update(orden,{
                  where:{
                    referenceCode:orden.referenceCode
                  }
                });
        },
        updatePassengers: function(order){
           return Orden.update({passengers:order.passengers},{
                  where:{
                    referenceCode:order.referenceCode
                  }
                }); 
        },
        list: function() {
            return Orden.findAll({order: [['updatedAt', 'DESC']]});
        }


    }


});

return Orden;
};
