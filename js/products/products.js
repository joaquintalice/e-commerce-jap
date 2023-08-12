const productContainer = document.getElementById('productContainer');

const storedValue = localStorage.getItem('catID'); // Se obtiene el catID que se encuentra en el localstorage, el cual fue guardado en categories.js

const URL = `https://japceibal.github.io/emercado-api/cats_products/${storedValue}.json`

const pageTitle = document.getElementById('page-title');
const prodTitle = document.getElementById('product-title');

// Valores por defecto
let minCount = 0;
let maxCount = Infinity;
let sortOption = '';
let productsDataGlobal = [] // Contendrá el array de productos disponible para usar globalmente en caso de que el fetch los traiga correctamente.
let globalImg = '';


async function getProducts() {

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Code error:${response.status}`);

    const data = await response.json();

    const { products, catName } = data;

    showProducts(products);

    prodTitle.innerHTML = catName;
    pageTitle.innerHTML = `eMercado - ${catName}`;

    productsDataGlobal = products; // Guardamos los products en una variable global para poderla usar afuera de este scope.

}

function showProducts(productArray) {
    // Filtra el array de productos para obtener los productos que sean mayores a minCount y menores que maxCount.
    // Los cuales, se modifican en base a los eventos que ocurren en los input radio
    const filteredProducts = productArray.filter(product => product.soldCount >= minCount && product.soldCount <= maxCount);

    switch (sortOption) {
        case 'asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'count':
            filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
            break;
        default:

    }



    let template = ``;

    for (let product of filteredProducts) {
        const stockValidation = product.soldCount === 0 ? "Sin Stock" : "Stock:" + product.soldCount

        template +=
            `
            <div class="col-12 col-md-4 col-xxl-3 d-flex mt-5">
                <div class="card" >
                    <img class="card-img-top" src="../${product.image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p>${product.currency} ${product.cost}</p>
                        <p class="card-text">${product.description}</p>
                        </div>
                        <ul class="list-group list-group-flush">
                        <li class="list-group-item">${stockValidation}</li>
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



//Funcionalidad de los input radio 
document.getElementById('sortAsc').addEventListener('change', () => {
    sortOption = 'asc';
    showProducts(productsDataGlobal);
});

document.getElementById('sortDesc').addEventListener('change', () => {
    sortOption = 'desc';
    showProducts(productsDataGlobal);
});

document.getElementById('sortByCount').addEventListener('change', () => {
    sortOption = 'count';
    showProducts(productsDataGlobal);
});



//Funcionalidad de los botónes de filtrar y limpiar

const inputMin = document.getElementById('rangeFilterCountMin');
const inputMax = document.getElementById('rangeFilterCountMax');

document.getElementById('rangeFilterCount').addEventListener('click', () => {
    minCount = parseInt(inputMin.value) || 0;
    maxCount = parseInt(inputMax.value) || Infinity;
    showProducts(productsDataGlobal);
});


document.getElementById('clearRangeFilter').addEventListener('click', () => {
    inputMin.value = '';
    inputMax.value = '';
    minCount = 0;
    maxCount = Infinity;
    sortOption = '';
    showProducts(productsDataGlobal);
});


document.addEventListener('DOMContentLoaded', getProducts);