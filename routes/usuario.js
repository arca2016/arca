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
router.route('/:rol')
.get(function(req, res) {
			Usuario.getUsuarioPorId(req.usuario.id).then(function(usuario){
				Usuario.listEmpleados(usuario.AgenciumId,req.params.rol).then(function(result){
						res.send(result)
				})

			},function(err){
				    res.status(500)
					res.send(err)
			})

	})
router.route('/')
.patch(function(req,res) {

				Usuario.actualizar(req.body.usuario).then(function(result){
					res.send(result)
				},
				function(err){
					console.log("Error")
					console.dir(err);
					console.log("----------")
					res.status(500);
					res.send(err.message);
				})
})


module.exports = router;
