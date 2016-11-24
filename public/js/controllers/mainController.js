'use strict';
angular.module('projectOne')
    .controller('mainController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
        $scope.hideMapFlag = true;
        $scope.hideGraphFlag = true;
        $scope.map = null;
        // used for phase 2 
        $scope.dbConnFlag = true;
        $scope.dbSize = -1;
        $scope.movieQueue = [];
        $scope.showProject1Flag = false;
        $scope.spinnerFlag = false;
        $scope.spinnerRotationFlag = false;
        $scope.loadCompleteFlag = false;
        $scope.buttonText = "Fetch Data from Database";
        $scope.showButtonFlag = true;
        $scope.counter = 0;
        var promise;

        /* PHASE 1 Code */
        // Request definition
        var req = {
            method: 'GET',
            url: 'https://cse5335-asa8284-project2.herokuapp.com/getLocations',
            //url: 'http://localhost:8081/getData',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Request ith record 
        var req_i = {
            method: 'GET',
            url: 'https://cse5335-asa8284-project2.herokuapp.com/getMovie/',
            //url: 'http://localhost:8081/getMovie/',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Function to fetch data from json file and display map
        $scope.fetchMap = function() {
            $scope.hideMapFlag = false;
            $scope.locations = [];
            // GET request
            $http(req).then(function(response) {
                //success callback
                if (response.status == 200) {
                    $scope.locations = response.data.location;
                    //console.log(response.data.location);
                    $scope.initMap();
                } else {
                    alert("Error: " + response);
                    $scope.hideMapFlag = true;
                }
            }, function(response) {
                //error callback
                if (typeof response.data.message === 'undefined')
                    alert("Error: " + response.statusText);
                else
                    alert("Error: " + response.data.message);
            });
        }

        //Function to hide map and table on click of button
        $scope.hideMap = function() {
            $scope.hideMapFlag = true;
        }

        //Function to intialize map
        $scope.initMap = function() {
            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: 10
            };
            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            var geocoder = new google.maps.Geocoder();

            /*Bound default address to US*/
            geocoder.geocode({
                'address': 'US'
            }, function(results, status) {
                var ne = results[0].geometry.viewport.getNorthEast();
                var sw = results[0].geometry.viewport.getSouthWest();
                $scope.map.fitBounds(results[0].geometry.viewport);
                $scope.plotPlaces();
            });
        }

        //Function to plot locations on the graph
        $scope.plotPlaces = function() {
            var latLng = {
                lat: 0,
                lng: 0
            };
            for (var i = 0; i < $scope.locations.length; i++) {
                latLng = {
                    lat: $scope.locations[i].latitude,
                    lng: $scope.locations[i].longitude
                };
                var marker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    title: $scope.locations[i].name
                });
            }
        }


        // Function to fetch numerical data
        $http(req).then(function(response) {
            //success callback
            if (response.status == 200) {
                $scope.visitors = response.data.visitors;
                //console.log($scope.visitors);
            } else {
                alert("Error: " + response);
                $scope.hideGraphFlag = true;
            }
        }, function(response) {
            //error callback
            if (typeof response.data.message === 'undefined')
                alert("Error: " + response.statusText);
            else
                alert("Error: " + response.data.message);
        });

        // Function to fetch graph on click of button
        $scope.fetchGraph = function() {
            $scope.hideGraphFlag = false;
            // GET request

        }

        //Function to hide graph on click of hide button
        $scope.hideGraph = function() {
            $scope.hideGraphFlag = true;
        }

        /* PHASE 2 CODE */

        // Database connection request which fetches the size of collection movie in mongodb.
        var db_req = {
            method: 'GET',
            url: 'https://cse5335-asa8284-project2.herokuapp.com/connectToDatabase',
            //url: 'http://localhost:8081/connectToDatabase',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // function which executes db_req
        $scope.connectToDatabase = function(){
            // connect to database
            $http(db_req).then(function(response) {
                //success callback
                if (response.status == 200) {
                    $scope.dbSize = response.data.length;
                } else {
                    $scope.dbConnFlag = false;
                    $scope.dbSize = -1;
                    alert("Error: " + response);
                }
            }, function(response) {
                //error callback
                $scope.dbConnFlag = false;
                $scope.dbSize = -1;
                if (typeof response.data.message === 'undefined')
                    alert("Error: " + response.statusText);
                else
                    alert("Error: " + response.data.message);
            });
        }

        // This function initiates the load one record at a time every 0.5 seconds
        $scope.loadDataFromDb = function(){
            if($scope.buttonText == "Reload Data from Database"){
                $scope.spinnerFlag = false;
                $scope.spinnerRotationFlag = false;    
            }
            $scope.movieQueue = [];
            $scope.counter = 0;
            $scope.spinnerFlag = true;
            $scope.spinnerRotationFlag = true;
            $scope.buttonText = "Working on it...";
            if($scope.dbConnFlag == false || $scope.dbSize == -1){
                if($scope.dbConnFlag == true && $scope.dbSize == -1)
                    alert("Error: No records found ....");
                else
                    alert("Error: Cannot connect to database ....");
            }else{
                // load one record per 0.5 seconds
                var i = 0;
                console.log("size: " + $scope.dbSize);
                // start the 0.5 second load record from server
                $scope.start();
            }
        }

        // function to fetch one record at a time from server
        $scope.loadOneRecord = function(){
            if($scope.counter <= $scope.dbSize){
                req_i.url = 'https://cse5335-asa8284-project2.herokuapp.com/getMovie/' + $scope.counter;
                $http(req_i).then(function(response) {
                    //success callback
                    if (response.status == 200) {
                        $scope.movieQueue.push(response.data);
                    } else {
                        $scope.dbConnFlag = false;
                        $scope.dbSize = -1;
                        alert("Error: " + response);
                    }
                }, function(response) {
                    //error callback
                        
                });
            }else{
                // when all the records are fetched interrupt the interval
                $scope.stop(1);           
            }
            $scope.counter++;
        }

        // starts the loading of one record at a time every 0.5 seconds
        $scope.start = function() {
            // stops any running interval to avoid two intervals running at the same time
            $scope.stop(0); 
            // store the interval promise
            promise = $interval($scope.loadOneRecord, 500);
        };
  
        // stops the interval
        $scope.stop = function(val) {
            // val is 1 if stop is called after reading all the records from collecction, else it is 0
            if(val == 1){
                $scope.buttonText = "Reload Data from Database";
                $scope.spinnerRotationFlag = false;
                $scope.showButtonFlag = false;     
            }
            $interval.cancel(promise);   
        };

        // show project 1 functionality
        $scope.showProject1 = function(){
            $scope.showProject1Flag = true;
        }

        // hide project 1 functionality
        $scope.hideProject1 = function(){
            $scope.showProject1Flag = false;
        }

        // clear data from database 
        $scope.clearDataFromDb = function(){
            $scope.showButtonFlag = true;
            $scope.movieQueue = [];
            $scope.spinnerFlag = false;
            $scope.spinnerRotationFlag = false;
            $scope.buttonText = "Fetch Data from Database";
        }

        // connect to database on load by default
        $scope.connectToDatabase();
    }]);
