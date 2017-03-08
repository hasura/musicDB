var app = window.app = angular.module('musicdb', [
  'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    // Home
    .when("/", {templateUrl: "app/partials/home.html", controller: "PageCtrl"})
}]);

/**
 * Controls the page
 */
app.controller('PageCtrl', ['$scope', function ($scope) {

  console.log("PageCtrl loaded");
  console.log($scope.searchQuery);

}]);