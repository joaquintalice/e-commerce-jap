document.addEventListener('DOMContentLoaded', () => {
    getProducts()
});

const dataContainer = document.getElementById('data-container');

async function getProducts() {

    const storedValue = localStorage.getItem('productID'); // Se obtiene el ProductID que se encuentra en el localstorage, el cual fue guardado en categories.js
    const URL = `https://japceibal.github.io/emercado-api/products/${storedValue}.json`;

    const response = await fetch(URL);

    if (!response.ok) throw new Error(`Code error:${response.status}`);

    const data = await response.json();

    console.log(data)


    showProducts(data);


}


function showProducts(objeto) {

    const { id, category, cost, currency, description, name, images, relatedProducts, soldCount } = objeto

    console.log(images)

    const img1 = images[0]

    const img2 = images[1]

    const img3 = images[2]

    const img4 = images[3]

    let template =
        `
            <div class='col-12'>

                <div class="row">
                    <div class="col-12 text-center my-5">
                        <h1>${name}</h1>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <h3>Precio</h3>
                        <p>${cost}</p>        
                    </div>
                    <div class="col-12">
                        <h3>Descripción</h3>
                        <p>${description}</p>    
                    </div>
                    <div class="col-12">
                        <h3>Categoría</h3>
                        <p>${category}</p>
                    </div>
                    <div class="col-12">
                        <h3>Vendidos</h3>
                        <p>${soldCount}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-6 col-md-4 my-3">
                        <img src="${img1}" alt="Imagenes representativas de ${name}">
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 my-3">
                        <img src="${img2}" alt="Imagenes representativas de ${name}">
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 my-3">
                        <img src="${img3}" alt="Imagenes representativas de ${name}">
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 my-3">
                        <img src="${img4}" alt="Imagenes representativas de ${name}">
                    </div>
                </div>

            </div>
            `

    dataContainer.innerHTML = template


}