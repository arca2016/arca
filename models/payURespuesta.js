"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var PayURespuesta = sequelize.define("PayURespuesta", {
    deletedAt: DataTypes.DATE, 

    merchant_id:DataTypes.INTEGER,
    state_pol:DataTypes.STRING,
    risk	:DataTypes.FLOAT,
    response_code_pol	:DataTypes.STRING,
    reference_sale	:DataTypes.STRING,
    reference_pol	:DataTypes.STRING,
    sign	:DataTypes.STRING,
    extra1	:DataTypes.STRING,
    extra2	:DataTypes.STRING,
    payment_method	:DataTypes.INTEGER,
    payment_method_type	:DataTypes.INTEGER,
    installments_number	:DataTypes.INTEGER,
    value	:DataTypes.FLOAT,
    tax	:DataTypes.FLOAT,
    additional_value	:DataTypes.FLOAT,
    transaction_date	:DataTypes.DATE,
    currency	:DataTypes.STRING,
    email_buyer	:DataTypes.STRING,
    cus	:DataTypes.STRING,
    pse_bank	:DataTypes.STRING,
    test	:DataTypes.BOOLEAN,
    description	:DataTypes.STRING,
    billing_address	:DataTypes.STRING,
    shipping_address	:DataTypes.STRING,
    phone	:DataTypes.STRING,
    office_phone		:DataTypes.STRING,
    account_number_ach		:DataTypes.STRING,
    account_type_ach		:DataTypes.STRING,
    administrative_fee		:DataTypes.FLOAT,
    administrative_fee_base		:DataTypes.FLOAT,
    airline_code		:DataTypes.STRING,
    attempts	:DataTypes.INTEGER,
    authorization_code	:DataTypes.STRING,
    bank_id		:DataTypes.STRING,
    billing_city	:DataTypes.STRING,
    billing_country	:DataTypes.STRING,
    commision_pol		:DataTypes.FLOAT,
    commision_pol_currency		:DataTypes.STRING,
    customer_number	:DataTypes.STRING,
    date	:DataTypes.DATE,
    error_code_bank	:DataTypes.STRING,
    error_message_bank	:DataTypes.STRING,
    exchange_rate	:DataTypes.FLOAT,
    ip		:DataTypes.STRING,
    nickname_buyer		:DataTypes.STRING,
    nickname_seller		:DataTypes.STRING,
    payment_method_id			:DataTypes.STRING,
    payment_request_state			:DataTypes.STRING,
    pseReference1			:DataTypes.STRING,
    pseReference2			:DataTypes.STRING,
    pseReference3			:DataTypes.STRING,
    response_message_pol			:DataTypes.STRING,
    shipping_city				:DataTypes.STRING,
    shipping_country			:DataTypes.STRING,
    transaction_bank_id			:DataTypes.STRING,
    transaction_id			:DataTypes.STRING,
    payment_method_name				:DataTypes.STRING


}, {
    classMethods: {

        associate: function(models) {           
        },
        getById: function(id) {
            return PayURespuesta.findById(id);
        },
        getByReferenceSale: function(referenceSale) {
            return PayURespuesta.findOne({ 
              where:{  
                reference_sale: referenceSale
              }
            }); 
        },
        crear: function(payURespuesta){
           return sequelize.model('Orden').getByReferenceCode(payURespuesta.reference_sale).then(function(orderInstance){
                orderInstance.status= payURespuesta.response_message_pol;
                return orderInstance.save().then(function(){
                    if(orderInstance.status=="APPROVED"){
                      sequelize.model('Orden').sendConfirmationEmail(orderInstance.buyerEmail,orderInstance.referenceCode)
                    }
                    return PayURespuesta.create(payURespuesta);
                })
            })
            
        },
        actualizar: function(referenceSale){

           return PayURespuesta.update(payURespuesta,{
                  where:{
                    reference_sale:payURespuesta.referenceSale
                  }
                }); 
        },
        list: function() {
            return PayURespuesta.findAll();
        }
        

    }


});

return PayURespuesta;
};