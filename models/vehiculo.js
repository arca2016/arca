"use strict";
var moment = require('moment')
var models  = require(__dirname);
var Q = require('q')
var  STATUS_CANCELADO = 'Cancelado';
var  STATUS_CONFIRMADO =  'Confirmado';


module.exports = function(sequelize, DataTypes) {
var Vehiculo = sequelize.define("Vehiculo", {
    deletedAt: DataTypes.DATE,
    placa:{type:DataTypes.STRING,unique:true},
    capacidad:DataTypes.INTEGER,
    modelo:DataTypes.INTEGER,
    audio:DataTypes.BOOLEAN,
    video:DataTypes.BOOLEAN,
    aire:DataTypes.BOOLEAN,
    bano:DataTypes.BOOLEAN,
    reclinable:DataTypes.BOOLEAN,
    wifi:DataTypes.BOOLEAN,
    imagen:DataTypes.STRING,
    marca:DataTypes.STRING,
    referencia:DataTypes.STRING,
    uuid : {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV1},
    relacion:{
      type:   DataTypes.ENUM,
      values: ["Propio","Afiliado","Tercero"]
    },
    activo:{type:DataTypes.BOOLEAN, defaultValue: true},
    tipo:{
      type:   DataTypes.ENUM,
      values: ["Bus","Buseta","Camioneta","Campero","Microbus","Automovil"]
    },
    numeroInterno:DataTypes.STRING,
    fechaAfiliacion:DataTypes.DATE,



}, {
    classMethods: {

        associate: function(models) {
            Vehiculo.hasMany(models.Documento);
            Vehiculo.hasMany(models.Viaje);
            Vehiculo.belongsToMany(models.Tag,{through: 'TagVehiculo'})
            Vehiculo.belongsTo(models.Usuario);
            Vehiculo.belongsTo(models.Usuario,{as:'Propietario'});
        },
        getById: function(id) {
            return Vehiculo.findById(id);
        },
        crear: function(vehiculo){
            vehiculo.placa = vehiculo.placa.toUpperCase();
            return Vehiculo.build(vehiculo).save();
        },
        contar:function(agenciaId){
          return Vehiculo.count({where:{AgenciumId:agenciaId}});
        },
        vehiculoMasSolicitadoYTotalViajes:function(agenciaId){
          return Vehiculo.obtenerconViajesEnRangoDeFechas({AgenciumId:agenciaId}).then(function(vehiculos){
            if(vehiculos.length){
              var totalViajesAgendandados = 0
              var vehiculoMasSolicitado ={}
              var masPedidos = vehiculos[0].Viajes.length
              for (var i = vehiculos.length - 1; i >= 0; i--) {
                  let vehiculo = vehiculos[i];
                  if(vehiculo.Viajes.length) {
                    totalViajesAgendandados += vehiculo.Viajes.length;
                    if(vehiculo.Viajes.length >=masPedidos){
                      vehiculoMasSolicitado = vehiculo;
                      masPedidos = vehiculo.Viajes.length;
                    }
                  }
              }

              delete vehiculoMasSolicitado.dataValues.Viajes;
              return {vehiculoMasSolicitado,totalViajesAgendandados};
            }
          })
        },
        actualizar:function(vehiculo){
             var tags = vehiculo.Tags

             return Vehiculo.update(vehiculo,{
                  where:{
                    uuid:vehiculo.uuid
                  },returning: true
                }).then(function(result){
                    if(tags && tags.length){

                        return Vehiculo.getByUUID(vehiculo.uuid).then(function(vehiculoInstance){
                          var tagsIds =[]
                          for (let i = tags.length - 1; i >= 0; i--) {
                            tagsIds.push(tags[i].id)
                          }
                          return vehiculoInstance.setTags(tagsIds).then(function(result){
                            return result;
                          })


                        })


                    }
                    else{
                      return result[1];
                    }
                });
        },
        actualizarConductor:function(vehiculo){
             return Vehiculo.update(
                    {UsuarioId:null},
                    {where:{UsuarioId:vehiculo.UsuarioId}}
                ).then(function(antiguosVehiculos){
                    return Vehiculo.actualizar(vehiculo);

                })
        },
        listarDocumentosProximosAvencer:function(agenciaId){
          var veintiNueveDiasDesdeHoy =  moment().add(29,'d').toDate();
          console.log("-----------------"+veintiNueveDiasDesdeHoy+"-------------------")
             return Vehiculo.findAll({
                  where:{
                    AgenciumId:agenciaId
                  },include: [
                         {model: sequelize.model('Documento'), required: true, where: { fechaExpiracion: {$lte: veintiNueveDiasDesdeHoy} }}
                  ]
                });
        },
        getByUUID:function(uuid){
             return Vehiculo.findOne({
                  where:{
                    uuid:uuid
                  }
                });
        },
        obtenerconViajesEnRangoDeFechas:function(filtro){

          filtro.statusViaje = filtro.statusViaje || STATUS_CONFIRMADO;

          var includes =  [{model: sequelize.model('Viaje'), where:{estado: filtro.statusViaje},required: false}]

          if(filtro.fechaInicio&&filtro.fechaFin){
            includes =   [{model: sequelize.model('Viaje'), where:{ estado: filtro.statusViaje,fechaInicio:{$gte:filtro.fechaInicio},fechaFin:{$lte:filtro.fechaFin} },required: false}]

          }
          if(filtro.tags && filtro.tags.length){
              for (var i = filtro.tags.length - 1; i >= 0; i--) {
                tagsIds.push(filtro.tags[i].id)
              }

              includes.push({model: sequelize.model('Tag')  , where:{ id: tagsIds },required: true});
              delete filtro.tags;
          }
          delete filtro.statusViaje;
          return Vehiculo.findAll({
                 order: [
                    ['id', 'DESC']
                ],
                 where:filtro,
                 include: includes
            });
        },
        filtrar:function(filtro,statusViaje){
            var tagsIds =[]
            var includes =
            [            {model: sequelize.model('Usuario')},
                         {model: sequelize.model('Documento')}
            ]

            if(filtro.tags && filtro.tags.length){
              for (var i = filtro.tags.length - 1; i >= 0; i--) {
                tagsIds.push(filtro.tags[i].id)
              }

                includes.push({model: sequelize.model('Tag')  , where:{ id: tagsIds },required: true});
            }
            else{
                includes.push({model: sequelize.model('Tag')});

            }
            delete filtro.tags;
            if(statusViaje){
                includes.push({model: sequelize.model('Viaje'), where:{ estado: statusViaje },required: false});
            }
            else{
                includes.push({model: sequelize.model('Viaje')});
            }


            return Vehiculo.findAll({
                 order: [
                    ['id', 'DESC']
                ],
                 where:filtro,
                 include: includes
            });


        },

        obtenerPlacas:function(AgenciumId){
            return Vehiculo.findAll({
                 order: [
                    ['id', 'DESC']
                ],
                attributes: ['placa'],
                where:{
                  AgenciumId:AgenciumId
                }
            });
        },

        buscarDisponibles:function(filtro,nuevaFechaInicio,nuevaFechaFin){
        	return Vehiculo.filtrar(filtro,STATUS_CONFIRMADO).then(function(vehiculosAgencia){
        		var vehiculosDisponibles = [],
        		vehiculo=[];
        		for (var i = vehiculosAgencia.length - 1; i >= 0; i--) {
        			 vehiculo = vehiculosAgencia[i]
        			if(vehiculo.estaDisponible(nuevaFechaInicio,nuevaFechaFin)){
        				vehiculosDisponibles.push(vehiculo);
        			}
        		}
        		return vehiculosDisponibles;
        	})
        }




    },
    instanceMethods:{
        estaDisponible:function(nuevaFechaInicio,nuevaFechaFin){

           for (var i = this.Viajes.length - 1; i >= 0; i--) {

                console.log("---------------Viajes de "+this.placa+"-----------------------------------------------")
                console.log(new Date(this.Viajes[i].fechaInicio) +">="+nuevaFechaInicio)
                console.log(new Date(this.Viajes[i].fechaInicio) >= nuevaFechaInicio)
                console.log(new Date(this.Viajes[i].fechaInicio) +"<="+ nuevaFechaFin)
                console.log(new Date(this.Viajes[i].fechaInicio) <=  nuevaFechaFin)
                console.log(new Date(this.Viajes[i].fechaInicio) +"<="+ nuevaFechaInicio)
                console.log(new Date(this.Viajes[i].fechaInicio)>=  nuevaFechaInicio);
                console.log(new Date(this.Viajes[i].fechaInicio) +">="+ nuevaFechaInicio)
                console.log(new Date(this.Viajes[i].fechaFin)<= nuevaFechaFin)


                //El viaje existente empieza despues pero empieza antes antes que se acabe el nuevo                              el viaje actual empieza antes que empieze el nuevo pero no acaba antes que empieze el nuevo
                if((new Date(this.Viajes[i].fechaInicio) >= nuevaFechaInicio &&   new Date(this.Viajes[i].fechaInicio) <= nuevaFechaFin) || (new Date(this.Viajes[i].fechaInicio)<= nuevaFechaInicio && new Date(this.Viajes[i].fechaFin)>= nuevaFechaInicio)){

                    console.log("Ocupado")
                    return false;
                  }

            }
            console.log("Disponible")
            return true;

        },
    }


});

return Vehiculo;
};
