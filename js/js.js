// Required variables
var Cq;
var cL;
var citylong;
var weather;
var cH = [];

// Fetching the weather
async function fetchWeather(){
        weather = await fetch( `https://api.openweathermap.org/data/2.5/onecall?lat=${cL}&lon=${citylong}&exclude=hourly&appid=df7ce556761f98dad07fc817248b0429` ).then( (weather)=>weather.json() )
        renderWeather();
        if(!cH.find(function(cities){
            return cities.city == Cq;
        })){
            document.querySelector("#search-history").innerHTML += `<button type="button" class="btn btn-outline-dark">${Cq}</button>`
        } else {
            document.querySelector("#city-input").value = "";
        }
        if(localStorage.getItem("cH")){
            cH = JSON.parse(localStorage.getItem("cH"));
        }
        if(!cH.find(function(cities){
            return cities.city == Cq;
        })){
            cH.push({city: Cq, lat: cL, long: citylong});
            localStorage.setItem("cH", JSON.stringify(cH));
        }
}

// Converting the city name into longitude and latitude
async function fetchLocation(){
    const res = await fetch( `https://api.opencagedata.com/geocode/v1/json?q=${Cq}&key=15c163f7b80843da8be9c263a4aad238` ).then( (res)=>res.json() );
    if(res.Allresults.length == 0){
        document.querySelector("#city-input").value = "";
        document.querySelector("#alert-area").innerHTML =
            `<div class="alert alert-secondary alert-dismissible fade show" role="alert">
            <strong>Hold up!</strong> Please check the spelling of your city.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`;
    } else {
    cL = res.Allresults[0].geometry.lat;
    citylong = res.Allresults[0].geometry.lng;
    fetchWeather();
    }
}

// Render the weather info on the page
function renderWeather(){
    document.querySelector("#city-input").value = "";
    document.querySelector(".forecast-div").style = "display: block";
    document.querySelector("#content-city").textContent = Cq;
    document.querySelector("#temperature").textContent = `Temperature: ${(weather.current.temp-273.15).toFixed(1)} °C`;
    document.querySelector("#humidity").textContent = `Humidity: ${weather.current.humidity} %`;
    document.querySelector("#wind").textContent = `Wind speed: ${weather.current.wind_speed} km/h`;
    document.querySelector("#uv").innerHTML = `UV index: <span class="uv-warning">${weather.current.uvi}</span>`;
    document.querySelector(".header-icon").innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png"  alt="Icon today's weather"/>`
    var uvi = weather.current.uvi;
    if(uvi<=2){
        document.querySelector(".uv-warning").style = "background-color: green; color: white";
    } else if(uvi>2 && uvi<=5){
        document.querySelector(".uv-warning").style = "background-color: yellow";
    } else if(uvi>5 && uvi<=7){
        document.querySelector(".uv-warning").style = "background-color: orange";
    } else if(uvi>7 && uvi<=10){
        document.querySelector(".uv-warning").style = "background-color: red; color: white";
    } else if(uvi>10){
        document.querySelector(".uv-warning").style = "background-color: violet";
    };
    document.querySelector("#today").textContent = `Today, ${moment().format("LL")}`;
    for(i=1; i<6; i++){
        document.querySelector(`#forecast-${i}-day`).textContent = moment().add(i, 'day').format("LL");
        document.querySelector(`#forecast-${i}-icon`).innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.daily[i].weather[0].icon}@2x.png" alt="Icon forecast day ${i}"/>`;
        document.querySelector(`#forecast-${i}-temp`).textContent = `Temp: ${(weather.daily[i].temp.day-273.15).toFixed(1)} °C`;
        document.querySelector(`#forecast-${i}-humid`).textContent = `Humidity: ${weather.daily[i].humidity} %`;
    }
}

// Render buttons for each searched city
document.querySelector("#city-search").addEventListener("click", function(){
    Cq = document.querySelector("#city-input").value;
    fetchLocation();
})

// Make searched cities clickable
const buttons = document.querySelector("#search-history");
buttons.addEventListener("click", function(event){
    if(event.target.className == "btn btn-outline-dark"){
        Cq = event.target.textContent;
        fetchLocation();
    }
})

// Render search history upon loading the page
function renderHistory(){
    if(localStorage.getItem("cH")){
        cH = JSON.parse(localStorage.getItem("cH"));
        cH.forEach(function(data){
            document.querySelector("#search-history").innerHTML += `<button type="button" class="btn btn-outline-dark">${data.city}</button>`;
        })
        Cq = cH[cH.length-1].city;
        document.querySelector(".forecast-div").style = "display: block";
        fetchLocation();
    }
}
renderHistory();

// Clear history and reset overview
function clearHistory(){
    if(localStorage.getItem("cH")){
        localStorage.removeItem("cH");
        Cq = "";
        cL = "";
        citylong = "";
        weather = "";
        cH = [];
        document.querySelector("#search-history").innerHTML = "";
        document.querySelector(".forecast-div").style = "display: none";
        document.querySelector("#content-city").textContent = "Welcome to your weather forecast!";
        document.querySelector("#temperature").textContent = "";
        document.querySelector("#humidity").textContent = "";
        document.querySelector("#wind").textContent = "";
        document.querySelector("#uv").textContent = "";
        document.querySelector(".header-icon").innerHTML = "";
        document.querySelector("#today").textContent = "";
        $('#confirmModal').modal("hide");
    }
}

// Confirm clearing
document.querySelector("#clear-btn").addEventListener("click", function(){
    $('#confirmModal').modal();
});