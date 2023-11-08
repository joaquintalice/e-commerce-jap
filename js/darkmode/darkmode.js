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

        const tables = document.getElementsByClassName("table")

        for (let i = 0; i < tables.length; i++) {
            tables[i].classList.add("table-dark")
        }

        const inputs = document.getElementsByTagName("input")

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].classList.add("dark-default")
        }

        const inputsGroup = document.getElementsByClassName("input-group-text")

        for (let i = 0; i < inputsGroup.length; i++) {
            inputsGroup[i].classList.add("dark-default")
        }

        const selects = document.getElementsByTagName("select")

        for (let i = 0; i < selects.length; i++) {
            selects[i].classList.add("dark-default")
        }

        const listItems = document.getElementsByClassName("resume-list")

        for (let i = 0; i < listItems.length; i++) {
            listItems[i].classList.add("dark-default")
            listItems[i].style = "pointer-events:none;"
        }

        const textAreas = document.getElementsByTagName("textarea")

        for (let i = 0; i < textAreas.length; i++) {
            textAreas[i].classList.add("dark-default")
        }

        const modals = document.getElementsByClassName("modal-content")

        for (let i = 0; i < modals.length; i++) {
            modals[i].classList.add("dark-default")
        }

        const fileUpload = document.getElementsByClassName("file-upload-div")

        for (let i = 0; i < fileUpload.length; i++) {
            fileUpload[i].classList.add("dark-default")
        }

    }
}

function switchMode() {
    body.classList.toggle('dark-mode');
    storeDarkModeState(body.classList.contains('dark-mode'));
    cardsStyle();
    buttonStyle();
    tableStyle();
    inputStyle();
    selectStyle();
    listStyle();
    textAreaStyle();
    modalStyle();
    fileUploadDescriptionStyle();
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

function tableStyle() {
    const cards = document.getElementsByClassName("table")
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("table-dark")
    }
}

function cardsStyle() {
    const cards = document.getElementsByClassName("card")
    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("dark-default")
    }
}

function inputStyle() {
    const inputs = document.getElementsByTagName("input")

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].classList.toggle("dark-default")
    }

    const inputsGroup = document.getElementsByClassName("input-group-text")

    for (let i = 0; i < inputsGroup.length; i++) {
        inputsGroup[i].classList.toggle("dark-default")
    }
}

function selectStyle() {
    const selects = document.getElementsByTagName("select")
    for (let i = 0; i < selects.length; i++) {
        selects[i].classList.toggle("dark-default")
    }
}

function listStyle() {
    const listItems = document.getElementsByClassName("resume-list")

    for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.toggle("dark-default")
    }
}

function buttonStyle() {
    const btns = document.getElementsByClassName("btn")

    for (let i = 0; i < btns.length; i++) {
        btns[i].classList.toggle("dark-default")
    }
}

function textAreaStyle() {
    const textAreas = document.getElementsByTagName("textarea")

    for (let i = 0; i < textAreas.length; i++) {
        textAreas[i].classList.toggle("dark-default")
    }
}

function modalStyle() {
    const modals = document.getElementsByClassName("modal-content")

    for (let i = 0; i < modals.length; i++) {
        modals[i].classList.toggle("dark-default")
    }
}

function fileUploadDescriptionStyle() {
    const fileUpload = document.getElementsByClassName("file-upload-div")
    fileUpload[0] ? fileUpload[0].classList.toggle("dark-default") : null

}

