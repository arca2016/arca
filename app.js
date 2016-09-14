var express        = require('express');
var bodyParser     = require('body-parser');
var errorHandler   = require('errorhandler');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var db             = require('./models');
var config         = require('./config/database.json')[process.env.NODE_ENV];
var cookieParser   = require('cookie-parser');
var jwt            = require('express-jwt');
var multiparty 	   = require('connect-multiparty');
var i18n 		   = require('i18n'); 
var app 		   = express();
var authenticate   = jwt({
  secret: 'supersecret',
  getToken: function fromHeaderOrCookie(req) {

  	if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {//detects if the token comes from header or cookie
      return req.headers.authorization.split(' ')[1];
    } else if(req.cookies && req.cookies.auth) {
      return req.cookies.auth;
    }
    return null;
  }
});

var initDatabaseParameters = function(){   				
   
   		return 	db.Usuario.createAdmin()   
   
}

// Configuration
	app.use(morgan('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(cookieParser('supersecret'));




	app.use(authenticate.unless({path: ['/favicon.ico','/auth/login','/auth/register']}));

	app.use(function(err, req, res, next) {
	  if (err.name === 'UnauthorizedError') {
	    res.status(403).send('UnauthorizedError');
	  }
	});

db.sequelize.sync().then(function(){
	var port = process.env.PORT || 5000;

	initDatabaseParameters().then(function(){
		app.listen(port, function() {
	  		console.log("Listening on " + port);
		});
		try{
		var auth    =    require('./routes/auth');
		var agencia = 	 require('./routes/agencia');
		var vehiculo = 	 require('./routes/vehiculo');
		var viaje = 	 require('./routes/viaje');
		}
		catch(err){
			console.log("Error cargando las rutas");
			console.dir(err);
		}
		app.use('/auth',auth);
		app.use('/agencia',agencia);
		app.use('/vehiculo',vehiculo);
		app.use('/viaje',viaje);
	})
	
})
