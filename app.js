var express        = require('express');
var bodyParser     = require('body-parser');
var errorHandler   = require('errorhandler');
var methodOverride = require('method-override');
var morgan         = require('morgan');
var db             = require('./models');
var config         = require('./config/database.json')[process.env.NODE_ENV];
var cookieParser   = require('cookie-parser');
var jwt            = require('express-jwt');
var jsonwebtoken   = require('jsonwebtoken');
var multiparty 	   = require('connect-multiparty');
var i18n 		   = require('i18n'); 
var app 		   = express();
var secret         = 'supersecret'

//*********
var cors = require('cors');
var express = require('express');
var app = express();
app.use(cors());
app.options('*', cors());

Date.prototype.format = function(fstr, utc) {
  var that = this;
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return that[utc + 'FullYear'] ();
    case '%m': m = 1 + that[utc + 'Month'] (); break;
    case '%d': m = that[utc + 'Date'] (); break;
    case '%H': m = that[utc + 'Hours'] (); break;
    case '%M': m = that[utc + 'Minutes'] (); break;
    case '%S': m = that[utc + 'Seconds'] (); break;
    default: return m.slice (1); 
    }    
    return ('0' + m).slice (-2);
  });
};
///////////
var authenticate   = jwt({
  secret: secret,
  getToken: function fromHeaderOrCookie(req) {
  	try{
  			var token = null;
		    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {//detects if the token comes from header or cookie
		      token = req.headers.authorization.split(' ')[1];
		    } else if(req.cookies && req.cookies.auth) {
		      token = req.cookies.auth;
		    }
		    if(token) {
		        console.dir(jsonwebtoken.verify(token, secret))
		      req.usuario = jsonwebtoken.verify(token, secret);

		    }
		    return token;
  	}
  	catch(err){
  			 console.dir(err)
  	}
  	
  }
});

var initDatabaseParameters = function(){   				
   
   		return 	db.Usuario.createAdmin()   
   
}
var transformacionDeFechas = function(req,res,next){
	if (req.body.viaje){
		var viaje = req.body.viaje;
		console.log(typeof viaje.fechaInicio);
		console.log(typeof viaje.fechaFin);
		if(viaje.fechaInicio){
			if(typeof  viaje.fechaInicio == "number"){
		 		viaje.fechaInicio = new Date(viaje.fechaInicio * 1000);
		 	}
		 	if(typeof  viaje.fechaInicio == "string"){
		 		viaje.fechaInicio = new Date(viaje.fechaInicio);
		 	}
		}
		if(viaje.fechaFin){
			if(typeof viaje.fechaFin == "number"){
                viaje.fechaFin = new Date(viaje.fechaFin * 1000);
		 	}
		 	if(typeof viaje.fechaFin == "string"){
		 		viaje.fechaFin = new Date(viaje.fechaFin);
		 	}
		}

	}
	if (req.body.filtro){
		var filtro = req.body.filtro;
		console.log(typeof filtro.fechaInicio);
		console.log(typeof filtro.fechaFin);
		if(filtro.fechaInicio){
			if(typeof  filtro.fechaInicio == "number"){
		 		filtro.fechaInicio = new Date(filtro.fechaInicio * 1000);
		 	}
		 	if(typeof  filtro.fechaInicio == "string"){
		 		filtro.fechaInicio = new Date(filtro.fechaInicio);
		 	}
		}
		if(filtro.fechaFin){
			if(typeof filtro.fechaFin == "number"){
                filtro.fechaFin = new Date(filtro.fechaFin * 1000);
		 	}
		 	if(typeof filtro.fechaFin == "string"){
		 		filtro.fechaFin = new Date(filtro.fechaFin);
		 	}
		}

	}
	if(req.body.fechaInicio){
	    var fechaInicio = req.body.fechaInicio;
            if(typeof  fechaInicio == "number"){
                req.body.fechaInicio = new Date(fechaInicio * 1000);
            }
            if(typeof  fechaInicio == "string"){
                req.body.fechaInicio = new Date(fechaInicio);
            }
    }
    if(req.body.fechaFin){
        var fechaFin = req.body.fechaFin;
        if(typeof fechaFin == "number"){
            req.body.fechaFin = new Date(fechaFin * 1000);
        }
        if(typeof fechaFin == "string"){
            req.body.fechaFin = new Date(fechaFin);
        }
    }
    if(req.body.fecha){
        var fecha = req.body.fecha;
        if(typeof fecha == "number"){
            req.body.fecha = new Date(fecha * 1000);
        }
        if(typeof fecha == "string"){
            req.body.fecha = new Date(fecha);
        }
    }
	next();
				
}

// Configuration
	app.use(morgan('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(methodOverride());
    app.use(express.static(__dirname + '/ArcaDashboard/release'));
    app.use(cookieParser('supersecret'));
    app.use(transformacionDeFechas);




	app.use(authenticate.unless({path: ['/favicon.ico','/auth/login','/Excel','/auth/logout','/auth/register',/\/auth\/getSignedURL\/\.*/]}));

	app.use(function(err, req, res, next) {
		console.dir(err);
	  if (err.name === 'UnauthorizedError') {
	    res.status(403).send('UnauthorizedError');
	  }
	});



db.sequelize.sync().then(function(){
	var port = process.env.PORT || 3000;

	initDatabaseParameters().then(function(){
		app.listen(port, function() {
	  		console.log("Listening on " + port);
		});
		try{
		var auth    =    require('./routes/auth');
		var agencia = 	 require('./routes/agencia');
		var vehiculo = 	 require('./routes/vehiculo');
		var viaje = 	 require('./routes/viaje');
		var diaFestivo = require('./routes/diaFestivo');
		var marca = 	 require('./routes/marca');
		var referencia = require('./routes/referencia');
		var usuario = 	 require('./routes/usuario');
		var documento =  require('./routes/documento');
		var destino =    require('./routes/destino');
		var tag =    	 require('./routes/tag');
		var tarifaPuntoAPunto =    	 require('./routes/tarifaPuntoAPunto');

		}
		catch(err){
			console.log("Error cargando las rutas");
			console.dir(err);
		}


		try{
		app.use('/auth',auth);
		app.use('/agencia',agencia);
		app.use('/vehiculo',vehiculo);
		app.use('/diaFestivo',diaFestivo);
		app.use('/viaje',viaje);
		app.use('/marca',marca);
		app.use('/referencia',referencia);
		app.use('/usuario',usuario);
		app.use('/documento',documento);
		app.use('/destino',destino);
		app.use('/tag',tag);
		app.use('/tarifaPuntoAPunto',tarifaPuntoAPunto);
		
		var nodeExcel = require('excel-export');
		
		app.use('/Excel', function(req, res){
			return db.Vehiculo.soloVehiculos(req.query.angenciaId).then(function(vehiculos){
				var buscarPlaca = function(id){
					for (var i = vehiculos.length - 1; i >= 0; i--) {
						if(vehiculos[i].id == id){
							return vehiculos[i].placa;
						}
					}
					return "Vehiculo no encontrado"
				}

			return db.Viaje.informe().then(function(viajes){			
				for ( let i = viajes.length - 1; i >= 0; i--) {
					viajes[i] = Object.keys(viajes[i]).map(function (key) { return viajes[i][key]; });
				}
				var datos = viajes;

			    var conf ={};
			    conf.name = "Arca";
			    conf.cols = [{
			        caption:'Origen',
			        type:'string'
			        
			    },{
			        caption:'Destino',
			        type:'string'
			        
			    },{
			        caption:'Descripcion',
			        type:'string'
			        
			    },{
			        caption:'Fecha inicio',
			        type:'string',
			        beforeCellWrite:function(){
			            return function(row, cellData, eOpt){									
			              	var fecha = new Date(cellData)			
			              	return fecha.format ("%Y-%m-%d %H:%M:%S", false)
			            } 
			        }()
			    },{
			        caption:'Fecha fin',
			        type:'string',
			        beforeCellWrite:function(){
			            return function(row, cellData, eOpt){			            	
			              	var fecha = new Date(cellData)			            	
			              	return fecha.format ("%Y-%m-%d %H:%M:%S", false)
			            } 
			        }()
			    },{
			        caption:'Fecha agendamiento',
			        type:'string',
			        beforeCellWrite:function(){
			            return function(row, cellData, eOpt){			            	
			            	var fecha = new Date(cellData)			            	
			              	return fecha.format ("%Y-%m-%d %H:%M:%S", false)
			            } 
			        }()
			    },{
			        caption:'Placa',
			        type:'string',
			        beforeCellWrite:function(){
			            return function(row, cellData, eOpt){
			              	return buscarPlaca(cellData);
			            } 
			        }()
			    }
			    ,{
			        caption:'Valor pagar',
			        type:'string'
			    }
			    ,{
			        caption:'Valor cobrar',
			        type:'number'
			    }
			    ,{
			        caption:'Planilla',
			        type:'string'
			    }
			    ,{
			        caption:'Cliente',
			        type:'string'
			    }
			    ,{
			        caption:'Solicitante',
			        type:'string'
			    }
			    ];
			    conf.rows = datos
			    var result = nodeExcel.execute(conf);
			    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			    res.setHeader("Content-Disposition", "attachment; filename=" + "Reporte Arca.xlsx");
			    res.end(result, 'binary');
			    
			    
			 })




			})
			
		  });
		}
		catch(err){
			console.log("Error usando las rutas");
			console.dir(err);
		}
		
	})
	
})
