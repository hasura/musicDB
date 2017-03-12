var app = window.app = angular.module('musicdb', []);

var projectName = window.projectName = 'carve65';
var dataUrl = 'https://data.' + projectName + '.hasura-app.io/v1/query';

// /**
//  * Configure the Routes
//  */
// app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
//   $locationProvider.hashPrefix('');
//   $routeProvider
//     // Home
//     .when("/", {templateUrl: "app/partials/home.html", controller: "SearchCtrl"})
//     .when("/search", {templateUrl: "app/partials/home.html", controller: "SearchCtrl"})
//     .when("/artist/:artistId", {templateUrl: "app/partials/artist.html", controller: "ArtistCtrl"})
//     .when("/artists", {templateUrl: "app/partials/artists.html", controller: "ArtistsCtrl"})
//     .when("/categories", {templateUrl: "app/partials/categories.html", controller: "CategoriesCtrl"})
//     .when("/category/:categoryId", {templateUrl: "app/partials/category.html", controller: "CategoryCtrl"})
//     .when("/history/:artistId", {templateUrl: "app/partials/history.html", controller: "HistoryCtrl"})
// }]);

/**
 * Controls the page
 */
app.controller('PageCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {

  $scope.results =[];
  $scope.categories = [];
  $scope.tagExpanded = false;

  $scope.searchArtist = function(artist) {
    console.log("inside searchArtist");

    $scope.artistPresent = false;

    var searchArtistReq = {
      method: 'POST',
      url: dataUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        type: "select",
        args: {
          "table": "artist",
          "columns": ["id", "name"],
          "where": {"name": {"$like": "%"+artist+"%" }},
          "limit": 10
        }
      }
    }

    $http(searchArtistReq).then(
    function success(res){
      console.log(res);
      $scope.artistResults = res.data;
    },

    function error(data){
      console.log(data);
    });
  }

  $scope.searchArtist('Coldplay');

  $scope.getArtist = function(artistId) {
    console.log("getting artist");

    $scope.artistPresent = true;

    var getArtistReq = {
      method: 'POST',
      url: dataUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        "type": "select",
        "args": {
           "table": "artist",
           "columns": [
              "id",
              "name",
              "sort_name",
              "begin_date_year",
              "begin_date_month",
              { 
                "name": "artist_type",
                "columns": ["id", "name"]
              },
              {
                "name": "release_groups",
                "columns": [
                  "id", 
                  "name",
                  {
                    "name": "meta",
                    "columns": ["first_release_date_year", "rating"]
                  }],
                // "order_by": [{
                //   "column" : "meta.first_release_date_year",
                //   "order": "desc",
                //   "nulls" : "last"
                // }],
//                "where" : {"meta" : { "$not" : {"first_release_date_year": null}}}
              }
            ],
           "where": {"id": artistId }
        }
      }
    }

    $http(getArtistReq).then(
    function success(res){
      console.log(res);
      var data = res.data[0];

      $scope.artist = res.data[0];
    },

    function error(data){
      console.log(data);
    });
  }

  var req = {
    method: 'POST',
    url: dataUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      "type": "select",
      "args": {
          "table": "tag",
          "columns": [
            "id",
            "name",
            "ref_count",
          //   {
          //     "name": "artists",
          //     "columns": [
          //       "artist",
          //       "count",
          //       {
          //         "name": "artist_details",
          //         "columns": ["id", "name"]
          //       }
          //     ],
          //     "limit" : 10,
          //     "order_by": "-count"
          //   }
          ],
          "order_by": "-ref_count",
          "limit": 100
      }
    }
  }

  $http(req).then(
  function success(res){
    $scope.tagCloud = res.data;
  },

  function error(data){
    console.log(data);
  });


  $scope.getTagDetails = function(tagId) {

    console.log("inside tag id");
    console.log(tagId);

    var req = {
      method: 'POST',
      url: dataUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        "type": "bulk",
        "args": [
          {
            "type": "select",
            "args": {
              "table": "artist_tag",
              "columns": [
                "artist",
                "tag",
                "count",
                {
                  "name": "artist_details",
                  "columns": ["id", "name"]
                }
              ],
              "where": {"tag": tagId},
              "order_by": "-count",
              "limit" : 10,
            }
          },
          {
            "type": "select",
            "args": {
              "table": "event_tag",
              "columns": [
                "event",
                "tag",
                "count",
                {
                  "name": "event_details",
                  "columns": ["id", "name"]
                }
              ],
              "where": {"tag": tagId},
              "order_by": "-count",
              "limit" : 10,              
            }
          }
        ]  
      }
    }

    $http(req).then(
    function success(res){
      $scope.tagExpanded = true;
      $scope.artistsTag = res.data[0];
      $scope.eventsTag = res.data[1];
      console.log(res.data);
    },

    function error(data){
      console.log(data);
    });

  }

}]);



