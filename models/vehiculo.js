    "use strict";

var models  = require(__dirname);
var Q = require('q')
var  STATUS_CANCELADO = 'Cancelado';
var  STATUS_CONFIRMADO =  'Confirmado'


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
    uuid : {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV1}


}, {
    classMethods: {

        associate: function(models) {
            Vehiculo.hasMany(models.Documento);
            Vehiculo.hasMany(models.Viaje);
            Vehiculo.belongsTo(models.Usuario);

        },
        getById: function(id) {
            return Vehiculo.findById(id);
        },
        crear: function(vehiculo){
            vehiculo.placa = vehiculo.placa.toUpperCase();
            return Vehiculo.build(vehiculo).save();
        },
        actualizar:function(vehiculo){
             return Vehiculo.update(vehiculo,{
                  where:{
                    uuid:vehiculo.uuid
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
        getByUUID:function(uuid){
             return Vehiculo.findOne({
                  where:{
                    uuid:uuid
                  }
                });
        },
        filtrar:function(filtro,statusViaje){
            if(statusViaje){
                return Vehiculo.findAll({
                     order: [
                        ['id', 'DESC']
                    ],
                     where:filtro,
                     include: [
                         {model: sequelize.model('Usuario')},
                         {model: sequelize.model('Documento')},
                         {model: sequelize.model('Viaje'), where:{ estado: statusViaje },required: false }
                     ]
                });
            }
            else{
                return Vehiculo.findAll({
                     order: [
                        ['id', 'DESC']
                    ],
                     where:filtro,
                     include: [
                         {model: sequelize.model('Usuario')},
                         {model: sequelize.model('Documento')},
                         {model: sequelize.model('Viaje')}
                     ]
                });
            }
        	
            
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
           console.log(this.placa);
           for (var i = this.Viajes.length - 1; i >= 0; i--) {
                if((this.Viajes[i].fechaInicio >= nuevaFechaInicio &&   this.Viajes[i].fechaInicio <= nuevaFechaFin) || (this.Viajes[i].fechaFin>= nuevaFechaInicio && this.Viajes[i].fechaFin<= nuevaFechaFin))
                    console.log("Ocupado")
                    return false;
            }
            console.log("Disponible")
            return true;

        },
    }


});

return Vehiculo;
};
