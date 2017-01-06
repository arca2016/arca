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
var aws = require('aws-sdk');
var awsConfig = require('../config/aws.json')
aws.config = new aws.Config(awsConfig);

router.route('/getSignedURL/:fileName') 
.get(function(req, res) {


		console.dir(aws.config)
		// ---------------------------------
		// now say you want fetch a URL for an object named `objectName`
		var s3 = new aws.S3();
		var contentType = mime.lookup(req.params.fileName);
		var s3_params = {
			Bucket: "arca",
			Key: req.params.fileName,
			Expires: 120,
			ACL: 'public-read',
			Body: '',
			ContentType: contentType
		};
		s3.getSignedUrl('putObject', s3_params, function (err, signedUrl) {
			res.send({url:signedUrl,contentType:contentType});
		});


	})
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
					var tokenInfo = {id: result.id, rol: result.rol,AgenciumId:result.AgenciumId}
					delete result.hash;
					delete result.salt;					
					var resultToken = JSON.parse(JSON.stringify(tokenInfo));;
					console.dir(resultToken);
					var token = jwt.sign(resultToken, secret, {
						expiresIn: "1y",
						noTimestamp:true 
					});
					if(req.body.desarrollo){
								res.json({
						          	user:result,
						          	token: token
					        	});
					}else{
						res.cookie('auth', token, { /*expires:  new Date(Date.now() + 1440*60),*/ httpOnly: true });
						res.send(result);
					}

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
	var userDecoded = req.usuario;
	var nuevoRol = nuevoUsuario.rol;
	var rolCreador = userDecoded.rol;
	nuevoUsuario.AgenciumId = req.usuario.AgenciumId;
	
	var puedeCrear = usuario.tienePermiso(rolCreador,nuevoRol)
	if(puedeCrear){

		pass.hash(nuevoUsuario.password, function (err, salt, hash) {
		if (err) {
			res.status(500);
			res.send(err);
		}
			nuevoUsuario.salt = salt;
			nuevoUsuario.hash = hash;
		var usr = rolCreador.build(nuevoUsuario).save().then(function (result) {			
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
		console.log("error de permisos")
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