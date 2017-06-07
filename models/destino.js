"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {

var Destino = sequelize.define("Destino", {
    deletedAt: DataTypes.DATE, 
    nombre:DataTypes.STRING,
    descripcion:DataTypes.STRING(3000),
    ubicacion:DataTypes.STRING,
    imagenes:DataTypes.ARRAY(DataTypes.STRING),
    esMunicipio : {type:DataTypes.BOOLEAN, defaultValue:false},

    //lugaresDestacados:DataTypes.ARRAY(DataTypes.JSON),
    comentarios:DataTypes.ARRAY(DataTypes.JSON)

}, {
    classMethods: {
        associate: function(models) {          
            Destino.belongsToMany(models.Paquete,{ onDelete: 'cascade', as: 'DestinoPaquetes', through:'Paquete_Destino'});
        },
        getById: function(id) {
            return Destino.findById(id);
        },
        buscarPorNombre : function(nombre){
           return  Destino.findOne({where:{nombre:nombre}});
        },
        listaMunicipios: function(agenciaId) {
            return Destino.findAll({ where:{esMunicipio:true}});
        },
        listaEmblematicos: function(agenciaId) {
            return Destino.findAll({ where:{   $or: [{esMunicipio:false},{esMunicipio:null}]}});
        },
        list: function(agenciaId) {
            return Destino.findAll({ order: 'nombre'});
        },
        crear : function(destino,agenciaId){
            destino.AgenciumId=agenciaId;
            return  Destino.findOne({where:{nombre:destino.nombre}}).then(function(resultado){
                if(!resultado){
                    return Destino.build(destino).save();
                }
                else{
                    throw "Error ya existe una destino con ese nombre";
                }   



            })
        },
        actualizar: function(destino){
           return Destino.update(destino,{
                  where:{
                    id:destino.id
                  }
                }); 
        }
        
     


    }


});

return Destino;
};