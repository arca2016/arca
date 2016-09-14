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
	 	
			if(usuario.rol !== "admin"){
				res.status(403);
				res.send("Solo el Administrador del sistema puede crear agencias");
				return;
			}
			else{
				models.Agencia.crear(req.body.nombre).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err)
				})
			}
		
		
	})

	
})



module.exports = router;