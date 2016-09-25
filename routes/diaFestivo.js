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
	
	
				models.DiaFestivo.crearDiaFestivo({fecha:req.body.fecha}).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err.message);
				})
	
})

.patch(function(req,res) {		
				models.DiaFestivo.updateDiaFestivo(req.body.dia).then(function(result){
					res.send(result)
				},
				function(err){
					res.status(500);
					res.send(err.message);
				})	
})



module.exports = router;