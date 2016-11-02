var express = require('express');
var router  = express.Router();
var Usuario = require('./../models').Usuario;

router.route('/') 
.get(function(req, res) {		
			Usuario.getUsuarioPorId(req.usuario.id).then(function(usuario){
				Usuario.listEmpleados(usuario.AgenciumId).then(function(result){
						res.send(result)
				})

			},function(err){
				    res.status(500)
					res.send(err)
			})
			
	})


module.exports = router;