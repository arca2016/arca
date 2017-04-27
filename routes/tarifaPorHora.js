var express = require('express');
var router  = express.Router();
var TarifaPorHora = require('./../models').TarifaPorHora;





router.route('/')
.post(function(req,res) {	
	
				TarifaPorHora.crear(req.body.tarifaPorHora).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})
.patch(function(req,res) {	
	
				TarifaPorHora.actualizar(req.body.tarifaPorHora).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})

.get(function(req,res) {	
	
				TarifaPorHora.listar().then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})



router.route('/capacidad/:capacidad')
.get(function(req,res) {	
				TarifaPorHora.listarPorCapacidadDelVehiculo(req.params.capacidad).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})


router.route('/:id')
.delete(function(req,res){

		TarifaPorHora.getById(req.params.id)
		.then(function(tarifaPorHora){
			if(!tarifaPorHora){
				res.status = 404;
				res.send();
				return;
			}
			else{
				tarifaPorHora.destroy().then(function(result){
					res.send(result);
				})
			}
		});
});

module.exports = router;