let touchInfoButton = document.getElementById('touchInfoButton');
let infoModal = document.getElementById('infoModal');
touchInfoButton.onclick = () => {
    infoModal.classList.remove('hidden');
}
let confirmButton = document.getElementsByClassName('confirmButton')[0];
confirmButton.onclick = () => {
    infoModal.classList.add('hidden');
}
