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
var jwt = require('jsonwebtoken');
var models = require('./../models');



router.route('/')
.post(function(req,res) {
	var userDecoded = req.usuario;
	 models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){	 
	 console.dir(req.body.viaje)			
				models.Viaje.crear(usuario,req.body.viaje).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(412);
					console.dir(err.message)
					res.send(err.message)
				})
			
		
		})
	

	
})
router.route('/recurrente')
.post(function(req,res) {
	var userDecoded = req.usuario;
	 models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){
	 	
			
				models.Viaje.crearRecurrente(usuario,req.body.vehiculoId,req.body.fechaInicio,req.body.fechaFin,
					req.body.tiempoDeViaje,req.body.incluyeFestivos,req.body.diasDeLaSemana,req.body.descripcion).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(412);
					res.send(err)
				})
			
		
		})
	
})

router.route('/cancelarViaje')
.post(function(req,res) {
	var uuid = req.body.uuid;	
	 	
			
		models.Viaje.getByUuid(uuid).then(function(viaje){
			viaje.cancelarViaje().then(function(result){
				res.send(result)
			})
			
		},
		function(err){
			res.status(500);
			res.send(err)
		})
	
		
	})
	


module.exports = router;