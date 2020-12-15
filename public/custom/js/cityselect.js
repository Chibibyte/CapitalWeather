let cityselect = createFullElement('div', ['leaflet-control'], 'cityselect');
let cityselect_container = createFullElement('div', undefined, 'cityselect-container');
let select = createFullElement('select', undefined, 'cityselect-select');
let defaultOption = createFullElement('option', ['cityselect-option'], 'cityselect-defaultOption');
defaultOption.setAttribute('disabled', true);
defaultOption.setAttribute('selected', true);
defaultOption.value = "";
defaultOption.innerText = "Select a city";
select.appendChild(defaultOption);

cityselect.title = 'Select a city'

cityselect_container.appendChild(select);
cityselect.appendChild(cityselect_container);


let mapItv = setInterval(() => {
    let menuTopRight = document.getElementById('menuTopRight');

    if (menuTopRight) {
        menuTopRight.appendChild(cityselect);
        clearInterval(mapItv);
    }
}, 300)


let selectListenerContainer = {
    selectListener: function (e) {
        console.log("cityselect event caught", e);
    }
}

select.addEventListener('cityselect', (e) => {
    selectListenerContainer.selectListener(e);
})

let eventTargetContainer = { eventTarget: select };

function cityselectAdd(title, cityId) {
    let option = createFullElement('option', ['cityselect-option']);
    option.value = cityId;
    option.innerText = title;

    option.addEventListener('click', () => {
        let event = new CustomEvent('cityselect', {
            detail: {
                cityId
            }
        })
        eventTargetContainer.eventTarget.dispatchEvent(event);
    })

    select.appendChild(option);
}

function cityselectSetSelectListener(listener) {
    selectListenerContainer.selectListener = listener;
}

function cityselectSetEventTarget(target) {
    eventTargetContainer.eventTarget = target;
}

// window.cityselectSetEventTarget = cityselectSetEventTarget;
window.cityselectSetSelectListener = cityselectSetSelectListener;
window.cityselectAdd = cityselectAdd;

// export default cityselect;