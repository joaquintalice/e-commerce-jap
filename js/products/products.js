document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    inputRadioEvents();
    filterProductsEvents();
    searchProductEvent();
});

const buscar = document.getElementById('buscar');

let productsDataGlobal = [] // Contendrá el array de productos disponible para usar globalmente en caso de que el fetch los traiga correctamente.

// Función que obtiene los productos de la categoría seleccionada

async function getProducts() {
    const pageTitle = document.getElementById('page-title');
    const prodTitle = document.getElementById('product-title');
    const storedValue = localStorage.getItem('catID'); // Se obtiene el catID que se encuentra en el localstorage, el cual fue guardado en categories.js
    const URL = `https://e-mercado-backend-dev.fl0.io/category/${storedValue}`;

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Code error:${response.status}`);

    const data = await response.json();



    const { Product, name } = data;

    console.log(Product)

    showProducts(Product);

    prodTitle.innerHTML = name;
    pageTitle.innerHTML = `eMercado - ${name}`;

    productsDataGlobal = Product; // Guardamos los products en una variable global para poderla usar afuera de este scope.
}

function setProductID(id) {
    localStorage.setItem("productID", id);
    window.location = "product-info.html"
}


// Función que muestra los productos en el DOM

function showProducts(productsArray) {
    const productContainer = document.getElementById('productContainer');

    let template = ``;
    if (productsArray.length >= 1) {

        for (let product of productsArray) {
            const { id, image, name, cost, currency, description, soldCount } = product
            const img = image[0]
            template +=
                `
            <div onclick="setProductID(${id})" class="col-12 col-md-4 col-xxl-3 d-flex mt-5">
                <div class="card cursor-active product" >
                    <img class="card-img-top" src="${img}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p>${currency} ${cost}</p>
                        <p class="card-text">${description}</p>
                    </div>
                        
                    <div class="card-footer">
                        <h6>Vendidos: ${soldCount}</h6>
                    </div>
                </div>
            </div>
        `;
        };
    } else {
        template = `
                <div class="col-12 mt-5 text-center text-danger" >
                        <h5 style="margin-top:2rem;">No se encontraron productos</h5>
                </div>
        `
    }
    productContainer.innerHTML = template;
}

function filterProductosFor(productsArray, minCount, maxCount) {
    const filteredProducts = productsArray.filter(product => product.cost >= minCount && product.cost <= maxCount);
    return filteredProducts;
}

function productsOrdered(arrProducts, order) {
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
            console.log(products);

            showProducts(products);
            input.checked = false
        });
    });
}


// Funcionalidad del botón de limpiar

function filterProductsEvents() {
    const inputMin = document.getElementById('rangeFilterCountMin');
    const inputMax = document.getElementById('rangeFilterCountMax');

    document.getElementById('rangeFilterCountMin').addEventListener('input', () => {
        const minCount = parseInt(inputMin.value) ? parseInt(inputMin.value) : 0; // Si el inputMin.value es NaN, se le asigna el valor 0.
        const maxCount = parseInt(inputMax.value) ? parseInt(inputMax.value) : Infinity; // Si el inputMax.value es NaN, se le asigna el valor Infinity.
        const products = filterProductosFor(productsDataGlobal, minCount, maxCount);

        showProducts(products);
    });

    document.getElementById('rangeFilterCountMax').addEventListener('input', () => {
        const minCount = parseInt(inputMin.value) ? parseInt(inputMin.value) : 0; // Si el inputMin.value es NaN, se le asigna el valor 0.
        const maxCount = parseInt(inputMax.value) ? parseInt(inputMax.value) : Infinity; // Si el inputMax.value es NaN, se le asigna el valor Infinity.
        const products = filterProductosFor(productsDataGlobal, minCount, maxCount);
        //console.log(products);

        showProducts(products);
    });


    document.getElementById('clearRangeFilter').addEventListener('click', () => {
        inputMin.value = '';
        inputMax.value = '';
        buscar.value = '';
        showProducts(productsDataGlobal);
    });
}



// Funcionalidad del buscador
function searchProductEvent() {

    buscar.addEventListener('input', () => {
        if (buscar.value.length < 1) {
            showProducts(productsDataGlobal);
            return;
        }

        const filteredData = productsDataGlobal.filter((product) => {
            const name = product.name.toLowerCase().includes(buscar.value.toLowerCase());
            const descripcion = product.description.toLowerCase().includes(buscar.value.toLowerCase());

            return name || descripcion;
        });

        showProducts(filteredData)
    });
}