document.addEventListener('DOMContentLoaded', main);

const darkModeBtn = document.getElementById('btn-darkmode');
const body = document.querySelector('body');
const cardsCollection = document.getElementsByClassName('product');
const footerCollection = document.getElementsByClassName('footer');
const filtersCollection = document.getElementsByClassName('filters');

darkModeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    storeDarkModeState(body.classList.contains('dark-mode'));
    updateCardStyles();
    location.reload()
});

function main() {
    loadDarkModeState();
    updateCardStyles();
}

function storeDarkModeState(value) {
    localStorage.setItem('darkmode', value ? 'true' : 'false');
}

function loadDarkModeState() {
    const darkmode = localStorage.getItem('darkmode');
    if (darkmode === 'true') {
        body.classList.add('dark-mode');
        document.querySelector('#dl-icon').setAttribute('class', 'bi bi-sun-fill text-white');
    } else {
        document.querySelector('#dl-icon').setAttribute('class', 'bi bi-moon-fill text-white');
    }
}

function updateCardStyles() {
    const darkmode = body.classList.contains('dark-mode');

    setTimeout(() => {
        Array.from(cardsCollection).forEach(elem => {
            elem.classList.toggle('product', !darkmode);
            elem.classList.toggle('dark-product', darkmode);
        });
    }, 300);

    Array.from(footerCollection).forEach(elem => {
        elem.classList.toggle('footer', !darkmode)
        elem.classList.toggle('dark-footer', darkmode)
    })

    Array.from(filtersCollection).forEach(elem => {
        elem.classList.toggle('filters', !darkmode)
        elem.classList.toggle('dark-filters', darkmode)
    })

}