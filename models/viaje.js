"use strict";

var models  = require(__dirname);
var Q = require('q')
var Promise = require("bluebird");


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

                var listaViajesPromesa = []
                return  sequelize.model("Vehiculo").filtrar({id:vehiculoId}).then(function(vehiculo){ //busco el vehiculo
                    vehiculo = vehiculo[0]
                    return  sequelize.model("DiaFestivo").listDiaFestivo().then(function(festivos){ // listo los festivos
                        var festivosNoTrabajables =[];
                        var fechaAEvaluar = fechaInicio;
                        var diaDespuesDeUltimaFecha = new Date(fechaFin);
                        diaDespuesDeUltimaFecha.setDate(diaDespuesDeUltimaFecha.getDate()+1);
                        while(fechaAEvaluar.toDateString()!= diaDespuesDeUltimaFecha.toDateString()){

                            if(diasDeLaSemana.indexOf(fechaAEvaluar.getDay()) >= 0){ // si la reserva se trabaja ese dia

                                listaViajesPromesa.push( sequelize.model("DiaFestivo").esDiaFestivo(new Date(fechaAEvaluar),festivos).then(function(esFestivo){
                                    console.log(esFestivo.dia);

                                     if(!esFestivo.result ||(esFestivo.result&& incluyeFestivos) ) { // si no es festivo o si trabaja los festivos
                                     var fechaInicioViaje= esFestivo.dia;
                                     var fechaFinalViaje = new Date(fechaInicioViaje.getTime());
                                     fechaFinalViaje.setSeconds(fechaFinalViaje.getSeconds()+tiempoDeViaje);
                                     if(vehiculo.estaDisponible(fechaInicioViaje,fechaFinalViaje)){// si esta disponible en esa fecha
                                     return {UsuarioId:usuario.id,fechaInicio:esFestivo.dia,fechaFin:fechaFinalViaje,origen:"aca",destino:"alla","VehiculoId":vehiculoId};
                                     }
                                     else{
                                         throw Error("No esta disponible para la fecha " + fechaInicioViaje);

                                         }
                                     }
                                     else{
                                     console.log("esta fecha no es habil y no traba los festivos " + esFestivo.dia);
                                         festivosNoTrabajables.push(esFestivo.dia)
                                     return undefined;
                                     }

                                }))
                            }

                            fechaAEvaluar.setDate(fechaAEvaluar.getDate()+1); // avanzo hacia el siguiente dia

                        }
                        return Promise.all(listaViajesPromesa).then(function (viajes) {
                            var viajesFactibles = [];
                            for (var i = viajes.length - 1; i >= 0; i--) {
                                if(viajes[i]){
                                    viajesFactibles.push(viajes[i]);
                                }
                            }

                            return  Viaje.bulkCreate(viajesFactibles).then(function(result) {
                                var response={reservasCreadas:result,festivosNoTrabajables:festivosNoTrabajables}
                                return(response)
                            })
                        })
                    })




                }).catch(function(err){
                    console.dir(err.message)
                    return err.message;
                })
            }






        }


    });

    return Viaje;
};
