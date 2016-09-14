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
.config(['envServiceProvider',function(envServiceProvider) {
    // set the domains and variables for each environment
    envServiceProvider.config({
        domains: {
            development: ['localhost'],
            production: ['sima-1465300851.us-west-2.elb.amazonaws.com','beavertechtesting.com']
        },
        vars: {
            development: {
                apiUrl: 'http://localhost:5000/',
                bucketS3: 'https://s3-us-west-2.amazonaws.com/sima-data/',
                recaptchaKey: '6LdWvSYTAAAAAGlwyWQIBxOTztkvcfRueKWhrZ7C'

            },
            production: {
                apiUrl: 'http://172.31.27.249:5000/', //aws load balancer
                bucketS3: 'https://s3-us-west-2.amazonaws.com/sima-data/',
                recaptchaKey:'6LcTTycTAAAAAOyuM_m2ljzZf3E78_AHBLGp5Ofq'
            }
        }
    });

    // run the environment check, so the comprobation is made
    // before controllers and services are built
    envServiceProvider.check();
}])
.run(['$rootScope','envService',function($rootScope,envService){
	
	$rootScope.serviceUrl = envService.read('apiUrl');
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
