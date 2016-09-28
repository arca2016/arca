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
router.route('/filtrar') //automaticamente filtra por agencia, si no se le pasa un filtro vacio lista todos los de la agencia en la cual se encuentre logueado el usuario
.post(function(req,res) {
	
			var userDecoded = jwt.verify(req.cookies.auth, secret);

			 models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){
			 	var filtro = {}|| req.body.filtro;
			 
			 	filtro.AgenciumId = usuario.AgenciumId;

				models.Vehiculo.filtrar(filtro).then(function(result){
					console.dir(result);
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err.message);
				})
			})
	
})
router.route('/buscarDisponibles') //automaticamente filtra por agencia, si no se le pasa un filtro vacio lista todos los de la agencia en la cual se encuentre logueado el usuario
.post(function(req,res) {
	
			var userDecoded = jwt.verify(req.cookies.auth, secret);

			 models.Usuario.getUsuarioPorId(userDecoded.id).then(function(usuario){
			 	var filtro = req.body.filtro;
			 	filtro.AgenciumId = usuario.AgenciumId;

				models.Vehiculo.buscarDisponibles(filtro,req.body.fechaInicio,req.body.fechaFin).then(function(result){
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



module.exports = router;