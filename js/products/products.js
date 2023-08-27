document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    inputRadioEvents();
    filterProductsEvents();
    searchProductEvent();
});

let productsDataGlobal = [] // Contendrá el array de productos disponible para usar globalmente en caso de que el fetch los traiga correctamente.

// Función que obtiene los productos de la categoría seleccionada

async function getProducts() {
    const pageTitle = document.getElementById('page-title');
    const prodTitle = document.getElementById('product-title');
    const storedValue = localStorage.getItem('catID'); // Se obtiene el catID que se encuentra en el localstorage, el cual fue guardado en categories.js
    const URL = `https://japceibal.github.io/emercado-api/cats_products/${storedValue}.json`;

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Code error:${response.status}`);

    const data = await response.json();

    const { products, catName } = data;


    showProducts(products);

    prodTitle.innerHTML = catName;
    pageTitle.innerHTML = `eMercado - ${catName}`;

    productsDataGlobal = products; // Guardamos los products en una variable global para poderla usar afuera de este scope.
}

// Función que muestra los productos en el DOM

function showProducts(productsArray) {
    const productContainer = document.getElementById('productContainer');

    let template = ``;

    for (let product of productsArray) {

        template +=
            `
            <div class="col-12 col-md-4 col-xxl-3 d-flex mt-5">
                <div class="card" >
                    <img class="card-img-top" src="${product.image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p>${product.currency} ${product.cost}</p>
                        <p class="card-text">${product.description}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item">Vendidos: ${product.soldCount}</li>
                        </ul>
                    <div class="card-footer">
                        <a href="#" class="btn btn-primary">Buy now</a>
                    </div>
                </div>
            </div>
        `;
    };

    productContainer.innerHTML = template;
}

function filterProductosFor(productsArray, minCount, maxCount) {
    const filteredProducts = productsArray.filter(product => product.cost >= minCount && product.cost <= maxCount);
    return filteredProducts;
}

function productsOrdered(arrProducts,order) {
    const sortOption = {
        "sortAsc": () => {
            const productsAsc = arrProducts.toSorted((a, b) => a.cost - b.cost);
            return productsAsc;
        },
        "sortDesc": () => {
            const productsDesc = arrProducts.toSorted((a, b) => b.cost - a.cost);
            return productsDesc;
        },
        "sortByCount": () => {
            const productsCount = arrProducts.toSorted((a, b) => b.soldCount - a.soldCount);
            return productsCount;
        }
    }

    return sortOption[order](); // Retorna el valor de la función que se encuentra en el objeto sortOption.
}

// Funcionalidad de los input radio 

function inputRadioEvents() {
    const sortAsc = document.getElementById('sortAsc');
    const sortCount = document.getElementById('sortByCount');
    const sortDesc = document.getElementById('sortDesc');
    const inputsRadios = [sortAsc, sortCount, sortDesc];

    inputsRadios.forEach(input => {
        input.addEventListener('change', () => {
            const products = productsOrdered(productsDataGlobal, input.id);        
            showProducts(products);
            input.checked = false
        });
    });
}


// Funcionalidad de los botónes de filtrar y limpiar

function filterProductsEvents() {
    const inputMin = document.getElementById('rangeFilterCountMin');
    const inputMax = document.getElementById('rangeFilterCountMax');

    document.getElementById('rangeFilterCount').addEventListener('click', () => {
        const minCount = parseInt(inputMin.value) ? parseInt(inputMin.value) : 0; // Si el inputMin.value es NaN, se le asigna el valor 0.
        const maxCount = parseInt(inputMax.value) ? parseInt(inputMax.value) : Infinity; // Si el inputMax.value es NaN, se le asigna el valor Infinity.
        const products = filterProductosFor(productsDataGlobal, minCount, maxCount);
        showProducts(products);
    });


    document.getElementById('clearRangeFilter').addEventListener('click', () => {
        inputMin.value = '';
        inputMax.value = '';     
        showProducts(productsDataGlobal);
    });
}

// Funcionalidad del buscador

function searchProductEvent() {
    const buscar = document.getElementById('buscar');

    buscar.addEventListener('input', () => {
        if (buscar.value.length < 1) {
            showProducts(productsDataGlobal);
            return;
        }
        const filteredData = productsDataGlobal.filter((word) => {
            const name = word.name.toLowerCase().includes(buscar.value.toLowerCase());
            const descripcion = word.description.toLowerCase().includes(buscar.value.toLowerCase());
            return name || descripcion;
        });
    
        showProducts(filteredData);
    });
}