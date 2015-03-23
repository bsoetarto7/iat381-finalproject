// Ng-routing to the pages when linked to
var eCardApp = angular.module('eCardApp', [
    'ngRoute']);


eCardApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/page1',{
                // 
                templateUrl:'home.html'
            }).
            when('/page2',{
                // 
                templateUrl:''
            }).
            when('/page3',{
                // 
                templateUrl:''
            }).
            otherwise({
                redirectTo: '/page1'
            });
    }
]);