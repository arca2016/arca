angular.module('arcaApp')
.controller('RegisterController',['$scope','UserService','$location','vcRecaptchaService',function($scope,UserService,$location,vcRecaptchaService) {
  		
 	$scope.register = function(userInfo){

   
            if(vcRecaptchaService.getResponse() === ""){ //if string is empty
                alert("Please resolve the captcha and submit!")
            }
            else {
                
                    userInfo.reCaptchaResponse= vcRecaptchaService.getResponse();
            }

	 		UserService.register(userInfo,userInfo.password).then(function(status){
	 			alert("Registro exitoso");
	 			$location.path("/login");
	 		});
 	}
}]);