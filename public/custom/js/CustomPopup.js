function createFullElement(name, classes, id) {
    let elem = document.createElement(name);
    if (classes) elem.classList.add(...classes);
    if (id) elem.id = id;
    return elem;
}

let materials = {};
materials['visibility'] = 'eye';
materials['temperature'] = 'thermometer-low';
materials['wind'] = 'pinwheel';
materials['airpressure'] = 'gauge-low';
materials['humidity'] = 'opacity';
materials['rain'] = 'grain';
materials['snow'] = 'grain';
materials['cloud'] = 'cloud-outline';
materials['moon'] = 'weather-night';
materials['camera'] = 'videocam';
materials['antenna'] = 'signal_wifi_4_bar';
materials['sending'] = 'wifi';
materials['shock_face'] = 'outlet';
materials['screen'] = 'video_label';
materials['loading'] = 'motion_photos_on';


materials['sun'] = 'white-balance-sunny';

materials['01d'] = 'white-balance-sunny';
materials['02d'] = 'weather-partly-cloudy';
materials['03d'] = 'cloud-outline';
materials['04d'] = 'cloud-outline';
materials['09d'] = 'weather-rainy';
materials['10d'] = 'weather-partly-rainy';
materials['11d'] = 'weather-lightning-rainy';
materials['13d'] = 'weather-snowy-heavy';
materials['50d'] = 'weather-fog';

materials['01n'] = 'weather-night';
materials['02n'] = 'weather-night-partly-cloudy';
materials['03n'] = 'cloud-outline';
materials['04n'] = 'cloud-outline';
materials['09n'] = 'weather-rainy';
materials['10n'] = 'weather-rainy';
materials['11n'] = 'weather-lightning-rainy';
materials['13n'] = 'weather-snowy-heavy';
materials['50n'] = 'weather-fog';

let units = {};
units.temperature = 'C°';
units.airpressure = 'hPa';
units.humidity = '%';
units.wind = 'm/s';
units.rain = 'mm';
units.visibility = 'm';

/**
 * Creates a Material Icon of size md-18 and adds DOM-@classes
 * 
 * @param {string} symbol Name of material icon
 * @param  {...any} classes 
 */
function getMaterial(symbol, ...classes) {
    let mat = document.createElement('span');
    mat.classList.add('material-icons', 'mdi', 'mdi-' + materials[symbol], 'md-36', ...classes);
    // mat.innerHTML = materials[symbol];
    let div = document.createElement('div');
    div.appendChild(mat);
    return div;
}

function capitalize(str) {
    let split = str.split(' ');
    let out = "";
    split.forEach(word => {
        out += word[0].toUpperCase() + word.slice(1) + " ";
    })
    out = out.substring(0, out.length - 1);
    return out;
}

class WeatherEntry {
    constructor(anim = "anim", value = "value", animate = true, title, showAnim = true) {
        this.entry = {};
        this.entry.container = createFullElement('div');
        this.entry.container.classList.add('weather_entry');
        this.entry.anim = getMaterial(showAnim ? anim : '', `barColor-${anim}`, (animate ? 'animate' : 'noanimate'));
        this.entry.anim.classList.add('weather_entry_data');
        this.entry.value = createFullElement('p', ['weather_entry_data']);

        this.entry.container.appendChild(this.entry.anim);
        this.entry.container.appendChild(this.entry.value);

        this._anim = anim;

        this.value = value;

        this.title = title;
    }

    set title(title) {
        let tooltip = title ? title : this._anim;
        this.entry.container.title = capitalize(tooltip);
    }

    set anim(anim) {
        this._anim = anim;
        this.entry.container.removeChild(this.entry.anim);
        this.entry.anim = getMaterial(anim, `barColor-${anim}`, 'animate');
        this.entry.anim.classList.add('weather_entry_data');
        this.entry.container.appendChild(this.entry.anim);
        this.entry.container.appendChild(this.entry.value);
    }

    set value(value) {
        this.entry.value.innerText = value + (units[this._anim] ? ` ${units[this._anim]}` : '');
    }
}

class CustomPopup {
    constructor(cityName = "cityName", clouds = "clouds", desc = "desc",
        humidity = "humidity", icon = "icon", pressure = "pressure",
        rain1h = "rain1h", snow1h = "snow1h", temp = "temp", visibility = "visibility",
        windSpeed = "windSpeed") {

        this.popup = {};
        this.popup.container = createFullElement('div', ['custom_popup']);
        this.popup.cityName = createFullElement('h2');
        this.popup.entries = {};
        this.popup.entries.sun = new WeatherEntry('sun', undefined, false, 'sky');
        this.popup.entries.rain = new WeatherEntry('rain');

        this.popup.entries.humidity = new WeatherEntry('humidity');
        this.popup.entries.temp = new WeatherEntry('temperature', undefined, false, undefined, false);
        this.popup.entries.pressure = new WeatherEntry('airpressure');
        this.popup.entries.visibility = new WeatherEntry('visibility');
        this.popup.entries.windSpeed = new WeatherEntry('wind');

        this.popup.container.appendChild(this.popup.cityName);

        let skyTempDiv = document.createElement('div');
        skyTempDiv.classList.add('skyTempDiv', 'weather_entry');
        skyTempDiv.appendChild(this.popup.entries.sun.entry.container);
        skyTempDiv.appendChild(this.popup.entries.temp.entry.container);
        skyTempDiv.appendChild(this.popup.entries.windSpeed.entry.container);
        this.popup.container.appendChild(skyTempDiv);

        let waterDiv = document.createElement('div');
        waterDiv.classList.add('skyTempDiv', 'waterDiv', 'weather_entry');
        waterDiv.appendChild(this.popup.entries.rain.entry.container);
        waterDiv.appendChild(this.popup.entries.humidity.entry.container);
        this.popup.container.appendChild(waterDiv);

        let pressVis = document.createElement('div');
        pressVis.classList.add('skyTempDiv', 'pressVis', 'weather_entry');
        pressVis.appendChild(this.popup.entries.pressure.entry.container);
        pressVis.appendChild(this.popup.entries.visibility.entry.container);
        this.popup.container.appendChild(pressVis);

        this.cityName = cityName;
        this.clouds = clouds;
        this.desc = desc;
        this.humidity = humidity;
        this.icon = icon;
        this.pressure = pressure;
        this.rain1h = rain1h;
        this.snow1h = snow1h;
        this.temp = temp;
        this.visibility = visibility;
        this.windSpeed = windSpeed;
    }

    set cityName(cityName) {
        this.popup.cityName.innerText = cityName;
    }
    set temp(temp) {
        this.popup.entries.temp.value = temp;
    }
    set pressure(pressure) {
        this.popup.entries.pressure.value = pressure;
    }
    set rain(rain) {
        this.popup.entries.rain.value = rain;
    }
    set visibility(visibility) {
        this.popup.entries.visibility.value = visibility;
    }
    set windSpeed(windSpeed) {
        this.popup.entries.windSpeed.value = windSpeed;
    }
    set humidity(humidity) {
        this.popup.entries.humidity.value = humidity;
    }

    setData(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            if (key == 'icon') {
                // this.popup.entries.sun.value = data.desc;
                this.popup.entries.sun.value = "";
                this.popup.entries.sun.anim = data[key];
                return
            }
            if (key == 'rain1h') {
                this.rain = data['rain1h'] > data['snow1h'] ? data['rain1h'] : data['snow1h'];
                this.popup.entries.sun.title = data.desc;
                return
            }
            if (key == 'sun' || key == 'rain' || key == 'snow') return;

            if (this.popup.entries[key]) this[key] = data[key];
        });
    }
}

window.CustomPopup = CustomPopup;
window.createFullElement = createFullElement;
window.capitalize = capitalize;
