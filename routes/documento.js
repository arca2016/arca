var express = require('express');
var router  = express.Router();
var Usuario = require('./../models').Usuario;
var Documento = require('./../models').Documento;
var request = require('request')




router.route('/')
.post(function(req,res) {	
	
				Documento.crear(req.body.documento).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})
.patch(function(req,res) {	
	
				Documento.actualizar(req.body.documento).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})

router.route('/:uuid')
.get(function(req,res) {	
				Documento.getByUUID(req.params.uuid).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					console.dir(err.message)
					res.send(err.message)
				})
			
})

router.route('/:uuid')
.delete(function(req,res){

		Documento.getByUUID(req.params.uuid)
		.then(function(documento){
			if(!documento){
				res.status = 404;
				res.send();
				return;
			}
			else{
				documento.destroy().then(function(result){
					res.send(result);
				})
			}
		});
});


module.exports = router;