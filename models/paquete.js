"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {

var Paquete = sequelize.define("Paquete", {
    deletedAt: DataTypes.DATE, 
    imagenDestacada:DataTypes.STRING,
    nombre:DataTypes.STRING,
    descripcion:DataTypes.STRING(3000),
    tarifaAdulto:DataTypes.INTEGER,
    noIncluye:DataTypes.ARRAY(DataTypes.STRING),
    recomendaciones:DataTypes.STRING(3000),
    reviews:DataTypes.ARRAY(DataTypes.JSON),
    descuento:DataTypes.INTEGER,
    desayunos:{type:DataTypes.INTEGER,defaultValue:0},
    almuerzos:{type:DataTypes.INTEGER,defaultValue:0},
    cenas:{type:DataTypes.INTEGER,defaultValue:0},
    snacksManana:{type:DataTypes.INTEGER,defaultValue:0},
    snacksTarde:{type:DataTypes.INTEGER,defaultValue:0},
    activo:{type:DataTypes.BOOLEAN,defaultValue:true},
    tarifa:DataTypes.INTEGER



}, {
    classMethods: {
        associate: function(models) {          
            Paquete.belongsToMany(models.Destino,{ onDelete: 'cascade', as: 'PaqueteDestinos', through:'Paquete_Destino'});
        },
        getById: function(id) {
            return Paquete.findById(id);
        },
        buscarPorNombre : function(nombre){
           return  Paquete.findOne({where:{nombre:nombre}});
        },
        list: function() {
            return Paquete.findAll(
             { order: 'nombre', 
                include: [
                 {model: sequelize.model('Destino'),as:'PaqueteDestinos'}
                ]
            });
        },
        crear : function(paquete,agenciaId){
            paquete.AgenciumId=agenciaId;
            return  Paquete.findOne({where:{nombre:paquete.nombre}}).then(function(resultado){
                if(!resultado){
                    return Paquete.build(paquete).save().then(function(paqueteInstancia){
                        return paqueteInstancia.setPaqueteDestinos(paquete.destinos)
                    });
                }
                else{
                    throw "Error ya existe una paquete con ese nombre";
                }   



            })
        },
        actualizar: function(paquete){
           return Paquete.update(paquete,{
                  where:{
                    id:paquete.id
                  }
                }).then(function(){
                  return  Paquete.findById(paquete.id).then(function(paqueteInstancia){
                         return paqueteInstancia.setPaqueteDestinos(paquete.destinos)
                    });
                }); 
        }
        
     


    }


});

return Paquete;
};