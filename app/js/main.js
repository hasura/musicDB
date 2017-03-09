var app = window.app = angular.module('musicdb', [
  'ngRoute'
]);

var projectName = window.projectName = 'carve65';

/**
 * Configure the Routes
 */
app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    // Home
    .when("/search", {templateUrl: "app/partials/searchResults.html", controller: 'SearchCtrl' })
}]);

/**
 * Controls the page
 */
app.controller('PageCtrl', ['$scope', '$location', function ($scope, $location) {

  console.log("PageCtrl loaded");

  $scope.searchArtist = function(artist) {
    console.log("inside searchArtist");
    $location.url('/search?query=' + artist);
  }

}]);

app.controller('SearchCtrl', ['$scope', '$location', '$http', function( $scope, $location, $http) {

  console.log($location.search().query);
  var query = $location.search().query;

  var req = {
    method: 'POST',
    url: 'https://data.' + projectName + '.hasura-app.io/v1/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      type: "select",
      args: {
        "table": "artist",
        "columns": ["*.*"],
        "where": {"name": {"$like": "%"+query+"%" }},
        "limit": 10
      }
    }
  }

  $http(req).then(
    function success(data){
      console.log(data);

    },

    function error(data){
      console.log(data);
    });

}]);