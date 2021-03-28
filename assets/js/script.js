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
var nameInputEl = document.querySelector("#cityInput");

var formSubmitHandler = function(event) {
    // prevent page from refreshing
    event.preventDefault();
  
    // get value from input element
    var getCity = nameInputEl.value.trim();
  
    if (getCity) {
      getUserCity(getCity);
  
      // clear old content
      userCityTerm.textContent = "";
      nameInputEl.value = "";
    } else {
      alert("Please enter a valid city");
    }
  };