    "use strict";

var models  = require(__dirname);
var Q = require('q')


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
    imagen:DataTypes.STRING,
    marca:DataTypes.STRING,
    referencia:DataTypes.STRING
    

}, {
    classMethods: {

        associate: function(models) {
            Vehiculo.hasMany(models.Documento);
            Vehiculo.hasMany(models.Viaje);
            Vehiculo.hasOne(models.Usuario);


        },
        getById: function(id) {
            return Vehiculo.findById(id);
        },
        crear: function(vehiculo){
            return Vehiculo.build(vehiculo).save();
        },
        actualizar:function(vehiculo){
             return Vehiculo.update(vehiculo,{
                  where:{
                    id:vehiculo.id
                  }
                }); 
        },
        filtrar:function(filtro){
            return Vehiculo.findAll({
	            	 where:filtro,
	            	 include: [
	          			 {model: sequelize.model('Viaje')}
	          		 ]
	          	});
        },

        buscarDisponibles:function(filtro,nuevaFechaInicio,nuevaFechaFin){
        	return Vehiculo.filtrar(filtro).then(function(vehiculosAgencia){
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
                if((this.Viajes[i].fechaInicio >= nuevaFechaInicio &&   this.Viajes[i].fechaInicio <= nuevaFechaFin) || (this.Viajes[i].fechaFin>= nuevaFechaInicio && this.Viajes[i].fechaFin<= nuevaFechaFin))
                    return false;
            }
            return true;

        },
    }


});

return Vehiculo;
};