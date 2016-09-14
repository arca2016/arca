'use strict';

/**
 * @ngdoc overview
 * @name arcaApp
 * @description
 * # arcaApp
 *
 * Main module of the application.
 */
angular
  .module('arcaApp', ['ngResource', 'ngRoute', 'ui.bootstrap', 'ui.date','ui.utils.masks','ngFileUpload','ngSanitize','vcRecaptcha','environment'])
.config(['$routeProvider','$httpProvider',function($routeProvider,$httpProvider) {

    $routeProvider
    .when('/', {
    	data: {
	        requireLogin: true
	    },
        templateUrl: 'scripts/components/home/main.html', 
        controller: 'MainCtrl'})
    .when('/login', {
    	data: {
	        requireLogin: false
	    },
        templateUrl: 'scripts/components/auth/login/login.html', 
        controller: 'LoginController'})
    .otherwise({redirectTo: '/'});

    var notLoged = !localStorage.getItem('user');


	
	$httpProvider.interceptors.push('InterceptorService');
}])
.run(['$rootScope',function($rootScope){
	$rootScope.serviceUrl="http://localhost:5000/"
}])
.run(['$rootScope', '$location',function($rootScope, $location){
	$rootScope.$on('$routeChangeStart', function(){
		 var notLoged = !localStorage.getItem('user');
		if(!notLoged){
		var user = JSON.parse(localStorage.getItem('user'));
		if(user){
			$location.path( '/');
		}else{
			$location.path( '/login');
		}
	}else{
		 $location.path('/login');
	}
	})
}])
