"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Documento = sequelize.define("Documento", {
    deletedAt: DataTypes.DATE, 
    imagen:DataTypes.STRING,
    fechaExpiracion: DataTypes.DATE

}, {
    classMethods: {

        associate: function(models) {
            Documento.belongsTo(models.Vehiculo, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
            Documento.belongsTo(models.Usuario, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
        },
        getById: function(id) {
            return Documento.findById(id);
        }
        
     


    }


});

return Documento;
};