// Obtiene las categorías de la API, las muestra y permite ordenarlas

const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
    const result = {
        "AZ": () => {
            return array.toSorted((a, b) => a.name.localeCompare(b.name))
        },
        "ZA": () => {
            return array.toSorted((a, b) => b.name.localeCompare(a.name))
        },
        "Cant.": () => {
            return array.toSorted((a, b) => a.productCount - b.productCount)
        }
    }

    return result[criteria]();
}

// Esta función es la encargada de enviar al localStorage el ID de la categoría en la que hagamos click en categories.html
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            // El primer div tiene un eventListener que hace uso de la función setCatID
            // Gracias a esa función, si hacemos click en la categoria autos, va a aparecer en el localStorage lo siguiente =>  Key=catID Value=101  
            // Si tocamos en juguetes, va a ser Key=catID Value=102  
            // Si tocamos en muebles, va a ser Key=catID Value=103 y asi...  
            htmlContentToAppend += `
    <div onclick="setCatID(${category.id})" class="col-12 col-sm-6 col-md-4 col-lg-3">

                <div class='card cursor-active product'>
                    <img class="card-img-top" src="${category.imgSrc}" alt="Cat img">
                    <div class='card-body'>
                        <div class='card-title text-center'>
                            <h3>${category.name}</h3>
                        </div>
                        <div class='overflow-auto' style='height:70px;'>
                            <p>${category.description}</p>
                        </div>
                    </div>
                    <div class='card-footer text-center'>
                        <small class="text-muted">${category.productCount} productos</small>
                    </div>
                </div>
    </div>
`;
        }

        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
    applyDarkStyles()
    
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
let showSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
    document.getElementById("spinner-wrapper").style.display = "none";
}

const getCategories = (url) => {
    let result = {};
    showSpinner();
    return fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then((response) => {
            result.status = 'ok';
            result.data = response;
            return result;
        })
        .catch((error) => {
            result.status = 'error';
            result.data = error;
            return result;
        })
        .finally(() => {
            hideSpinner();
        })
}

document.addEventListener("DOMContentLoaded", function (e) {
    getCategories(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data
            showCategoriesList()
            applyDarkStyles()
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList();
        applyDarkStyles();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showCategoriesList();
        applyDarkStyles();
    });
});