$(function () {
    const APIkey = "00f1e27c525779abd789e9e39c2e8f81"

    let userSearch = $('#input-search').val();
    $('#input-search').val('')
    
    let searches = JSON.parse(localStorage.getItem('searches') || '[]');
    
    function handleNewSearch(userSearch) {
        searches.push(userSearch)
        let updatedSearches = JSON.stringify(searches)
        localStorage.setItem('searches', updatedSearches);
        const ulEl = $('.search-history')
        ulEl.empty()
        
        if (searches.length > 10) {
            searches = searches.slice(-10)
        }
        for (let i = searches.length - 1; i >= 0; i--) {
            let liEl = $('<li>').text(searches[i])
            liEl.on('click', function () {
                handleNewSearch(searches[i])
            })
            ulEl.append(liEl)
        }
        if (userSearch !== "") {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${userSearch}&units=imperial&appid=${APIkey}`
            const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?appid=${APIkey}&q=${userSearch}&units=imperial`
            fetch(url)
                .then(function (resp) {
                    return resp.json()
                })
                .then(function (data) {
                    console.log(data)
                    renderFiveDay(data)
                })
                .then(()=>{
                    fetch(urlCurrent)
                    .then(function (resp){
                        return resp.json()
                    })
                    .then(function(data) {
                        console.log(data)
                        renderWeather(data)
                    })
                }) 
        }
    }
    $("#search-btn").on("click", function (e) {
        e.preventDefault()
        userSearch = $('#input-search').val()
        handleNewSearch(userSearch)
        $('#input-search').val('')

    });


    handleNewSearch()

    const resultsContainer = $('#current-weather-div')
    function renderWeather(weather) {
        let city = $('<h2>').text(`City: ${weather.name}`);
        let date = $('<p>').text(`Date: ${dayjs.unix(weather.dt).format("MM-DD-YY")}`);
        let icon = $('<img>').attr('src', `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
        let temp = $('<p>').text(`Temp: ${weather.main.temp}`);
        let humidity = $('<p>').text(`Humidity: ${weather.main.humidity}`);
        let windSpeed = $('<p>').text(`Windspeed: ${weather.wind.speed}`);

        // Append the elements to a container in the HTML
        resultsContainer.empty()
        resultsContainer.append(city, date, icon, temp, humidity, windSpeed)
    }

    function renderFiveDay(data) {
        const fiveDayContainer = $('#five-day-div')
        console.log(data)
        for (let i = 0; i < data.list.length; i+=8) {
            let dayContainer = $('<div id="day-container[i]">')
            let date = $('<p>').text(`Date: ${dayjs.unix(data.list[i].dt).format("MM-DD-YY")}`);
            let icon = $('<img>').attr('src', `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
            let temp = $('<p>').text(`Temp: ${data.list[i].main.temp}`);
            let humidity = $('<p>').text(`Humidity: ${data.list[i].main.humidity}`);
            let windSpeed = $('<p>').text(`Windspeed: ${data.list[i].wind.speed}`);

            dayContainer.append(date, icon, temp, humidity, windSpeed)
            fiveDayContainer.append(dayContainer)
            
        }

    }

})