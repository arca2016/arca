"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {

var Tag = sequelize.define("Tag", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING,
    uuid:{type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4},

}, {
    classMethods: {

        associate: function(models) {
            Tag.belongsTo(models.Agencia);
            Tag.belongsToMany(models.Vehiculo, { through: 'TagVehiculo' })
        },
        getById: function(id) {
            return Tag.findById(id);
        },
        buscar : function(atributos){
           atributos = atributos || {};
           return  Tag.findOne({where:atributos});
        },
        listar: function(atributos) {
            atributos = atributos || {};
            return Tag.findAll({ where:atributos});
        },
        eliminar: function(options){
            return Tag.buscar(options)
                .then(function(tag){
                    if(!tag){
                        Promise.reject("Tag no encontrado")
                    }
                    else{
                        return tag.destroy().then(function(result){
                            return(result);
                        })
                    }
                });
        },
        crear: function(tag){
            return Tag.build(tag).save();
            
        },
        actualizar:function(tag){
             return Tag.update(tag,{
                  where:{
                    uuid:tag.uuid
                  }
                });
        }
        
     


    }


});

return Tag;
};