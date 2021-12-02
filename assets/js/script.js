let APIKEY = '79739181b58a97089ce8160662a34b35';
let city, lat, lon;
let requestUrl, dt, date, loc, icon, line, temp, wind, humd, title; 
let dtf, datef, iconf, tempf, windf, humdf;
let day = [];
let current = [];
let a, b, result, rev = [];
let run = 0;

searchHistory()

// SEARCH FOR NEW CITY
$("button").click(function(e) {
    if (run !== 0) {
        day = [];
        current = [];
    }
    city = e.target.textContent;
    if (city === 'Search') {
        city = $("#query").val();
    }
    getApi(); 
});

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
        });
}

// CURRENT WEATHER
function getApi2() {
    requestUrl = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKEY}`;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            icon = data.current.weather[0].icon;
            temp = data.current.temp;
            wind = data.current.wind_speed;
            humd = data.current.humidity;
            uvi = data.current.uvi;
            current.push(city, datef, icon, temp, wind, humd, uvi)
            addWeather();
        })
}

// ADD INFORMATION TO THE SCREEN
function addWeather() {
    // 5 DAY FORECAST
    for (let i =0; i < day.length; i++) {
        let j = i + 1;
        $("#dd"+j).empty().append(day[i][0]);
        $("#di"+j).attr('src', day[i][1]);
        $("#dt"+j).empty().append(`Temp: ${day[i][2]} °F`);
        $("#dw"+j).empty().append(`Wind: ${day[i][3]} MPH`);
        $("#dh"+j).empty().append(`Humidity: ${day[i][4]} %`);
        $("#day"+j).addClass("activeday");
        $("#today").addClass("todayBox");
    }
    $('#fiveday').empty().append("5 Day Forecast:");

    // CURRENT DAY    
    title = current[0] + " (" + current[1] + ")";
    $("#loc").empty().append(title);
    $("#icn").attr('src', `http://openweathermap.org/img/w/${current[2]}.png`);
    $("#temp").empty().append(`Temp: ${current[3]} °F`);
    $("#wind").empty().append(`Wind: ${current[4]} MPH`);
    $("#humd").empty().append(`Humidity: ${current[5]} %`);
    $("#block1").empty().append("UV Index: ");
    $("#block2").empty().append(current[6]);
    $("#curr").addClass("todayBox");
    if (current[6] < 3) {
        $("#block2").addClass("uvig");
    } else if (current[6] < 8) {
        $("#block2").addClass("uvim");
    } else {
        $("#block2").addClass("uvib");
    }
    run++;
    locations()  
}

// ADD SEARCHED CITY TO LOCAL STORAGE
function locations() {
    if (localStorage.getItem("locations") === null) {
        $(".hidden1").attr({id: "city1", class: "form-control", vlaue: city});
        $("#city1").html(city);
        newData = [city];
        localStorage.setItem("locations", JSON.stringify(newData));
    } else {
        a = JSON.parse(localStorage.getItem("locations")) || [];
        if (jQuery.inArray(city, a) === -1) {
            newData = city;
            a.push(newData);
            localStorage.setItem("locations", JSON.stringify(a));
        }

        b = JSON.parse(localStorage.getItem("locations")) || [];
        result = [];
        $.each(b, function(i, e) {
            if ($.inArray(e, result) == -1) result.push(e);
        });
        rev = result.reverse();
        for (let i = 0; i < rev.length; i++) {
            let j = i + 1;
            $(".hidden"+j).attr({id: "city"+j, class: "form-control", vlaue: rev[i]});
            $("#city"+j).html(rev[i]);
        }
    }
}

// PULL SEARCH HISTORY FROM LOCAL STORAGE AND CREATE BUTTONS
function searchHistory() {
    if (localStorage.getItem("locations") !== null) {
        b = JSON.parse(localStorage.getItem("locations")) || [];
    }
    result = [];
    $.each(b, function(i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    rev = result.reverse();
    for (let i = 0; i < rev.length; i++) {
        let j = i + 1;
        $(".hidden"+j).attr({id: "city"+j, class: "form-control", vlaue: rev[i]});
        $("#city"+j).html(rev[i]);
    }
}