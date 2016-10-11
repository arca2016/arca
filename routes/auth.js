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

router.route('/login')
.post(function(req, res) {
	usuario.getUsuario(req.body.usuario).then(function(usuarioResult){
		if(usuarioResult){
			pass.hash(req.body.password, usuarioResult.salt, function(err, hash){

				if(err){
					res.status(500);
					res.send(err)
				}
				if (usuarioResult.hash == hash) {

					var result = usuarioResult.get();
					var tokenInfo = {id: result.id, rol: result.rol}
					delete result.hash;
					delete result.salt;					
					var resultToken = JSON.parse(JSON.stringify(tokenInfo));;
					console.dir(resultToken);
					var token = jwt.sign(resultToken, secret, {
						expiresIn: "1y",
						noTimestamp:true 
					});
					res.cookie('auth', token, { /*expires:  new Date(Date.now() + 1440*60),*/ httpOnly: true });
					res.send(result);

				}else {
					res.status(401);
					res.send("401");
				}
			})
		}else {
			res.status(404);
			res.send("404");
		}
	});
});

router.route('/chkLoggedIn')
.get(function(req, res) {
	res.status(200);
	res.send("logueado");
});

router.route('/crearUsuario')
.post(function(req, res) {
	var nuevoUsuario = req.body.usuario;
	var userDecoded = jwt.verify(req.cookies.auth, secret);
	var nuevoRol = nuevoUsuario.rol;
	var rolCreador = userDecoded.rol
	var puedeCrear = true
	
	if(rolCreador=='gerente'&&(nuevoRol=='admin')){
		//no puede crear
		puedeCrear = false;
	}
	if(rolCreador== 'despachador' && (nuevoRol!='cliente'&& nuevoRol!='conductor')){
		// no puede crear
		puedeCrear = false;
	}
	if(rolCreador=='cliente'||rolCreador=='conductor'){
		// no puede crear
		puedeCrear = false;
	}
	if(nuevoRol != 'gerente'&& nuevoRol != 'despachador'&& nuevoRol != 'cliente'&& nuevoRol != 'conductor'){
		puedeCrear = false
	}
	if(puedeCrear){

		pass.hash(nuevoUsuario.password, function (err, salt, hash) {
		if (err) {
			res.status(500);
			res.send(err);
		}
			nuevoUsuario.salt = salt;
			nuevoUsuario.hash = hash;
		var usr = usuario.build(nuevoUsuario).save().then(function (result) {
			var result = {
				id: result.get('id'),
				username: result.get('username')
			};

			res.send(result);
		}).catch(function (error) {
			console.dir(error)
			if (error.name == 'SequelizeUniqueConstraintError') {
				res.status(409);
				res.send(error);
			}
		})


	});
	}
	else{
		res.status(412);
		res.send("Error de permisos");
		return;
	}

});

router.route('/logout')
.post(function(req, res) {
	if(req.user){
		delete req.user;
	}
	res.clearCookie('auth');
	res.status(200);
	res.send("Deslogueo exitoso");
});

router.route('/register')
.post(function(req,res) {

	if (req.cookies.auth) {
		res.status(403);
		res.send("Deslogueate primero");
		return;
	}
	var usuarioInfo = req.body.usuario;
	usuario.getUsuario(usuarioInfo.cedula).then(function(usuarioResult){

	if(usuarioResult){// ya hay un usuario registrado
		res.status(412);
		res.send("Ese usuario ya esta registrado");
		return;
	}

	
	pass.hash(usuarioInfo.password, function (err, salt, hash) {
		if (err) {
			res.status(500);
			res.send(err);
		}

		usuarioInfo.salt = salt;
		usuarioInfo.hash = hash;
		usuarioInfo.rol = "despachador";


		var usr = usuario.build(usuarioInfo).save().then(function (result) {
			var result = {
				id: result.get('id'),
				username: result.get('username')
			};

			res.send(result);
		}).catch(function (error) {
			console.dir(error)
			if (error.name == 'SequelizeUniqueConstraintError') {
				res.status(409);
				res.send(error);
			}
		})

	});
})

})

module.exports = router;