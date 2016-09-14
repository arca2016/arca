angular.module('arcaApp')
.factory('UserService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {    
  
    var deferred = $q.defer();
    var promise = deferred.promise;
    var response = [];
    var service = {};
    var allowedViews=[];
    var modelPath = "usuario/";

    service.login = function(userInfo) {
        var q = $q.defer();
        var query = $rootScope.serviceUrl+'auth/login';
        console.log(query);
        
        var info={
            usuario:userInfo.user,
            password:userInfo.password
        };

        $http.post(query,info).then(function(response){
            user=response.data;
            q.resolve(response.data);          
        },function(err){
            q.reject(err);
        });

        return q.promise;  
    };
    service.getByRFC =function(RFC){
    	var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+"getByRFC/"+RFC;

        console.log(query);
        $http.get(query).success(function(data){
            q.resolve(data);
        });
        return q.promise;

    }
    service.getByNumeroEmpleado =function(numeroEmpleado){
        var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+"employee/"+numeroEmpleado;

        console.log(query);
        $http.get(query).then(function(response){
            q.resolve(response.data);
        });
        return q.promise;

    }
    service.listEmployees =function(RFC){
        var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+"employees/";

        console.log(query);
        $http.get(query).success(function(data){
            q.resolve(data);
        });
        return q.promise;

    }
    service.getByCURP =function(CURP){
        var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+"getByCURP/"+CURP;

        console.log(query);
        $http.get(query).success(function(data){
            q.resolve(data);
        });
        return q.promise;

    }
    service.getUsersById =function(ids){
    	var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+"getById/";

        console.log(query);
        $http.post(query,{"ids":ids}).success(function(data){
            q.resolve(data);
        });
        return q.promise;

    }
    
    service.logOut = function(userInfo) {
        var q = $q.defer();
        var query = $rootScope.serviceUrl+'auth/logout';
        console.log(query);

        $http.get(query).then(function(response){
            q.resolve(response.data);          
        },function(err){
            q.reject(err);
        });

        return q.promise;  
    };

    service.update= function(object){
        console.log(JSON.stringify(object));
        var q = $q.defer();        
        var query =$rootScope.serviceUrl+modelPath+object.id;

        console.log(query);
        $http.patch(query,({"update":object})).success(function(data){
            q.resolve(data);
        });
        return q.promise;
    }

    service.chkLoggedIn = function(){
        var q = $q.defer();
        var query = $rootScope.serviceUrl+'auth/chkLoggedIn';
        console.log(query);

        $http.get(query).then(function(response){
            q.resolve(response.status);          
        }).catch(function(error){
            q.resolve(error.status);
        });
        return q.promise;
    }

    service.addUsuario = function(user,password) {
        var q = $q.defer();
        var query = $rootScope.serviceUrl+'usuario';
        console.log(query);

        
            var info={
                usuario:user,
                password:password
            };
       
        
        $http.post(query,info).then(function(response){
          q.resolve(response.data);        
        },function(err){
            q.reject(err);
        });
        return q.promise; 
    };
    service.register= function(user,password) {
        var q = $q.defer();
        var query = $rootScope.serviceUrl+'auth/register';
        console.log(query);

        
            var info={
                usuario:user,
                password:password
            };
       
        
        $http.post(query,info).then(function(response){
          q.resolve(response.data);        
        },function(err){
            q.reject(err);
            alert(err.data)
        });
        return q.promise; 
    };
    service.getUser= function(){
    	return JSON.parse(localStorage.getItem('user'));
    }

    service.setUser= function(user){
        localStorage.setItem('user', JSON.stringify(user));
    }
    service.setAllowedViews=function(views){
        allowedViews = views;
    }
    service.getAllowedViews = function(){
        return allowedViews;
    }
    
    return service;
}]);