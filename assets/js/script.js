var todaysDate = moment().format('dddd, MMMM Do YYYY');
$("#feature-date").html(todaysDate);
var shortDateOne = moment().add(1, 'days').calendar('l');
var shortDateTwo = moment().add(2, 'days').calendar('l');
var shortDateThree = moment().add(3, 'days').calendar('l');
var shortDateFour = moment().add(4, 'days').calendar('l');
var shortDateFive = moment().add(5, 'days').calendar('l');
$("#date-card-one").html(shortDateOne);
$("#date-card-two").html(shortDateTwo);
$("#date-card-three").html(shortDateThree);
$("#date-card-four").html(shortDateFour);
$("#date-card-five").html(shortDateFive);
var userFormEl = document.querySelector("#search-form");
var userCityTerm = document.querySelector("#feature-name");
var cityInputEl = document.querySelector("#cityInput");
//logging stats into fields to respective day
// var featureTemp = document.querySelector("#feature-temp");
// var featureHum = document.querySelector("#feature-hum");
// var featureWindSpeed = document.querySelector("#feature-ws");




//start function to gather user city to be applied to fetch
var formSubmitHandler = function(event) {
    console.log("At least you got to the submit function");
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var getCity = cityInputEl.value.trim();
    console.log(getCity);
    if (getCity) {
    // clear old content
    userCityTerm.textContent = "";
    // cityinputEl.value = "";
      
      userCityTerm.textContent = getCity;
      fetchUserCity(getCity);
    } else {
      alert("Please enter a valid city");
      userCityTerm.textContent = "No city found.";
    }
  };

//Grab the weather data from open weather API **format this function for current project
var fetchUserCity = function(getCity) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + getCity + "&units=metric&appid=d54cfa2ed5bc0e68265280e781008c3e";
  
    // make a get request to url
    fetch(apiUrl)
      .then(function(response) {

        // if the request is working
        if (response.ok) {
          // console.log(response);
          response.json().then(function(data) {
            console.log(data.main);
            var showFeatureHumidity = data.main.humidity;
            $("#feature-hum").html(showFeatureHumidity + "% Humidity");
            var showFeatureTemp = data.main.temp;
            $("#feature-temp").html(showFeatureTemp + "°C");
            var showFeatureWindSpeed = data.wind.speed;
            $("#feature-ws").html(showFeatureWindSpeed + "M/s");
            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;
            console.log(cityLon + cityLat);
            getFeatureUV(cityLat, cityLon);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to retrieve weather at this time");
      });
          
  };


  var getFeatureUV = function(cityLat, cityLon) {
    // format the github api url
    var uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=d54cfa2ed5bc0e68265280e781008c3e";
    console.log("you are in the UV function");
    fetch(uvApiUrl)
      .then(function(response) {

        // if the request is working
        if (response.ok) {
          // console.log(response);
          response.json().then(function(data) {
            console.log(data);
            var showFeatureUv = data.value;
            $("#feature-uv").html("UV Index : " + showFeatureUv);
            colorUv(Math.round(showFeatureUv));
            console.log(showFeatureUv);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to retrieve weather at this time");
      });
      
  }

  function colorUv(showFeatureUv) {
    $("#feature-uv").removeClass("green-safe");
    $("#feature-uv").removeClass("orange-warning");
    $("#feature-uv").removeClass("red-alert");
    console.log("you are in the UV color function");
    var featureUv = document.querySelector("#feature-uv");
    if(showFeatureUv <= 2) {
      $(featureUv).addClass("green-safe");
    }
    else if(showFeatureUv >= 3 || showFeatureUv <= 5) {
      $(featureUv).addClass("orange-warning");
    }
    else if(showFeatureUv >= 6) {
      $(featureUv).addClass("red-alert");
    }
    else {
      $("#feature-uv").addClass("grey-not-working");
    }
  }
  userFormEl.addEventListener("submit", formSubmitHandler);