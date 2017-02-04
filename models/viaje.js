"use strict";

var models  = require(__dirname);
var Q = require('q')
var Promise = require("bluebird");
var uuid = require('uuid-v4');
var  STATUS_CANCELADO = 'Cancelado';
var  STATUS_CONFIRMADO =  'Confirmado'
module.exports = function(sequelize, DataTypes) {
    var Viaje = sequelize.define("Viaje", {
        deletedAt: DataTypes.DATE,
        fechaInicio:DataTypes.DATE,
        fechaFin:DataTypes.DATE,
        origen:DataTypes.STRING,
        destino:DataTypes.STRING,
        descripcion:DataTypes.STRING,
        recurrenteId:DataTypes.STRING,
        recurreteFechaInicio:DataTypes.DATE,
        recurreteFechaFin:DataTypes.DATE,
        recurreteDiasDeLaSemana:DataTypes.JSON,
        uuid : {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        estado:{type:DataTypes.ENUM('Confirmado', 'Cancelado'),defaultValue:'Confirmado'},
        valorPagar:DataTypes.DOUBLE,
        valorCobrar:DataTypes.DOUBLE,
        planilla:DataTypes.STRING,
        cliente:DataTypes.STRING,
        solicitante:DataTypes.STRING
    }, {
        classMethods: {

            associate: function(models) {
                Viaje.belongsTo(models.Vehiculo, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
                Viaje.belongsTo(models.Usuario, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }}; //cliente
            },
            getById: function(id) {
                return Viaje.findById(id);
            },
            getByUuid: function(uuid) {
                return Viaje.findOne({
                     where:{uuid: uuid}
                 })
            },
            crear: function(usuario,viaje){
                console.dir(viaje);
                return sequelize.model("Vehiculo").getById(viaje.VehiculoId).then(function(vehiculo){

                    return vehiculo.getViajes(
                                    {where:
                                        {estado:
                                            {$ne:STATUS_CANCELADO}
                                        }
                                    }).then(function (viajes) {


                                    vehiculo.Viajes = viajes;
                                    if(usuario.AgenciumId != vehiculo.AgenciumId){
                                        throw "Error, intento de violacion a la integridad del sistema, sera reportado";
                                    }
                                    if(vehiculo.estaDisponible(viaje.fechaInicio,viaje.fechaFin)){
                                        return Viaje.build(viaje).save();
                                    }
                                    else{
                                        throw Error("Vehiculo no disponible en el rango de fechas dado");
                                    }
                                })





                })
            },
            actualizar:function(viaje){
                 return Viaje.update(viaje,{
                      where:{
                        uuid:viaje.uuid
                      }
                    });
            },
            crearRecurrente: function(usuario,vehiculoId,fechaInicio,fechaFin,tiempoDeViaje,incluyeFestivos,diasDeLaSemana,descripcion){
            	var recurrenteId = uuid();

                var listaViajesPromesa = []
                return  sequelize.model("Vehiculo").filtrar({id:vehiculoId},STATUS_CONFIRMADO).then(function(vehiculo){ //busco el vehiculo
                    vehiculo = vehiculo[0]
                    return  sequelize.model("DiaFestivo").listDiaFestivo().then(function(festivos){ // listo los festivos
                        var festivosNoTrabajables =[];
                        var fechaAEvaluar = fechaInicio;
                        var diaDespuesDeUltimaFecha = new Date(fechaFin);
                        var recurreteFechaInicio = (new Date(fechaInicio))
                        var recurreteFechaFin= (new Date(fechaFin)).setSeconds(new Date(fechaFin).getSeconds()+tiempoDeViaje);
                        diaDespuesDeUltimaFecha.setDate(diaDespuesDeUltimaFecha.getDate()+1);
                        while(fechaAEvaluar.toDateString()!= diaDespuesDeUltimaFecha.toDateString()){

                            if(diasDeLaSemana.indexOf(fechaAEvaluar.getDay()) >= 0){ // si la reserva se trabaja ese dia

                                listaViajesPromesa.push( sequelize.model("DiaFestivo").esDiaFestivo(new Date(fechaAEvaluar),festivos).then(function(esFestivo){


                                     if(!esFestivo.result ||(esFestivo.result&& incluyeFestivos) ) { // si no es festivo o si trabaja los festivos
                                     var fechaInicioViaje= esFestivo.dia;
                                     var fechaFinalViaje = new Date(fechaInicioViaje.getTime());
                                     fechaFinalViaje.setSeconds(fechaFinalViaje.getSeconds()+tiempoDeViaje);
                                     if(vehiculo.estaDisponible(fechaInicioViaje,fechaFinalViaje)){// si esta disponible en esa fecha
                                     return {UsuarioId:usuario.id,fechaInicio:esFestivo.dia,fechaFin:fechaFinalViaje,"VehiculoId":vehiculoId,recurrenteId:recurrenteId,descripcion:descripcion,recurreteFechaInicio:recurreteFechaInicio,recurreteFechaFin:recurreteFechaFin,recurreteDiasDeLaSemana:diasDeLaSemana};
                                     }
                                     else{
                                         throw Error("El vehiculo tiene compromisos ya asignados para algunas fechas dadas");

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




                })
            }






        },
        instanceMethods:{
            cancelarViaje:function(){
              this.estado = STATUS_CANCELADO;
              return this.save();
            },
            cancelarRecurrentes:function(){
              return Viaje.update(
                {estado:STATUS_CANCELADO},
                {where:{recurrenteId:this.recurrenteId}}
              );
            }

        }


    });

    return Viaje;
};
