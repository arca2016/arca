var express = require('express');
var router  = express.Router();
var Paquete = require('./../models').Paquete;



router.route('/')
.get(function(req,res) {
	Paquete.list().then(function(result){
  		res.send(result);
  	})
})
.post(function(req,res) {
	
		Paquete.crear(req.body.paquete).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})
.patch(function(req,res) {
	
		Paquete.actualizar(req.body.paquete).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})
router.route('/:id')
.delete(function(req,res) {
	Paquete.getById(req.params.id)
		.then(function(paquete){
			if(!paquete){
				res.status = 404;
				res.send();
				return;
			}
			else{
				paquete.destroy().then(function(result){
					res.send(result);
				})
			}
		});
})

module.exports = router;