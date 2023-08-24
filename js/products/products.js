const productContainer = document.getElementById('productContainer');

const storedValue = localStorage.getItem('catID'); // Se obtiene el catID que se encuentra en el localstorage, el cual fue guardado en categories.js

const URL = `https://japceibal.github.io/emercado-api/cats_products/${storedValue}.json`

const pageTitle = document.getElementById('page-title');
const prodTitle = document.getElementById('product-title');
const buscar = document.getElementById('buscar');

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
    const filteredProducts = productArray.filter(product => product.cost >= minCount && product.cost <= maxCount);

    switch (sortOption) {
        case 'asc':
            filteredProducts.sort((a, b) => a.cost - b.cost);
            break;
        case 'desc':
            filteredProducts.sort((a, b) => b.cost - a.cost);
            break;
        case 'count':
            filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
            break;
        default:
    }

    let template = ``;

    for (let product of filteredProducts) {

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



//Funcionalidad de los input radio 
const sortAsc = document.getElementById('sortAsc');
const sortCount = document.getElementById('sortByCount');
const sortDesc = document.getElementById('sortDesc');

sortAsc.addEventListener('change', () => {
    sortOption = 'asc';
    showProducts(productsDataGlobal);
    sortAsc.checked = false
});

sortDesc.addEventListener('change', () => {
    sortOption = 'desc';
    showProducts(productsDataGlobal);
    sortDesc.checked = false
});

sortCount.addEventListener('change', () => {
    sortOption = 'count';
    showProducts(productsDataGlobal);
    sortCount.checked = false
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


buscar.addEventListener('input', () => {
    if (buscar.value.length >= 1) {
        const filteredData = productsDataGlobal.filter((word) => {
            const name = word.name.toLowerCase().includes(buscar.value.toLowerCase());
            const descripcion = word.description.toLowerCase().includes(buscar.value.toLowerCase());
            return name || descripcion;
        });

        console.log(filteredData);
        showProducts(filteredData);
    } else {
        showProducts(productsDataGlobal);
    }
});


document.addEventListener('DOMContentLoaded', getProducts);