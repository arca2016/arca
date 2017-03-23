var express = require('express');
var router  = express.Router();
var Destino = require('./../models').Destino;



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



module.exports = router;