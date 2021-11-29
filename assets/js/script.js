let APIKEY = 
let requestUrl;
let dt, date, icon, temp, wind, humd;
let day = [];

$("#aus").click(function() {
    requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=Austin&units=imperial&appid=${APIKEY}`;
    getApi(requestUrl);
})

function getApi(requestUrl) {
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let days = [4,12,20,28,32];
            for (let i = 0; i < days.length; i++) {
                dt = data.list[days[i]].dt_txt.split(" ", 1)[0].split('-');
                date = dt[1] + '/' + dt[2] + '/' + dt[0];
                ic = data.list[days[i]].weather[0].icon;
                icon = `http://openweathermap.org/img/w/${ic}.png`;
                temp = data.list[days[i]].main.temp;
                wind = data.list[days[i]].wind.speed;
                humd = data.list[days[i]].main.humidity;
                day.push([date, icon, temp, wind, humd]);
            }
            addWeather();
        });
}

function addWeather() {
    for (let i =0; i < day.length; i++) {
        let j = i + 1;
        $("#dd"+j).append(day[i][0]);
        $("#di"+j).attr('src', day[i][1]);
        $("#dt"+j).append(`Temp: ${day[i][2]} °F`);
        $("#dw"+j).append(`Wind: ${day[i][3]} MPH`);
        $("#dh"+j).append(`Humidity: ${day[i][4]} %`);
        $("#day"+j).addClass("activeday");
    }
}