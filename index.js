const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer =document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

let currentTab=userTab;
let API="168771779c71f3d64106d8a88376808a";
currentTab.classList.add("current-tab");

function switchTab(clickedTab){
if(clickedTab!=currentTab){
    console.log(currentTab);
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    console.log(currentTab);
    currentTab.classList.add("current-tab");
//if searchform wala is visible;
if(!searchForm.classList.contains("active")){
userContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
searchForm.classList.add("active");
}
else{
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getfromseccion();
}
}
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})

function getfromseccion(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=json.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
const{lat,lon}=coordinates;
grantAccessContainer.classList.remove("active");
loadingScreen.classList.add("active");
// API
try{
    const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API}&units=metric`);
    const data= await response.json(); 
    loadingScreen.classList.remove("active");      
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}
catch(err){
    loadingScreen.classList.remove("active");  
}
}

function renderWeatherInfo(weatherInfo){
const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-cityIcon]");
const desc=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-imgIcon]");
const temp=document.querySelector("[data-temp]");
const windspeed=document.querySelector("[data-windSpeed]");
const humidity=document.querySelector("[data-humidity]");
const cloudiness=document.querySelector("[data-cloudiness]");
console.log("")
// fetch values
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // 
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        console.log("abc");
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`
 );
        const data = await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        // 
    }
}