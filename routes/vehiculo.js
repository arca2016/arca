var express = require('express');
var router  = express.Router();
var usuario = require('./../models').Usuario;
var tipoUsuario = require('./../models').TipoUsuario
var pass    = require('pwd');
var jwt     = require('jsonwebtoken');
var crypto = require("crypto");
var querystring = require('querystring');
var request = require('request')
var mime = require('mime');
var secret = 'supersecret';
var recaptcha = require('../config/recaptcha.json')[process.env.NODE_ENV];
var models = require('./../models');


router.route('/')
.post(function(req,res) {

			var userDecoded = jwt.verify(req.cookies.auth, secret);
			models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){
				req.body.vehiculo.AgenciumId = usuario.AgenciumId;
				models.Vehiculo.crear(req.body.vehiculo).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err.message);
				})
			})
})

.patch(function(req,res) {
				models.Vehiculo.actualizar(req.body.vehiculo).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err.message);
				})
})
router.route('/:uuid')
.delete(function(req,res){

		models.Vehiculo.getByUUID(req.params.uuid)
		.then(function(vehiculo){
			if(!vehiculo){
				res.status = 404;
				res.send();
				return;
			}
			else{
				vehiculo.destroy().then(function(result){
					res.send(result);
				})
			}
		});
	});


router.route('/filtrar') //automaticamente filtra por agencia, si no se le pasa un filtro vacio lista todos los de la agencia en la cual se encuentre logueado el usuario
.post(function(req,res) {

			var userDecoded = jwt.verify(req.cookies.auth, secret);

			 models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){
			 	var filtro =  req.body.filtro || {};

			 	for(var k in filtro){
   					if(!filtro[k]) delete filtro[k];
   				}


				 if(filtro.capacidad){
					 filtro.capacidad ={
						 $gte:filtro.capacidad
					 }
				 }
			 	if(filtro.fechaInicio && filtro.fechaFin){
			 		var nuevaFechaInicio = filtro.fechaInicio,
			 		nuevaFechaFin = filtro.fechaFin;
			 		delete filtro.fechaInicio;
			 		delete filtro.fechaFin



			 		models.Vehiculo.buscarDisponibles(filtro,nuevaFechaInicio,nuevaFechaFin).then(function(result){
					res.send(result)
					},
					function(err){
						res.status(500);
						res.send(err.message);
					})
			 	}
			 	else{

				 	filtro.AgenciumId = usuario.AgenciumId;
					models.Vehiculo.filtrar(filtro).then(function(result){
						res.send(result)
					},
					function(err){
						res.status(500);
						res.send(err.message);
					})
				}
			})

})



module.exports = router;
