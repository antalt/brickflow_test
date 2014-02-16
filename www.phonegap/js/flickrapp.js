'use strict';

var app = angular.module('flickrApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/gallery',
            {
                controller: 'FlickrCtrl',
                templateUrl: 'partials/gallery.html'
            })
        .when('/slideshow',
            {
                controller: 'FlickrCtrl',
                templateUrl: 'partials/slideshow.html'
            })
        .otherwise({ redirectTo: '/gallery' });
});

app.factory('flickrFactory', function($http) {
    var factory = {};
    factory.getFlickrPhotos = function() {
        var photos = [
            {src: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', desc: 'Image 04'},
            {src: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', desc: 'Image 05'},
            {src: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', desc: 'Image 06'},
            {src: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', desc: 'Image 01'}
        ];
        return photos;
    };
    factory.getFlickrPhotosAsync = function(searchString, perPage, page, callback) {
        var api_key, params, url;
        api_key = '5347feef6f04700c9b3c1903a16d62b1';
        url = 'http://api.flickr.com/services/rest/';
        params = {
            method: 'flickr.photos.search',
            api_key: api_key,
            text: searchString,
            per_page: perPage,
            format: 'json',
            page: page,
            jsoncallback: 'JSON_CALLBACK'
        };

        $http.jsonp(url, {params: params}).success(function(data, status, headers, config) {
            var photos = $.map(data.photos.photo, function(photo) {
              return {
                desc: photo.title,
                thumb_src: "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_s.jpg",
                src: "http://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg"
              };
            });
            callback(photos);
        }).error(function(data, status, headers, config) {
            console.error("Could not get data from Flickr.");
        });
    };
    return factory;
});

app.controller('FlickrCtrl', function ($scope, flickrFactory) {
    $scope.page = 1;
    $scope.photosPerPage = 16;
    $scope.photos = [];

    $scope.doSearch = function() {
        $scope.photos = [];
        $scope.page = 0;

        $scope.doSearchMore();
    }
    $scope.doSearchMore = function() {
        $scope.page++;
        
        flickrFactory.getFlickrPhotosAsync($scope.searchText, $scope.photosPerPage, $scope.page, function(results) {            
            var n = results.length;
            for ( var i=0; i<n; i++ ) {
                $scope.photos.push( results[i] );
            }            
        });
    }

    $scope.showMore = function() {
        return $scope.photos.length > 0;
    }

});
