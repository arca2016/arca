module.exports = function(io) {
var express = require('express');
var router  = express.Router();
var PayURespuesta = require('./../models').PayURespuesta;




router.route('/')
.get(function(req,res) {
	PayURespuesta.list().then(function(result){
  		res.send(result);
  	})
})

.post(function(req,res) {
	
		PayURespuesta.crear(req.body).then(function(result){
			console.log("/////////////////////")
			console.log(req.body.response_message_pol)
			if(req.body.response_message_pol==="APPROVED"){
				console.log("Emiting newPayment througt sockets")
				io.sockets.emit('newPayment');
			}
	  		res.send(result);
	  	},function(err){
			  console.dir(err)
	  			res.status(400).send(err);
	  	})
	
})

.patch(function(req,res) {
	
		PayURespuesta.actualizar(req.body.orden).then(function(result){
	  		res.send(result);
	  	},function(err){
	  			res.status(400).send(err);
	  	})
	
})

router.route('/:id')
.delete(function(req,res) {
	PayURespuesta.getById(req.params.id)
		.then(function(respuesta){
			if(!respuesta){
				res.status = 404;
				res.send();
				return;
			}
			else{
				respuesta.destroy().then(function(result){
					res.send(result);
				})
			}
		});
})



return router;
}
