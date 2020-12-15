let menuTopRight = createFullElement('div', ['leaflet-top', 'leaflet-right'], 'menuTopRight');

let mainMapItv = setInterval(() => {
    let cwMap = document.getElementById('map');
    let controlContainer = cwMap.getElementsByClassName('leaflet-control-container')[0];

    if (controlContainer) {
        controlContainer.appendChild(menuTopRight);
        clearInterval(mainMapItv);
    }
}, 300)