'use strict';

angular.module('meetmeApp')
  .controller('MainCtrl', ['$scope','$http',function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.loginAttempt = function(){
      $http.get('/auth/facebook').success(console.log('hi'));
    };
  }]);
