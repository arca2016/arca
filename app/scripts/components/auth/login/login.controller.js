angular.module('arcaApp')
.controller('LoginController', ['$rootScope','$scope','UserService','$location',function($rootScope,$scope,UserService,$location) {
  	$scope.userInfo = {}; 	

 	$scope.login = function(){
 		if($scope.userInfo.user && $scope.userInfo.password){
	 		UserService.login($scope.userInfo).then(function(user){
	 			UserService.setUser(user);
				$rootScope.$broadcast('loggedIn',{});
				$rootScope.notLoged=false;
	 			$location.path("/home");
	 		});
 		}else{
 			$rootScope.openModal("Fill All Spaces","WAR");
 		}
 	}
}]);