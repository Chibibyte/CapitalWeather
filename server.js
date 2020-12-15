const express = require('express');
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
const fs = require('fs');
const socketIO = require('socket.io');
const secConfig = require('./secConfig.js');

const app = express();

module.exports = { app };

let port = 4000;

let server = process.env.port ? process.server : app.listen(port, () => console.log("chartTest listening on port 4000" + ` ${typeof true}`));
let weatherIO = process.serverIO ? process.serverIO : socketIO(server);

// paths
let p_public = __dirname + "/public";
let p_public_res = p_public + "/res";

// middleware
app.use(bodyParser.json());

let memoryWeather = ""; // stores latest weather data
let updateTime = 20; // in seconds

let cities = [
    'Stuttgart',
    'Muenchen',
    'Berlin',
    'Potsdam',
    'Bremen',
    'Hamburg',
    'Wiesbaden',
    'Schwerin',
    'Hannover',
    'Duesseldorf',
    'Mainz',
    'Saarbruecken',
    'Dresden',
    'Magdeburg',
    'Kiel',
    'Erfurt'
];

/**
 * Makes an api-call to https://api.openweathermap.org
 * 
 * @param {string} query 
 */
async function apiCall(query) {
    return fetch(`https://api.openweathermap.org/data/2.5/${query}&units=metric&APPID=${secConfig.API_KEY}`,
        {
            method: 'POST',
            header: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }
    )
        .then(res => res.json())
        .catch(error => console.error(error))
}

/**
 * api-call for specific city
 * 
 * @param {string} city 
 */
async function cityWeather(city) {
    return apiCall(`weather?q=${city},DE`)
}

/**
 * api-call for specific city by id
 * 
 * @param {*} id 
 */
async function cityWeatherById(id) {
    return apiCall(`weather?id=${id}`)
}

/**
 * Collects the ids of the cities in the api
 * Only necessary once, in case data is lost
 */
async function collectIds() {
    let cityIDs = [];
    let promises = [];
    cities.forEach(city => {
        promises.push(cityWeather(city));
    })

    let cityPositions = {};
    Promise.all(promises)
        .then(values => {

            let x = -20;
            let y = -10;
            values.forEach(w => {
                if (w.name) {
                    cityIDs.push({
                        id: w.id,
                        name: w.name
                    })
                    cityIDs[w.name] = w.id;

                    x = (x + 20) % 80;
                    if (x == 0) y = (y + 10) % 80;
                    cityPositions[w.id] = { x, y, name: w.name };
                }
                else console.log(`${city} not found --------------------------------------`);

                fs.writeFile(p_public_res + '/cityIDs.json', JSON.stringify(cityIDs), err => {
                    if (err) throw err;
                })

                // fs.writeFile(p_public_res + '/cityPositions.json', JSON.stringify(cityPositions), err => {
                //     if (err) throw err;
                // })
            })
        })
}

/**
 * Checks if @obj contains the attributes @attrNesting nested in each other in that order
 * e.g.:
 *  obj = {a:{b:{c}}]}: 
 *      containsAttrNesting(obj, [a,b,c]) == true
 *      containsAttrNesting(obj, [a,c,b]) == false
 * 
 * @param {object} obj object to test
 * @param  {...any} attrNesting Array of aatributes to look for
 */
function containsAttrNesting(obj, ...attrNesting) {
    for (let i = 0; i < attrNesting.length; i++) {
        if (!obj[attrNesting[i]]) return false;
        obj = obj[attrNesting[i]];
    }
    return true;
}

/**
 * Makes api-calls for the cities, prepares the weather and city data for the client and stores it in weather.json
 * I decided for a single api-call per city since a call for multiple cities didn't give me all the data i would get from
 * a specific call and openweathermap counts one call for multiple cities as multiple calls anyway. 
 * 
 * @param {function} callback   Callback function that runs once the file is finished
 */
function weather(callback) {
    fs.readFile(p_public_res + '/cityIDs.json', (err, data) => {
        if (err) throw err;
        let jsonData = JSON.parse(data);

        let ids = [];
        jsonData.forEach(d => ids.push(d.id));

        let promises = [];
        ids.forEach(id => {
            promises.push(cityWeatherById(id))
        })

        Promise.all(promises)
            .then(values => {
                let outData = {};
                values.forEach(d => {
                    let cw = {};
                    cw.cityName = d.name;
                    cw.icon = containsAttrNesting(d, 'weather', 0, 'icon') ? d.weather[0].icon : "defWeatherIcon.jpg";
                    cw.desc = containsAttrNesting(d, 'weather', 0, 'description') ? d.weather[0].description : 'Weathery weather';
                    cw.temp = containsAttrNesting(d, 'main', 'temp') ? d.main.temp : 0;
                    cw.pressure = containsAttrNesting(d, 'main', 'pressure') ? d.main.pressure : 0;
                    cw.humidity = containsAttrNesting(d, 'main', 'humidity') ? d.main.humidity : 0;
                    cw.windSpeed = containsAttrNesting(d, 'wind', 'speed') ? d.wind.speed : 0;
                    cw.clouds = containsAttrNesting(d, 'clouds', 'all') ? d.clouds.all : 0;
                    cw.rain1h = containsAttrNesting(d, 'rain', '1h') ? d.rain["1h"] : 0;
                    cw.snow1h = containsAttrNesting(d, 'snow', '1h') ? d.snow["1h"] : 0;
                    cw.visibility = containsAttrNesting(d, 'visibility') ? d.visibility : 100;
                    outData[d.id] = cw;

                    // fix names
                    if (cw.cityName == 'Hanover') cw.cityName = 'Hannover';
                    if (cw.cityName == 'Munich') cw.cityName = 'München';
                })



                fs.writeFile(p_public_res + '/weather.json', JSON.stringify(outData), err => {
                    if (err) throw err;
                    callback();
                })
            })
            .catch(err => console.log(err))
    })
}

// collectIds(); // only necessary if city id data is lost

/**
 * Makes the api-calls, prepares weather.json for the client and starts the countdown interval for the next update
 * 
 * @param {function} callback 
 */
function weatherITVFunction(callback = () => { }) {
    weather(callback);

    let countdown = 19;
    function setITVFunction() {
        weatherIO.emit('countdown', {
            countdown,
            countdownMax: updateTime
        });
        if (countdown == 0) return true;
        countdown--;
        return false;
    }

    let cdITV = setInterval(() => {
        if (setITVFunction()) clearInterval(cdITV);
    }, 1000)
}


cityWeather('Berlin')
    .then(data => {
        if (data.cod === 401) {
            console.error('Invalid API key');
            if (!process.server) server.close();
        } else {
            /**
             * read latest '/weather.json' file
             */
            fs.readFile(p_public_res + '/weather.json', (err, data) => {
                if (err) throw err;
                memoryWeather = data;
            })

            /**
             * Sends latest weather data from object
             */
            app.use("/memoryWeather", (req, res, next) => {
                res.send(memoryWeather);
                next();
            })

            /**
             * Sends latest weather data from file
             */
            app.use("/weather.json", (req, res, next) => {
                fs.readFile(p_public_res + '/weather.json', (err, data) => {
                    if (err) throw err;
                    res.send(data);
                })
            })

            /**
             * Static public folder for everything else
             */
            app.use(express.static(__dirname + "/public"))


            /**
             * socketIO for updating the clients countdown
             */
            // let weatherIO = socket(server);

            weatherIO.on('connection', function (socket) {
                console.log('made socket connection', socket.id);
            })

            weatherITVFunction();
            let weatherITV = setInterval(() => {
                weatherITVFunction(() => {
                    console.log("freshData");
                    weatherIO.emit('freshData');
                });
            }, updateTime * 1000)
        }
    })
    .catch(err => console.log(err))


