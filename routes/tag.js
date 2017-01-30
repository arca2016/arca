var express = require('express');
var router  = express.Router();
var Tag = require('./../models').Tag;


router.route('/')
.get(function(req,res) {
	Tag.listar({AgenciumId:req.usuario.AgenciumId}).then(function(result){
  		res.send(result);
  	})
})
.post(function(req,res) {
  req.body.tag.AgenciumId=req.usuario.AgenciumId;
  console.log("Tag")
  console.dir(req.body.tag);
	Tag.crear(req.body.tag).then(function(result){
  		res.send(result);
  	})
})
router.route('/:uuid')
.delete(function(req,res) {
	Tag.eliminar({uuid:req.params.uuid},{acenciuId:req.usuario.AgenciumId}).then(function(result){
  		res.send(result);
  	})
})
.patch(function(req,res) {
	Tag.actualizar(req.body.tag).then(function(result){
  		res.send(result);
  	})
})

module.exports = router;