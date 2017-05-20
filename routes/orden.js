var express = require('express');
var router  = express.Router();
var Orden = require('./../models').Orden;


router.route('/reference/:reference')
.get(function(req,res) {
	Orden.getByReferenceCode(req.params.reference).then(function(result){
  		res.send(result);
  	})
})


router.route('/')
.get(function(req,res) {
	Orden.list().then(function(result){
  		res.send(result);
  	})
})

.post(function(req,res) {
	
		Orden.crear(req.body.orden).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})

.patch(function(req,res) {
	
		Orden.actualizar(req.body.orden).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})

router.route('/:id')
.delete(function(req,res) {
	Orden.getById(req.params.id)
		.then(function(orden){
			if(!orden){
				res.status = 404;
				res.send();
				return;
			}
			else{
				orden.destroy().then(function(result){
					res.send(result);
				})
			}
		});
})



module.exports = router;