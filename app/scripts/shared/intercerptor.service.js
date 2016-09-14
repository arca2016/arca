angular.module('arcaApp')
.factory('InterceptorService', ['$q','$rootScope',function($q, $rootScope) {    
  
  var intercerptor={};
  var dialog = waitingDialog;
  var showingLoading = false;
  var loadingStack = 0;
    
  var hideLoading = function(){
    if(loadingStack > 0 ){
        loadingStack--;
    }
    if(loadingStack==0){
     dialog.hide();
      $('.modal-backdrop.fade.in').remove();
      showingLoading = false;
    }
  }

  var showLoading = function(){
      if(loadingStack==0){                
        dialog.show("Cargando");               
      }
      loadingStack++;
  }

  intercerptor.request =  function(config) {
      showLoading();
      return config;
  }

  intercerptor.requestError =  function(rejection) {
    hideLoading();
    if(!angular.isUndefined(rejection.data) && rejection.data != null && typeof rejection.data == "string"){
      var type = rejection.data.substring(0, 3);
      if(type == "INF" || type == "SUC" || type == "ERR" || type == "WAR" ){
        $rootScope.openModal(rejection.data,type);
      }
    }
    return $q.reject(rejection);
  }

  intercerptor.response = function(response) {
    hideLoading();
    if(!angular.isUndefined(response.data) && response.data != null && typeof response.data == "string"){
      var type = response.data.substring(0, 3);
      if(type == "INF" || type == "SUC" || type == "ERR" || type == "WAR" ){
        $rootScope.openModal(response.data,type);
      }
    }
    return response;
  }

  intercerptor.responseError = function(rejection){
    hideLoading();
    if(!angular.isUndefined(rejection.data) && rejection.data != null && typeof rejection.data == "string"){
      var type = rejection.data.substring(0, 3);
      if(type == "INF" || type == "SUC" || type == "ERR" || type == "WAR" ){
        $rootScope.openModal(rejection.data,type);
      }
    }
    return $q.reject(rejection);
  }
    
    return intercerptor;
}]);
