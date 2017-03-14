var app = window.app = angular.module('musicdb', []);

var projectName = window.projectName = 'carve65';
var dataUrl = 'https://data.' + projectName + '.hasura-app.io/v1/query';

/**
 * Controls the page
 */
app.controller('PageCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {

  $scope.results =[];
  $scope.categories = [];
  $scope.tagExpanded = false;
  $scope.latestReleases = [];
  $scope.currentOffset = 0;

  var wrapQuery = function(data) {
    return {
      method: 'POST',
      url: dataUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data : data
    }
  }

  $scope.searchArtist = function(artist) {

    $scope.artistPresent = false;

    var searchArtistQuery = {
      type: "select",
      args: {
        "table": "artist",
        "columns": ["id", "name"],
        "where": {"name": {"$ilike": "%"+artist+"%" }},
        "limit": 10
      }
    }

    $http(wrapQuery(searchArtistQuery)).then(
    function success(res){
      $scope.artistResults = res.data;
    },

    function error(data){
    });
  }


  $scope.getArtist = function(artistId) {

    $scope.artistPresent = true;

    var getArtistQuery = {
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
              //  "order_by": [{
              //    "column" : "meta.first_release_date_year",
              //    "type": "desc",
              //    "nulls" : "last"
              //  }],
              "order_by": "-meta.first_release_date_year",
              "where" : {"$not" : { "meta" : {"first_release_date_year": null}}}
            }
          ],
         "where": {"id": artistId }
      }
    }

    $http(wrapQuery(getArtistQuery)).then(
    function success(res){
      var data = res.data[0];

      $scope.artist = res.data[0];
    },

    function error(data){
    });
  }

  $scope.getPopularTags = function() {

    var tagsQuery = {
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

    $http(wrapQuery(tagsQuery)).then(
    function success(res){
      $scope.tagCloud = res.data;
    },

    function error(data){
    });

  }


  $scope.getTagDetails = function(tagObj) {

    $scope.selectedTag = tagObj;

    var tagDetailQuery = {
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
            "where": {"tag": tagObj.id},
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
            "where": {"tag": tagObj.id},
            "order_by": "-count",
            "limit" : 10,
          }
        }
      ]
    }

    $http(wrapQuery(tagDetailQuery)).then(
    function success(res){
      $scope.tagExpanded = true;
      $scope.artistsTag = res.data[0];
      $scope.eventsTag = res.data[1];
    },

    function error(data){
    });

  }

  $scope.getLatestReleases = function(offset) {

    var latestReleasesQuery = {
      "type": "select",
      "args": {
          "table": "release_group_meta",
          "columns": [
            "id",
            "first_release_date_year",
            "first_release_date_month",
            "first_release_date_day",
            {
              "name": "parent",
              "columns": [
                "name",
                "artist_credit",
                {"name" : "artist",
                 "columns": ["id", "name"]
                }]
            }
          ],
          "order_by": [{"column" : "first_release_date_year", "type": "desc", "nulls": "last"},
                       {"column" : "first_release_date_month", "type": "desc", "nulls": "last"},
                       {"column" : "first_release_date_day", "type": "desc", "nulls": "last"}
                      ],
//          "order_by" : ["-first_release_date_year", "-first_release_date_month", "-first_release_date_day"],
          "where": { "parent": { "artist": { "name" : { "$neq" : null  } } } },
          "limit": 10,
          "offset": offset
      }
    }

    $http(wrapQuery(latestReleasesQuery)).then(
    function success(res){
      $scope.latestReleases = res.data
      $scope.currentOffset = offset;
    },

    function error(data){
    });

  }

  $scope.getDate = function(release) {
    return new Date(release.first_release_date_year, release.first_release_date_month, release.first_release_date_day);
  }

  $scope.getAnalytics = function() {

    var analyticsQuery = {
      "type": "select",
      "args": {
          "table": "tag_stats_view",
          "columns": [ "*.*"],
      }
    }

    $http(wrapQuery(analyticsQuery)).then(

    function success(res){

      var data = res.data;
      var formattedData = {};

      res.data.forEach(function(r) {
        if(formattedData[r.tag]) {
          formattedData[r.tag].data.push({x: r.first_release_date_year, y: r.count})
        }
        else {
          formattedData[r.tag] = {"label": r.tag_details.name, "data": [{x: r.first_release_date_year, y: r.count, backgroundColor: 'rgba(123,0,0,0.1)'}]}
        }
      })

      var ctx = $("#myChart");

      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: Object.values(formattedData)
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
      });
   },

    function error(data){
    });
  }


  $scope.searchArtist('Coldplay');
  $scope.getAnalytics();
  $scope.getLatestReleases(0);
  $scope.getPopularTags();
  $scope.getTagDetails({id: 7, name: "rock"});

}]);
