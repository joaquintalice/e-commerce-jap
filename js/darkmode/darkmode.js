document.addEventListener('DOMContentLoaded', main);

const darkModeBtn = document.getElementById('btn-darkmode');
const body = document.querySelector('body');
const cardsCollection = document.getElementsByClassName('product');
const footerCollection = document.getElementsByClassName('footer');
const filtersCollection = document.getElementsByClassName('filters');

function main() {
    loadDarkModeState();
    const previewDefaultColor = localStorage.getItem("darkmode")

    if (!previewDefaultColor) {
        const defaultColor = getPreferredColorScheme();
        storeDarkModeState(defaultColor)

        if (defaultColor) {
            // El sistema del usuario prefiere el modo oscuro
            switchMode()
        }
    } else {

        if (JSON.parse(previewDefaultColor) === "true") {
            initialDarkMode()
        }
    }

}

function getPreferredColorScheme() {
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return colorScheme;
}

darkModeBtn.addEventListener('click', () => {
    switchMode()
    loadDarkModeState()
});

function initialDarkMode() {

    if (body.classList.contains('dark-mode')) {
        const cards = document.getElementsByClassName("card")
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add("dark-default")
        }

        const btns = document.getElementsByClassName("btn")

        for (let i = 0; i < btns.length; i++) {
            btns[i].classList.add("dark-default")
        }
    }
}

function switchMode() {
    body.classList.toggle('dark-mode');
    storeDarkModeState(body.classList.contains('dark-mode'));
    cardsStyle();
    buttonStyle();
}

function storeDarkModeState(value) {
    localStorage.setItem('darkmode', value ? JSON.stringify('true') : JSON.stringify('false'));
}

function loadDarkModeState() {
    const darkmode = JSON.parse(localStorage.getItem('darkmode'));
    if (darkmode === 'true') {
        body.classList.add('dark-mode');
        document.querySelector('#dl-icon').setAttribute('class', 'bi bi-sun-fill text-white');
    } else {
        document.querySelector('#dl-icon').setAttribute('class', 'bi bi-moon-fill text-white');
    }
}


function cardsStyle() {
    const cards = document.getElementsByClassName("card")
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("dark-default")
    }
}

function buttonStyle() {
    const btns = document.getElementsByClassName("btn")
    for (let i = 0; i < btns.length; i++) {

        btns[i].classList.toggle("dark-default")
    }
}