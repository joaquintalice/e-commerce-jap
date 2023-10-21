//endpoint https://japceibal.github.io/emercado-api/user_cart/25801.json

document.addEventListener("DOMContentLoaded", () => {
    getCartData().then(() => {
        showCartData();
        updateTotalPrice();
    });
    handleSubmit()
    paymentType()
})

// Obtiene el producto almacenado en el LocalStorage
async function getCartData() {
    const response = await fetch("https://japceibal.github.io/emercado-api/user_cart/25801.json")
    const data = await response.json();
    const lsData = localStorage.getItem('carrito');
    if (!lsData) {
        localStorage.setItem('carrito', JSON.stringify(data.articles))
    }
    return data
}

// Muestra los productos del carrito
function showCartData() {

    const containerArticles = document.getElementById("data-container");
    const productsStorage = JSON.parse(localStorage.getItem("carrito"));

    if (productsStorage && productsStorage.length > 0) {
        productsStorage.map((element, index) => {
            const row = document.createElement("tr");

            const { name, count, unitCost, currency, image, id } = element;
            const subtotal = unitCost * count;
            row.innerHTML += `
                <td><img width="120px" src="${image}" alt="Image ${name}"/></td>
                <td>${name}</td>
                <td>${currency} ${unitCost}</td>
                <td><input type="number" id="${id}" min="1" max="100" value="${count}"></td>
                <td id="subtotal${index}">${currency} ${subtotal}</td>
                <td><button class="btn btn-danger" onclick="deleteProduct(${id})"><i class="bi bi-trash3"></i></button></td>
            `;
            containerArticles.appendChild(row);


            // Controlador de eventos para actualizar el subtotal según lo que se ingrese en el input
            document.getElementById(`${id}`).addEventListener('input', (event) => {

                const productsStorage = JSON.parse(localStorage.getItem("carrito"));

                if (event.target.value < 1) {
                    event.target.value = 1;
                }
                if (event.target.value > 1000) {
                    event.target.value = 1000;
                }
                let newCount = event.target.value;
                const newSubtotal = (unitCost) * newCount;


                const findProduct = productsStorage.find(element => +element.id === +event.target.id);
                const filteredProds = productsStorage.filter(elem => +elem.id != +event.target.id);

                const prodModified = {
                    ...findProduct,
                    count: +newCount
                }

                localStorage.setItem('carrito', JSON.stringify([...filteredProds, prodModified]));

                document.getElementById(`subtotal${index}`).innerText = `${currency} ${newSubtotal}`;

                updateTotalPrice();
            });

        });
    } else {
        const row = document.createElement("tr");
        row.innerHTML += `
                <td class='bg-danger text-white fw-bolder'>No</td>
                <td class='bg-danger text-white fw-bolder'>hay</td>
                <td class='bg-danger text-white fw-bolder'>productos</td>
                <td class='bg-danger text-white fw-bolder'>en</td>
                <td class='bg-danger text-white fw-bolder'>el</td>
                <td class='bg-danger text-white fw-bolder'>carrito</td>
            `;
        containerArticles.appendChild(row);
    }
}


function updateTotalPrice() {
    const subtotalHtml = document.getElementById('subtotal')
    const deliveryCostHtml = document.getElementById('costo-envio')
    const totalHtml = document.getElementById('total')

    const lsData = JSON.parse(localStorage.getItem('carrito'));
    let subtotal = 0;
    lsData.map(element => {
        subtotal += element.unitCost * element.count
    })

    const selectDelivery = document.getElementById('select-delivery');

    const total = {
        "Premium": subtotal * 1.15,
        "Express": subtotal * 1.07,
        "Standard": subtotal * 1.05
    }

    const deliveryCost = {
        "Premium": subtotal * 0.15,
        "Express": subtotal * 0.07,
        "Standard": subtotal * 0.05
    }

    const totalPrice = deliveryCost[selectDelivery.value];

    subtotalHtml.innerHTML = `USD ${!isNaN(+parseFloat(totalPrice)) ? +parseFloat(totalPrice).toFixed(2) : 0} `
    deliveryCostHtml.innerHTML = `USD ${subtotal} `
    totalHtml.innerHTML = `USD ${parseFloat(total[selectDelivery.value]).toFixed(2) ?? 0} `

    selectDelivery.addEventListener('change', () => {
        updateTotalPrice()
    })

}

function paymentType() {
    const formaDePagoContainer = document.getElementById('formaDePagoSpan');
    const credito = document.getElementById("credito")
    const numeroTarjeta = document.getElementById("numeroCredito");
    const codigoSeguridad = document.getElementById("codigoSeguridad");
    const vencimiento = document.getElementById("vencimiento");

    const transferencia = document.getElementById("transferencia");
    const numeroCuenta = document.getElementById("numeroCuenta");

    credito.addEventListener("change", (e) => {
        if (e.target.value) {
            numeroTarjeta.disabled = false;
            codigoSeguridad.disabled = false;
            vencimiento.disabled = false;
            numeroCuenta.disabled = true;
            formaDePagoContainer.textContent = 'Tarjeta de crédito'
        }
    })

    transferencia.addEventListener("change", (e) => {
        if (e.target.value) {
            numeroTarjeta.disabled = true;
            codigoSeguridad.disabled = true;
            numeroCuenta.disabled = false;
            vencimiento.disabled = true;
            formaDePagoContainer.textContent = 'Transferencia Bancaria';

        }
    })

}

function handleSubmit() {
    const saleBtn = document.getElementById('sale-btn');
    const formaDePagoContainer = document.getElementById('formaDePagoSpan');
    const paymentTypeAlert = document.getElementById('paymentType-alert');
    const successSaleAlert = document.getElementById('success-sale');

    const calleAlertContainer = document.getElementById("nombreDeCalleAlertContainer")
    const numPuertaAlertContainer = document.getElementById("numeroDePuertaAlertContainer")
    const esquinaAlertContainer = document.getElementById("nombreDeEsquinaAlertContainer")

    // Datos obligatorios
    const calle = document.getElementById("calleNombre")
    const numero = document.getElementById("numeroPuerta")
    const esquina = document.getElementById("esquinaNombre")

    // Datos tarjeta
    const credito = document.getElementById("credito");
    const numeroTarjeta = document.getElementById("numeroCredito")
    const codigoSeguridad = document.getElementById('codigoSeguridad')
    const vencimiento = document.getElementById("vencimiento")

    // Datos cuenta bancaria
    const transferencia = document.getElementById("transferencia")
    const numeroCuenta = document.getElementById("numeroCuenta")


    saleBtn.addEventListener('click', () => {

        const lsData = JSON.parse(localStorage.getItem('carrito'));

        if (!calle.value) {
            calleAlertContainer.classList.remove('d-none')
            calleAlertContainer.classList.add('d-flex')
        } else {
            calleAlertContainer.classList.add('d-none')
            calleAlertContainer.classList.remove('d-flex')
        }

        if (!numero.value) {
            numPuertaAlertContainer.classList.remove('d-none')
            numPuertaAlertContainer.classList.add('d-flex')
        } else {
            numPuertaAlertContainer.classList.add('d-none')
            numPuertaAlertContainer.classList.remove('d-flex')
        }

        if (!esquina.value) {
            esquinaAlertContainer.classList.remove('d-none')
            esquinaAlertContainer.classList.add('d-flex')
        } else {
            esquinaAlertContainer.classList.add('d-none')
            esquinaAlertContainer.classList.remove('d-flex')
        }

        const formaDePago = formaDePagoContainer.textContent != 'No ha seleccionado';

        if (!formaDePago) {
            paymentTypeAlert.classList.remove('d-none')
            paymentTypeAlert.classList.add('d-flex')
            return;
        } else {
            paymentTypeAlert.classList.remove('d-flex')
            paymentTypeAlert.classList.add('d-none')
        }

        if ((!numeroTarjeta.value || !codigoSeguridad.value || !vencimiento.value) && credito.checked) {
            paymentTypeAlert.textContent = 'Faltan datos de la tarjeta'

            paymentTypeAlert.classList.remove('d-none')
            paymentTypeAlert.classList.add('d-flex')
            return;
        }
        else if (!numeroCuenta.value && transferencia.checked) {
            paymentTypeAlert.textContent = 'Faltan datos de la cuenta bancaria'

            paymentTypeAlert.classList.remove('d-none')
            paymentTypeAlert.classList.add('d-flex')
            return;
        }
        paymentTypeAlert.classList.remove('d-flex');
        paymentTypeAlert.classList.add('d-none');


        if (!lsData.length) {
            alert('no hay productos jiji')
            return;
        }

        if (!calle.value || !numero.value || !esquina.value) return;

        successSaleAlert.classList.remove('d-none')
        successSaleAlert.classList.add('d-flex')
        localStorage.setItem('carrito', JSON.stringify([]));
        setTimeout(() => {
            location.reload()
        }, 1000);
    })


}

function deleteProduct(id) {
    const lsData = JSON.parse(localStorage.getItem('carrito'));
    const filteredData = lsData.filter(prod => prod.id != id)
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(filteredData));

    const containerArticles = document.getElementById("data-container");
    while (containerArticles.firstChild) {
        containerArticles.removeChild(containerArticles.firstChild);
    }

    updateTotalPrice()
    showCartData();
}