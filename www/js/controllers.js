angular.module('starter.controllers', [])

  .controller('weatherController', function($scope, $http, $cordovaGeolocation, $window, $ionicLoading) {
    
    //Global Variables(Universal in all functions--------------------------------------------------------
    var posOptions = {timeout: 10000, enableHighAccuracy: true};
    var latitude;
    var longitude;
    var timeObject;
    var appID = "53f9d8e4213222cf517d86dc406d67fc";


    //--------------------------------------------------------------------------------------------------

    //Gets coordinates and time-------------------------------------------------------------------------
    $scope.location = function(){
      $scope.show();

      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {

          latitude  = position.coords.latitude; 
          longitude = position.coords.longitude;
          timeObject = position.timestamp;
          $scope.network = "";
          console.log(position);
          $scope.weather();
        }, function(err) {
          $scope.network = "Please check connection";
          alert("could not find your location, please check network connection");

          $ionicLoading.hide();

        }); 
        //Force the spinner to hide incase it fails
        if($scope.shower == true){
          $ionicLoading.hide();
          console.log("hidden here");
        }

    }

    //--------------------------------------------------------------------------------------------------

    /*Uses latitude, longitude and appID to get the weather object
      *Requests for weather object from openweathermap.org------------------------------------------------
    */
    $scope.weather=function(){
  

      $scope.show();

      $http.get("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&APPID="+appID).success(function(response){
        $ionicLoading.hide();
        $scope.degrees = "o";
        $scope.celcius = "C";
        $scope.locationIcon = "ion-ios-location";
        $scope.comma = ",";
        var timestamp = timeObject;//Time comes from position object, geolocation API call
        var pubDate = new Date(timestamp).getHours();
        $scope.pubDate = pubDate;
        var minutes = new Date(timestamp).getMinutes();
        $scope.minutes = minutes;
        $scope.network = "";


        $scope.weatherObject = response;
        $scope.temperature = ($scope.weatherObject.main.temp - 273).toFixed(0);//chops off all the decimals

        $scope.weatherIcon = $scope.weatherObject.weather[0].id;
        //check weather codes
        if($scope.weatherIcon == 800){
          //Use timestamp to check time of the day
          if (pubDate >= 18 && pubDate <=23 || pubDate >= 0 && pubDate <= 5) {
            $scope.icon = "ion-ios-moon";
            $scope.image = "moon-and.jpg";
          }else{
            $scope.icon = "ion-ios-sunny";
            $scope.image = "clear-sky.jpg";
          }

        }else if($scope.weatherIcon >= 200 || $scope.weatherIcon <= 202 || $scope.weatherIcon >= 232 || $scope.weatherIcon <= 232 || $scope.weatherIcon >= 300 || $scope.weatherIcon <= 321 || $scope.weatherIcon >= 500 || $scope.weatherIcon <= 531 || $scope.weatherIcon == 615 || $scope.weatherIcon == 616 ){
          $scope.icon = "ion-ios-rainy";

          $scope.image = "rain.jpg";
        }else if($scope.weatherIcon >= 801 || $scope.weatherIcon <= 803 ){
          if (pubDate >= 18 && pubDate <=23 || pubDate >= 0 && pubDate <= 5) {
            $scope.icon = "ion-ios-cloudy-night";
            $scope.image  = "moon-and-stars-in-the-sky.jpg"
          }else{
            $scope.icon = "ion-ios-partlysunny";
            $scope.image = "broken-clouds.jpg";
          }

        }else if($scope.weatherIcon == 804 ){
          $scope.icon = "ion-ios-cloudy";
          $scope.image = "overcast.jpg";

        }else{
          $scope.icon = "ion-ios-partlysunny";
          $scope.image = "broken-clouds.jpg";

        }

      }).error(function(err){

        $ionicLoading.hide();

        alert("Can't find data, please check network and try again")
        $scope.network = "\nPlease check connection"

        $ionicLoading.hide();


      })
    }

    //-------------------------------------------------------------------------------------------------

    //spinner -----------------------------------------------------------------------------------------
    $scope.show = function(){
      $ionicLoading.show({
        template: "<ion-spinner icon='bubbles'></ion-spinner>"
      });
      $scope.shower = true;
    };

    //------------------------------------------------------------------------------------------------
   
    //Reloads the page--------------------------------------------------------------------------------
    $scope.reload = function(){
      $scope.show();

      $window.location.reload();
    }
    //-----------------------------------------------------------------------------------------------
  });//ENDS

