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
        let title = $('<h2>').text(`Five Day Forecast`)
        const fiveDayContainer = $('#five-day-div')

        // Check if the title has already been added
        if (fiveDayContainer.children('h2').length === 0) {
            let title = $('<h2>').text('Five Day Forecast');
            fiveDayContainer.append(title);
        }

    });


    handleNewSearch()

    const resultsContainer = $('#current-weather-div')
    function renderWeather(weather) {
        let title = $('<h2 id="title">').text(`Current Weather`);
        let city = $('<h3 id="city">').text(`City: ${weather.name}`);
        let date = $('<p>').text(`Date: ${dayjs.unix(weather.dt).format("MM-DD-YY")}`);
        let icon = $('<img>').attr('src', `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
        let temp = $('<p>').text(`Temp: ${weather.main.temp}`);
        let humidity = $('<p>').text(`Humidity: ${weather.main.humidity}`);
        let windSpeed = $('<p>').text(`Windspeed: ${weather.wind.speed}`);

        // Append the elements to a container in the HTML
        resultsContainer.empty()
        resultsContainer.append(title, city, icon, date, temp, humidity, windSpeed)
        
    }

    function renderFiveDay(data) {
        let title = $('<h2>').text(`Five Day Forecast`)
        const fiveDayContainer = $('#five-day-div')

        for (let i = 0; i < data.list.length; i+=8) {
            let dayContainer = $('<div>').attr('id', 'day-container' + i)
            let date = $('<p>').text(`Date: ${dayjs.unix(data.list[i].dt).format("dddd-MM-DD-YY")}`);
            let icon = $('<img>').attr('src', `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`);
            let temp = $('<p>').text(`Temp: ${data.list[i].main.temp}`);
            let humidity = $('<p>').text(`Humidity: ${data.list[i].main.humidity}`);
            let windSpeed = $('<p>').text(`Windspeed: ${data.list[i].wind.speed}`);

            dayContainer.append(icon, date, temp, humidity, windSpeed)
            fiveDayContainer.append(dayContainer)
            
        }

    }

})