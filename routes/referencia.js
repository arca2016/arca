var express = require('express');
var router  = express.Router();

var Referencia = require('./../models').Referencia;



router.route('/')
.get(function(req,res) {

  Referencia.list().then(function(result){
  	res.send(result);
  })
			
		

	
})



module.exports = router;