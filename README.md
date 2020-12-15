# CapitalWeather
## Weather webpage for germany's capital cities

CapitalWeather is a little weather website for germany. Here you can see the current weather in every capital of all 16 federal states. Every 20 seconds the server sends an api-call to the current weather api on [api.openweathermap.org](https://api.openweathermap.org) and informs the client via a websocket. The client will then request the data and update the frontend.

I used [QGIS](https://qgis.org/en/site/) with the *qgis2web*-plugin to create most of the map. The *qgis2web*-plugin is great for creating a functional [Leaflet](https://leafletjs.com/) base so you don't have to start with leaflet from the ground up. 

The icons in the popups are from [https://materialdesignicons.com](https://materialdesignicons.com), which I recommend over [material.io](https://material.io/resources/icons/?search=add&style=baseline) since they have a far greater collection.

### Settings
Update the ***secConf.js*** file:

```javascript
/**
 *  Replace with real api key from the "Current Weather"-api at https://openweathermap.org/api
 */
const API_KEY = 'API_KEY_1234';
```

- ***Remember to hide your secrets!***
- ***.gitignore is you friend!***

### Build
Simply run...
```
npm run freshSetup
```
...in the console and ...
```
npm start
```
...to start the server or...
```
npm run dev
```
...for nodemon.

### License
CapitalWeather is licenced under the [MIT license](https://choosealicense.com/licenses/mit/).

### Sources

GIS-Tool: [QGIS](https://qgis.org/en/site/)

Weather api: [api.openweathermap.org](https://api.openweathermap.org).

Javascript map library: [Leaflet](https://leafletjs.com/).

Icons: [materialdesignicons](https://materialdesignicons.com/).

Base map: *Stamen Watercolor* from [https://wiki.openstreetmap.org/wiki/Tiles](https://wiki.openstreetmap.org/wiki/Tiles).