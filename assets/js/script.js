let APIKEY ;
let city, lat, lon;
let requestUrl, dt, date, loc, icon, line, temp, wind, humd, title; 
let dtf, datef, iconf, tempf, windf, humdf;
let day = [];
let current = [];

$("#aus").click(function() {
    city = 'Austin';
    getApi();
})

// FIVE DAY FORECAST AND GET LAT/LON OF CITY
function getApi() {
    requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            lat = data.city.coord.lat;
            lon = data.city.coord.lon;
            let days = [4,12,20,28,32];
            for (let i = 0; i < days.length; i++) {
                dtf = data.list[days[i]].dt_txt.split(" ", 1)[0].split('-');
                datef = dtf[1] + '/' + dtf[2] + '/' + dtf[0];
                icf = data.list[days[i]].weather[0].icon;
                iconf = `http://openweathermap.org/img/w/${icf}.png`;
                tempf = data.list[days[i]].main.temp;
                windf = data.list[days[i]].wind.speed;
                humdf = data.list[days[i]].main.humidity;
                day.push([datef, iconf, tempf, windf, humdf]);
            }
            getApi2();
            addWeatherF();
        });
}

// TODAYS WEATHER
function getApi2() {
    requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('today', data);
            icon = data.current.weather[0].icon;
            temp = data.current.temp;
            wind = data.current.wind_speed;
            humd = data.current.humidity;
            uvi = data.current.uvi;
            current.push(city, datef, icon, temp, wind, humd, uvi)
            addWeather();
        })
}

function addWeatherF() {
    for (let i =0; i < day.length; i++) {
        let j = i + 1;
        $("#dd"+j).append(day[i][0]);
        $("#di"+j).attr('src', day[i][1]);
        $("#dt"+j).append(`Temp: ${day[i][2]} °F`);
        $("#dw"+j).append(`Wind: ${day[i][3]} MPH`);
        $("#dh"+j).append(`Humidity: ${day[i][4]} %`);
        $("#day"+j).addClass("activeday");
    }
    $("#today").addClass("todayBox");
    $('#fiveday').append("5 Day Forecast:")
}

function addWeather() {
    title = current[0] + " " + current[1];
    $("#loc").append(title);
    $("#icn").attr('src', `http://openweathermap.org/img/w/${current[2]}.png`);
    $("#temp").append(`Temp: ${current[3]} °F`);
    $("#wind").append(`Wind: ${current[4]} MPH`);
    $("#humd").append(`Humidity: ${current[5]} %`);
    $("#uv").append(`UV Index: ${current[6]}`);
    $("#curr").addClass("todayBox");
}