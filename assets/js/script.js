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
var cityArray = JSON.parse(localStorage.getItem("savedCities")) || [];

//logging stats into fields to respective day

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
      
      userCityTerm.textContent = getCity.charAt(0).toUpperCase() + getCity.slice(1);
      fetchUserCity(getCity);
    } else {
      alert("Please enter a valid city");
      userCityTerm.textContent = "No city found.";
    }
  };

//Grab the weather data from open weather API 
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
            // console.log(data.main);
            var showFeatureHumidity = data.main.humidity;
            $("#feature-hum").html(showFeatureHumidity + "% Humidity");
            var showFeatureTemp = data.main.temp;
            $("#feature-temp").html(showFeatureTemp + "°C");
            var showFeatureWindSpeed = data.wind.speed;
            $("#feature-ws").html(showFeatureWindSpeed + "M/s");
            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;
            // console.log(cityLon + cityLat);
            getFeatureUV(cityLat, cityLon);
            getFiveDay(getCity);
            var featureIconParam = data.weather[0].icon;
            
            getFeatureIcon(featureIconParam);
            cityLocalStorage(getCity);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to retrieve weather at this time");
      })    
  };

//saving the typed city to local storage
function cityLocalStorage(getCity){
  //saving to variable if it hasn't already been
  if (cityArray.indexOf(getCity) == -1) {
    cityArray.push(getCity)
    localStorage.setItem("savedCities", JSON.stringify(cityArray));
  } else {
    console.log("city already added");
  }
};

function loadPreviousSearches() {
  
  var retrievedCities = localStorage.getItem("savedCities");
  var parsedCities = JSON.parse(retrievedCities);
  var ulParent = $(".list-group ul");
  
for (let city of parsedCities) {
    // Create a <button> element
    var elBtn = $("<li>")
        .addClass("list-group-item list-group-item-action bullet")
        .attr("type", "button")
        .text(city);

    // Append our <li> element to the <ul> parent (declared above)
    ulParent.append(elBtn);
  }
};

//UV index load
  var getFeatureUV = function(cityLat, cityLon) {
    // format the github api url
    var uvApiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLat + "&lon=" + cityLon + "&appid=d54cfa2ed5bc0e68265280e781008c3e";
    // console.log("you are in the UV function");
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
        alert("Unable to retrieve UV at this time");
      });
  }

  //style the UV
  function colorUv(showFeatureUv) {
    $("#feature-uv").removeClass("green-safe");
    $("#feature-uv").removeClass("orange-warning");
    $("#feature-uv").removeClass("red-alert");
    console.log("you are in the UV color function");
    var featureUv = document.querySelector("#feature-uv");
    if(showFeatureUv <= 2) {
      $(featureUv).addClass("green-safe");
    }
    else if(showFeatureUv >= 3 && showFeatureUv <= 5) {
      $(featureUv).addClass("orange-warning");
    }
    else if(showFeatureUv >= 6) {
      $(featureUv).addClass("red-alert");
    }
    else {
      $("#feature-uv").addClass("grey-not-working");
    }
  }

function getFiveDay(getCity) {
  var forcastApiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + getCity + "&units=metric&appid=d54cfa2ed5bc0e68265280e781008c3e";
  
  // make a get request to url
  fetch(forcastApiUrl)
    .then(function(response) {

      // if the request is working
      if (response.ok) {
        // console.log(response);
        response.json().then(function(data) {
          console.log(data.list[1].main.temp);
          // var showFeatureHumidity = data.main.humidity;
          // $("#feature-hum").html(showFeatureHumidity + "% Humidity");
          var dayOneTemp= Math.round(data.list[1].main.temp);
          $("#temp-one").html("Temp: " + dayOneTemp + "°C");
          var dayOneWind= data.list[1].wind.speed;
          $("#wind-one").html("Wind: " + dayOneWind + "M/s");
          var dayOneHum= data.list[1].main.humidity;
          $("#humidity-one").html("Humidity: " + dayOneHum + "%");
          var dayOneIcon = data.list[1].weather[0].icon;
          console.log(dayOneIcon);
          var imageOne = " ";
          var imageOne = document.createElement('img')
          var imgUrl = "http://openweathermap.org/img/wn/" + dayOneIcon + "@2x.png";
          imageOne.src  = imgUrl;
          document.querySelector('#icon-one').appendChild(imageOne);


          //Forcast Day Two
          var dayTwoTemp= Math.round(data.list[2].main.temp);
          $("#temp-two").html("Temp: " + dayTwoTemp + "°C");
          var dayTwoWind= data.list[2].wind.speed;
          $("#wind-two").html("Wind: " + dayTwoWind + "M/s");
          var dayTwoHum= data.list[2].main.humidity;
          $("#humidity-two").html("Humidity: " + dayTwoHum + "%");
          var dayTwoIcon = data.list[2].weather[0].icon;
          var imageTwo = " ";
          var imageTwo = document.createElement('img')
          var imgUrlTwo = "http://openweathermap.org/img/wn/" + dayTwoIcon + "@2x.png";
          imageTwo.src  = imgUrlTwo;
          document.querySelector('#icon-two').appendChild(imageTwo);


          //Forcast Day Three
          var dayThreeTemp= Math.round(data.list[3].main.temp);
          $("#temp-three").html("Temp: " + dayThreeTemp + "°C");
          var dayThreeWind= data.list[3].wind.speed;
          $("#wind-three").html("Wind: " + dayThreeWind + "M/s");
          var dayThreeHum= data.list[3].main.humidity;
          $("#humidity-three").html("Humidity: " + dayThreeHum + "%");
          var dayThreeIcon = data.list[3].weather[0].icon;
          var imageThree = " ";
          var imageThree = document.createElement('img')
          var imgUrlThree = "http://openweathermap.org/img/wn/" + dayThreeIcon + "@2x.png";
          imageThree.src  = imgUrlThree;
          document.querySelector('#icon-three').appendChild(imageThree);


          //Forcast Day Four
          var dayFourTemp= Math.round(data.list[4].main.temp);
          $("#temp-four").html("Temp: " + dayFourTemp + "°C");
          var dayFourWind= data.list[4].wind.speed;
          $("#wind-four").html("Wind: " + dayFourWind + "M/s");
          var dayFourHum= data.list[4].main.humidity;
          $("#humidity-four").html("Humidity: " + dayFourHum + "%");
          var dayFourIcon = data.list[4].weather[0].icon;
          var imageFour = " ";
          var imageFour = document.createElement('img')
          var imgUrlFour = "http://openweathermap.org/img/wn/" + dayFourIcon + "@2x.png";
          imageFour.src  = imgUrlFour;
          document.querySelector('#icon-four').appendChild(imageFour);


          //Forcast Day Five
          var dayFiveTemp= Math.round(data.list[5].main.temp);
          $("#temp-five").html("Temp: " + dayFiveTemp + "°C");
          var dayFiveWind= data.list[5].wind.speed;
          $("#wind-five").html("Wind: " + dayFiveWind + "M/s");
          var dayFiveHum= data.list[5].main.humidity;
          $("#humidity-five").html("Humidity: " + dayFiveHum + "%");
          var dayFiveIcon = data.list[5].weather[0].icon;
          var imageFive = " ";
          var imageFive = document.createElement('img')
          var imgUrlFive = "http://openweathermap.org/img/wn/" + dayFiveIcon + "@2x.png";
          imageFive.src  = imgUrlFive;
          document.querySelector('#icon-five').appendChild(imageFive);


        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Unable to retrieve five day forcast at this time");
    });     
};

function getFeatureIcon(featureIconParam) {
  var image = " ";
  var image = document.createElement('img')
  // console.log(featureIconParam);
  var imgUrl = "http://openweathermap.org/img/wn/" + featureIconParam + "@2x.png";
  console.log(imgUrl);
  image.src  = imgUrl;
  document.querySelector('#feature-icon').appendChild(image)
}

//Clicking previous search history
$('#prev-searches').on('click', 'li', function(event){
  event.preventDefault();
  console.log("hello");
  getCity = $(this).text(); 
  console.log(event.target);
  console.log(getCity);
  //put the city name in the display
  userCityTerm.textContent = "";
  userCityTerm.textContent = getCity.charAt(0).toUpperCase() + getCity.slice(1);
  fetchUserCity(getCity);
});

//Clearing out previous city data, ideally this would be upgraded later to be done on new search
$('#clear-page').click(function() {
  location.reload();
});

userFormEl.addEventListener("submit", formSubmitHandler);
window.addEventListener("load", loadPreviousSearches);