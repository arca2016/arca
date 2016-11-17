"use strict";

var models  = require(__dirname);
var Q = require("q");
var pass = require('pwd');

module.exports = function(sequelize, DataTypes) {
  var Usuario = sequelize.define("Usuario",
  {
  	deletedAt: DataTypes.DATE,
    cedula: {type: DataTypes.STRING, unique: true},
    hash: DataTypes.STRING,
    salt: DataTypes.STRING,
    nombre: DataTypes.STRING,   
    genero:{              
      type:   DataTypes.ENUM,
      values: ['M', 'F']
    },
    fechaNacimiento: DataTypes.DATE,
    celular: DataTypes.STRING,
    tipoSangre:{              
      type:   DataTypes.ENUM,
      values: ["O-","O+","A−","A+","B−","B+","AB−","AB+"]
    },
    rol:{              
      type:   DataTypes.ENUM,
      values: ["admin","gerente","despachador","cliente","conductor"]
    },

    telefono: DataTypes.STRING,
    activo:{type:DataTypes.BOOLEAN, defaultValue: true},
    email: {type: DataTypes.STRING},
    foto: {type: DataTypes.STRING},
    uuid : {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV1}
  },
  {
    classMethods: {
      associate: function(models) {
       Usuario.belongsTo(models.Agencia, { onDelete: 'cascade' }),{ foreignKey: { allowNull: true }};
       Usuario.hasOne(models.Vehiculo)
       Usuario.hasMany(models.Documento, { onDelete: 'cascade' },{ foreignKey: { allowNull: false }});
       
     },

     getUsuario: function(user) { 
       var queryParameters= { cedula: user, activo: true}
   
      return Usuario.findOne({          
        where:queryParameters,
        include: [
          {model: sequelize.model('Documento')},
          {model: sequelize.model('Vehiculo')}
        ]

      });   
    },
    listEmpleados: function(agencia,rol) { 
      var rol = rol || { $ne: 'cliente'  }
      return Usuario.findAll({
        attributes:  { exclude: ['updatedAt','createdAt','hash','salt'] },
        where:{  
          rol:  rol,
          AgenciumId: agencia
        },include: [
          {model: sequelize.model('Documento')},
          ]
      });   
    },
    createUser:function(user){

      return Usuario.upsert(user);

    },
    getUsuarioPorCedula: function(user) { 

      return Usuario.find({    
        attributes: { exclude: ['updatedAt','createdAt','hash','salt'] },     
        where:{  
          cedula: cedula
        }
      });   
    },
    actualizar:function(usuario){
             return Usuario.update(usuario,{
                  where:{
                    uuid:usuario.uuid
                  }
                }); 
        },
      
      
      getUsuarioPorId: function(user) { 

        return Usuario.findOne({    
          attributes: { exclude: ['updatedAt','createdAt','hash','salt'] },     
          where:{  
            id: user
          }
        });   
      },

      getUsuariosPorId: function(usuarios) { 			

        var ps=[];

        for(var i=0; i<usuarios.length;i++){
         ps.push(Usuario.getUsuarioById(usuarios[i]));
       }


       return Promise.all(ps);

     },

    


   createAdmin: function(){
    var deferred = Q.defer();
      pass.hash("123456", function(err, salt, hash) {
        if (err){
          console.log("Ther was an error hashing the password");
          throw err;
        } 
        return    Usuario.findOrCreate({
          where: {cedula: 'admin'},
          defaults: {
            salt: salt, 
            hash: hash,
            rol: "admin"
          }
        }).then(function(result){
          result= result[0];
          var user={
            id:result.get('id'),
            rol:result.get('rol'),
            cedula:result.get('cedula')
          };
          deferred.resolve(user)
          return user;
        },function(error){
         console.log("There was and error crating the admin. The error was: "+ error);
         return error;
       })  

      });
      return deferred.promise;           
   
  }

}
});

return Usuario;
};