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
            applyDarkStyles()
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

function switchMode() {
    body.classList.toggle('dark-mode');
    storeDarkModeState(body.classList.contains('dark-mode'));
    applyDarkStyles()
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

function applyDarkStyles() {
    const elementsToStyle = [
        ...document.getElementsByClassName("card"),
        ...document.getElementsByClassName("btn"),
        ...document.getElementsByTagName("input"),
        ...document.getElementsByClassName("input-group-text"),
        ...document.getElementsByTagName("select"),
        ...document.getElementsByClassName("resume-list"),
        ...document.getElementsByTagName("textarea"),
        ...document.getElementsByClassName("modal-content"),
        ...document.getElementsByClassName("file-upload-div")

    ];

    const tables = [...document.getElementsByClassName("table")]

    if(tables) {
        tables.forEach((table) => {
            table.classList.add('table-dark');
        });
    }
    
    elementsToStyle.forEach((element) => {
        if (body.classList.contains('dark-mode')) {
            element.classList.add('dark-default');
        } else {
            element.classList.remove('dark-default');
        }
    });

}