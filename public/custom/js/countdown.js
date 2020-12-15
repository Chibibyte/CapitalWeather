let countdown = createFullElement('div', ['leaflet-control'], 'countdown');
let countdown_container = createFullElement('div', undefined, 'countdown-container');
let countdown_p = createFullElement('p', ['countdown-p']);
let countdown_p_value = createFullElement('p', ['countdown-p-value']);
let span_1 = createFullElement('span', ['balloon_anim_unit', 'anim_sun_1', 'material-icons', 'md-102']);
let span_2 = createFullElement('span', ['balloon_anim_unit', 'anim_sun_2', 'material-icons', 'md-96']);

countdown.title = capitalize('next update');

span_1.innerText = 'brightness_5';
span_2.innerText = 'brightness_5';

countdown.appendChild(countdown_container);
countdown_container.appendChild(countdown_p);
countdown_container.appendChild(countdown_p_value);
countdown_container.appendChild(span_1);
countdown_container.appendChild(span_2);


let mapItv = setInterval(() => {
    let menuTopRight = document.getElementById('menuTopRight');

    if (menuTopRight) {
        if (menuTopRight.children.length > 0) menuTopRight.insertBefore(countdown, menuTopRight.children[0]);
        else menuTopRight.appendChild(countdown);
        clearInterval(mapItv);
    }
}, 100)

export default countdown;