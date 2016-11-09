"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Documento = sequelize.define("Documento", {
    deletedAt: DataTypes.DATE, 
    imagen:DataTypes.STRING,
    fechaExpiracion: DataTypes.DATE,
    uuid : {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV1}

}, {
    classMethods: {

        associate: function(models) {
            Documento.belongsTo(models.Vehiculo, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
            Documento.belongsTo(models.Usuario, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
        },
        getById: function(id) {
            return Documento.findById(id);
        },
        getByUUID: function(uuid) {
            return Documento.findOne({ 
              where:{  
                uuid: uuid
              }
            }); 
        },
        guardar: function(documento){

            return Documento.create(documento);
        },
        guardar: function(documento){

           return Documento.update(documento,{
                  where:{
                    uuid:documento.uuid
                  }
                }); 
        }
        
     


    }


});

return Documento;
};