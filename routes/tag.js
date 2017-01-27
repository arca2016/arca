var express = require('express');
var router  = express.Router();
var Tag = require('./../models').Tag;


router.route('/')
.get(function(req,res) {
	Tag.listar(req.usuario.agenciumId).then(function(result){
  		res.send(result);
  	})
})
.post(function(req,res) {
	Tag.crear(req.body.tag).then(function(result){
  		res.send(result);
  	})
})
router.route('/:uuid')
.delete(function(req,res) {
	Tag.eliminar({uuid:req.params.uuid},{acenciuId:req.usuario.agenciumId}).then(function(result){
  		res.send(result);
  	})
})
.patch(function(req,res) {
	Tag.actualizar(req.body.tag).then(function(result){
  		res.send(result);
  	})
})

module.exports = router;