var express = require('express');
var router  = express.Router();
var TarifaPuntoAPunto = require('./../models').TarifaPuntoAPunto;





router.route('/')
.post(function(req,res) {	
	
				TarifaPuntoAPunto.crear(req.body.tarifaPuntoAPunto).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})
.patch(function(req,res) {	
	
				TarifaPuntoAPunto.actualizar(req.body.tarifaPuntoAPunto).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})

.get(function(req,res) {	
	
				TarifaPuntoAPunto.listar().then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})



router.route('/:id')
.get(function(req,res) {	
				TarifaPuntoAPunto.getById(req.params.id).then(function(result){
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

		TarifaPuntoAPunto.getById(req.params.id)
		.then(function(tarifaPuntoAPunto){
			if(!tarifaPuntoAPunto){
				res.status = 404;
				res.send();
				return;
			}
			else{
				tarifaPuntoAPunto.destroy().then(function(result){
					res.send(result);
				})
			}
		});
});


module.exports = router;