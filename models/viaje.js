"use strict";

var models  = require(__dirname);
var Q = require('q')


module.exports = function(sequelize, DataTypes) {
var Viaje = sequelize.define("Viaje", {
    deletedAt: DataTypes.DATE, 
    fechaInicio:DataTypes.DATE,
    fechaFin:DataTypes.DATE,
    origen:DataTypes.STRING,
    destino:DataTypes.STRING

}, {
    classMethods: {

        associate: function(models) {
            Viaje.belongsTo(models.Vehiculo, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
            Viaje.belongsTo(models.Usuario, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }}; //cliente
          


        },
        getById: function(id) {
            return Viaje.findById(id);
        },
        crear: function(usuario,viaje){
            console.dir(viaje);
           return sequelize.model("Vehiculo").getById(viaje.VehiculoId).then(function(vehiculo){
                if(usuario.AgenciumId != vehiculo.AgenciumId){
                    throw "Error, intento de violacion a la integridad del sistema, sera reportado";
                }
                return Viaje.build(viaje).save();

            })          
        },
        crearRecurrente: function(usuario,vehiculoId,fechaInicio,fechaFin,tiempoDeViaje,incluyeFestivos,diasDeLaSemana){
        
        
         return   sequelize.model("Vehiculo").filtrar({id:vehiculoId}).then(function(vehiculo){ //busco el vehiculo
            vehiculo = vehiculo[0]
             return   sequelize.model("DiaFestivo").listDiaFestivo().then(function(festivos){ // listo los festivos
                    var fechaAEvaluar = fechaInicio;
                    while(fechaAEvaluar.toDateString()!= fechaFin.toDateString()){                     
                        if(diasDeLaSemana.indexOf(fechaAEvaluar.getDay()) > 0){ // si la reserva se trabaja ese dia                           
                           sequelize.model("DiaFestivo").esDiaFestivo(fechaAEvaluar,festivos).then(function(esFestivo){
                               
                                if(!esFestivo.result ||(esFestivo.result&& incluyeFestivos) ) { // si no es festivo o si trabaja los festivos
                                    var fechaAEvaluar= esFestivo.dia;
                                    var fechaFinalViaje = new Date(fechaAEvaluar.getTime());
                                    fechaFinalViaje.setSeconds(fechaFinalViaje.getSeconds()+tiempoDeViaje);
                                   if(vehiculo.estaDisponible(fechaAEvaluar,fechaFinalViaje)){// si esta disponible en esa fecha
                                    Viaje.crear(usuario,{fechaInicio:fechaAEvaluar,fechaFin:fechaFinalViaje,origen:"aca",destino:"alla","VehiculoId":vehiculoId}).then(function(v){
                                        console.log("reserva creada")
                                    })
                                    
                                     
                                   }
                                   else{
                                    console.log("no esta disponible para la fecha " + fechaAEvaluar);
                                   } 
                                }
                                else{
                                    console.log("esta fecha no es habil y no traba los festivos " + fechaAEvaluar);
                                }

                            })
                        }
                        fechaAEvaluar = new Date(fechaAEvaluar.setDate(fechaAEvaluar.getDate()+1)); // avanzo hacia el siguiente dia

                    }

                })

 
            }).catch(function(err){
            console.dir(err)
         })
        }


        
     


    }


});

return Viaje;
};