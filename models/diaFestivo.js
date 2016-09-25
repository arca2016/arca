"use strict";

var models  = require(__dirname);
var Q = require('q')

module.exports = function(sequelize, DataTypes) {
	var DiaFestivo = sequelize.define("DiaFestivo", {
		deletedAt: DataTypes.DATE,
		fecha: {type: DataTypes.DATE , allowNull: false},

	}, {
		classMethods: {

			associate: function(models) {			
				
			},

			getById: function(id) {
				return DiaFestivo.findById(id);   
			},

			updateDiaFestivo: function(id,update){

		        return DiaFestivo.update(update,{
		          where:{
		            id:id
		          }
		        }); 
		    },

			listDiaFestivo:function(fecha){
				if(!fecha){
					return  DiaFestivo.findAll();
				}
				return DiaFestivo.findAll({
				  where: {
				    fecha: {
				    	$gte: fecha
				    }
				  },
				    order: [['fecha']]
				 })
			},
			crearDiaFestivo: function(diaFestivo){

		     	return  DiaFestivo.build(diaFestivo).save();	      
		    },
		    esDiaFestivo:function(dia,diasFestivos){
		        var esFestivo = false;
		    	 var deferred = Q.defer()

		    	if(typeof dia ==  "number"){
					dia = new Date(dia*1000);
				}
				if(typeof dia == "string"){
					dia = new Date(dia);
				}

                if(diasFestivos) {
                    DiaFestivo.listDiaFestivo(dia).then(function (diasFestivos) {
                        diasFestivos = diasFestivos;
                        for (var i = diasFestivos.length - 1; i >= 0; i--) {
                            if (diasFestivos[i].fecha.toDateString() === dia.toDateString()) {
                                esFestivo = true;

                            }
                        }
                        deferred.resolve({dia: dia, result: esFestivo})
                    })
                }
		    	else{
		    		for (var i = diasFestivos.length - 1; i >= 0; i--) {

				    			if(diasFestivos[i].fecha.toDateString() === dia.toDateString()){
                                    esFestivo = true;
				    				resolve({dia:dia,result:esFestivo})
				    			}		    			
				    	}
                    deferred.resolve({dia:dia,result:esFestivo});
		    	}






		    	 return deferred.promise
		    	
		    }

		}




	
});

return DiaFestivo;
};