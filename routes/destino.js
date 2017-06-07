var express = require('express');
var router  = express.Router();
var Destino = require('./../models').Destino;




router.route('/municipios')
.get(function(req,res) {
	Destino.listaMunicipios().then(function(result){
  		res.send(result);
  	})
})
router.route('/emblematicos')
.get(function(req,res) {
	Destino.listaEmblematicos().then(function(result){
  		res.send(result);
  	})
})

router.route('/')
.get(function(req,res) {
	Destino.list().then(function(result){
  		res.send(result);
  	})
})

.post(function(req,res) {
	
		Destino.crear(req.body.destino).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})
.patch(function(req,res) {
	
		Destino.actualizar(req.body.destino).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})
router.route('/:id')
.delete(function(req,res) {
	Destino.getById(req.params.id)
		.then(function(destino){
			if(!destino){
				res.status = 404;
				res.send();
				return;
			}
			else{
				destino.destroy().then(function(result){
					res.send(result);
				})
			}
		});
})

module.exports = router;