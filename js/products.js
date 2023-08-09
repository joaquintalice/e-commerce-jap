const div = document.getElementById('productContainer');

const URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json'

async function getProducts() {

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Codigo de error:${response.status}`);

    const data = await response.json();

    const { products } = data;

    showProducts(products);

}

function showProducts(productArray) {

    let template = ``;

    for (let product of productArray) {

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
                        <li class="list-group-item">Vendidos: ${product.soldCount}</li>
                        </ul>
                    <div class="card-footer">
                        <a href="#" class="btn btn-primary">Buy now</a>
                    </div>
                </div>
            </div>
        `;
    };

    return div.innerHTML = template;
}

document.addEventListener('DOMContentLoaded', getProducts);