var express = require('express');
var router  = express.Router();
var Marca = require('./../models').Marca;



router.route('/')
.get(function(req,res) {
	Marca.list().then(function(result){
  		res.send(result);
  	})
})
.post(function(req,res) {
	Marca.crear(req.body.marca.nombre).then(function(result){
  		res.send(result);
  	})
})



module.exports = router;