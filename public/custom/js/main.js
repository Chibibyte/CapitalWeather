import countdown from './countdown.js';

window.chartcontent = {};

let countdownP = countdown.getElementsByClassName('countdown-p')[0];
let countdownPValue = countdown.getElementsByClassName('countdown-p-value')[0];

countdownP.innerHTML = "";
countdownPValue.innerHTML = "na";


/**
 * Fetches the lates weather data from the server
 */
function fetchWeather() {
    return fetch('/res/weather.json').then(res => res.json())
}

/**
 * Updates the weather data with @weather
 * 
 * @param {object} weather 
 */
function setWeather(weather) {
    Object.keys(weather).forEach(cityId => {
        let w = weather[cityId];
        window.chartcontent[cityId] = w;
    })
}

/**
 * Array of promises to wait for multiple promises at once (synchronization)
 */
let dataPromises = [];
dataPromises.push(new Promise((resolve) => {
    resolve('resolved');
}));
dataPromises.push(fetchWeather());

// let socket = io.connect(`http://localhost:4000/`);
let socket = io.connect(`${window.location.href}`);

/**
 * Synchronize fetch for weather data and city position data
 */
Promise.all(dataPromises)
    .then(values => {
        let weather = values[1];
        setWeather(weather);

        socket.on('freshData', function () {
            fetchWeather()
                .then(weather => {
                    setWeather(weather);
                })
                .catch(err => console.error(err))
        })

        socket.on('countdown', function (data) {
            countdownP.innerHTML = ``;
            countdownPValue.innerHTML = `${data.countdown}`;
        })
    })
    .catch(err => console.error(err))

