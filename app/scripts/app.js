angular.module('meetmeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/map', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });




//Setting HTML5 Location Mode
// window.app.config(['$locationProvider',
//     function($locationProvider) {
//         $locationProvider.hashPrefix("!");
//     }
// ]);